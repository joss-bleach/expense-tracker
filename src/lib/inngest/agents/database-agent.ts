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
      .string()
      .describe(
        "The status of the receipt. Before and whilst you are running, it should be pending, once you are ready to save it should be processed",
      ),
    vendor: z.string().describe("The name of the establishment/vendor"),
    totalAmount: z.string().describe("The total amount spent on the receipt"),
    purchaseDate: z.date().describe("The date of the receipt"),
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
    createdAt: z.date(),
    updatedAt: z.date().describe("This should be the current date and time"),
  }),
  handler: async (params, context) => {
    const { id, vendor, totalAmount, purchaseDate, rawText } = params;

    const result = await context.step?.run("save-to-database", async () => {
      const { data, error } = await tryCatch(
        updateReceipt({
          id,
          vendor,
          totalAmount: parseInt(totalAmount),
          purchaseDate,
          status: "processed",
          rawText,
        }),
      );

      if (data) {
        return {
          savedToDatabase: true,
          id,
          vendor,
          totalAmount,
          purchaseDate,
          rawText,
        };
      } else {
        context.network.state.data.savedToDatabase = false;
        context.network.state.data.receiptId = undefined;
      }
    });

    if (result?.savedToDatabase) {
      context.network.state.data.savedToDatabase = true;
      context.network.state.data.receiptId = result.id;
    }
  },
});

export const databaseAgent = createAgent({
  name: "Database agent",
  description: "Responsible for saving the receipt information to the database",
  system:
    "You are a helpful assistant that takes the key receipt information and saves it to our Supabase database. You should use Drizzle when interacting with the database.",
  model: openai({
    model: "gpt-4o-mini",
    defaultParameters: {
      max_completion_tokens: 1000,
    },
  }),
  tools: [saveToDatabaseTool],
});
