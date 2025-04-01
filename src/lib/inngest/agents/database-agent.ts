import { createAgent, createTool, openai } from "@inngest/agent-kit";
import { z } from "zod";
import { updateReceipt } from "@/db/queries/receipt";
import { tryCatch } from "@/lib/utils";

const saveToDatabaseTool = createTool({
  name: "save-to-database",
  description: "Saves the receipt information to the database",
  parameters: z.object({
    id: z.string().describe("The ID of the of the receipt to update"),
    imageUrl: z.string().describe("The URL of the receipt image"),
    filePath: z
      .string()
      .describe("The path to the receipt file in our Supabase storage"),
    status: z
      .enum(["pending", "processing", "processed", "failed"])
      .describe(
        "The status of the receipt. Before and whilst you are running, it should be pending, once you are ready to save it should be processed",
      ),
    vendor: z.string().describe("The name of the establishment/vendor"),
    totalAmount: z.string().describe("The total amount spent on the receipt"),
    purchaseDate: z
      .string()
      .describe("The date of the receipt in ISO 8601 format"),
    userId: z
      .string()
      .describe(
        "The ID of the user who owns the receipt (you don't need to edit this field)",
      ),
    rawText: z
      .string()
      .describe(
        "The raw text of the receipt. This should be the JSON output of the receipt scan agent",
      ),
  }),
  handler: async (params, { step }) => {
    try {
      const result = await step?.run("save-to-database", async () => {
        return await updateReceipt({
          id: params.id,
          vendor: params.vendor,
          totalAmount: parseInt(params.totalAmount),
          purchaseDate: new Date(params.purchaseDate),
          rawText: params.rawText,
          status: params.status,
        });
      });

      return result;
    } catch (err) {
      console.error("Error in saveToDatabaseTool:", err);
      throw new Error(err as any);
    }
  },
});

export const databaseAgent = createAgent({
  name: "Database agent",
  description: "Responsible for saving the receipt information to the database",
  system: `You are a helpful assistant that saves the receipt information to the database. You are tasked with:
    - Saving the vendor name
    - Saving the total amount spent on the receipt
    - Saving the purchase date
    - Saving the raw text of the receipt
    - Saving the status of the receipt
    Ensure all dates are in ISO 8601 format
    Ensure all amounts are in GBP
    `,
  model: openai({
    model: "gpt-4-turbo-preview",
    defaultParameters: {
      max_completion_tokens: 1000,
    },
  }),
  tools: [saveToDatabaseTool],
});
