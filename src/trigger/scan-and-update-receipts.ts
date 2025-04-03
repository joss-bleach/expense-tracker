import { logger, task } from "@trigger.dev/sdk/v3";
import { openai } from "@ai-sdk/openai";
import { anthropic } from "@ai-sdk/anthropic";
import { generateObject } from "ai";
import { z } from "zod";
import { updateReceipt } from "@/db/queries/receipt";

// Initialize OpenAI client
const ai = openai;

// Define the schema for receipt extraction
const receiptSchema = z.object({
  vendor: z.string().describe("The name of the store or business"),
  totalAmount: z
    .number()
    .describe("The total amount in pence (e.g., £10.50 = 1050)"),
  purchaseDate: z
    .string()
    .describe("The date of purchase in YYYY-MM-DD format"),
});

export const scanAndUpdateReceiptsTask = task({
  id: "scan-and-update-receipts",
  run: async (payload: {
    receiptId: string;
    rawJson: string;
  }): Promise<void> => {
    logger.info("Starting receipt information extraction", {
      receiptId: payload.receiptId,
      rawJson: payload.rawJson,
    });

    try {
      await updateReceipt({
        id: payload.receiptId,
        status: "analysing",
      });

      const { object: extractedData } = await generateObject({
        model: ai("gpt-4o-mini"),
        schema: receiptSchema,
        schemaName: "Receipt",
        schemaDescription: "Information extracted from a UK receipt",
        prompt: `
        You are a data extraction AI, specialising in analysing and extracting key information from receipts. Given the raw text from a receipt, extract the following fields and return them in JSON format. Ensure all monetary values in pound sterling are converted to pence (e.g., £12.34 becomes 1234). If a field is not present, return null.

        **Receipt Text:**
        ${payload.rawJson}

      **Required Fields:**
      - vendor: The name of the store or vendor.
      - purchaseDate: The full date of the transaction in YYYY-MM-DD format.
      - totalAmount: The total amount paid, converted to pence (integer).`,
      });

      await updateReceipt({
        id: payload.receiptId,
        vendor: extractedData.vendor,
        totalAmount: extractedData.totalAmount,
        purchaseDate: new Date(extractedData.purchaseDate),
        status: "complete",
      });

      logger.info("Successfully processed receipt", {
        receiptId: payload.receiptId,
        extractedData,
      });
    } catch (error) {
      logger.error("Failed to process receipt", {
        receiptId: payload.receiptId,
        error,
      });

      await updateReceipt({
        id: payload.receiptId,
        status: "failed",
      });
    }
  },
});
