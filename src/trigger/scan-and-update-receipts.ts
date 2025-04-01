import { logger, task } from "@trigger.dev/sdk/v3";
import { generateText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { updateReceipt } from "@/db/queries/receipt";
import { z } from "zod";
import sharp from "sharp";

interface ReceiptLineItem {
  name: string;
  quantity?: number;
  price: number;
}

interface ExtractedReceipt {
  vendor: string;
  purchase_date: string;
  total_amount: number;
  raw_text: string;
  line_items: ReceiptLineItem[];
}

const lineItemSchema = z.object({
  name: z
    .string()
    .nullable()
    .transform((val) => val || "Unknown Item")
    .describe("Name or description of the item"),
  quantity: z
    .number()
    .nullable()
    .transform((val) => val || 1)
    .describe("Quantity of the item (if applicable)"),
  price: z
    .union([z.number(), z.string().nullable()])
    .transform((val) => {
      if (val === null || val === "null") return 0;
      if (typeof val === "string") return parseFloat(val) || 0;
      return val;
    })
    .describe("Price of the item in GBP (without currency symbols)"),
});

const receiptSchema = z.object({
  vendor: z
    .string()
    .nullable()
    .transform((val) => val || "Unknown Vendor")
    .describe("The name of the establishment or vendor of the receipt"),
  purchase_date: z
    .string()
    .nullable()
    .transform((val) => val || new Date().toISOString().split("T")[0])
    .describe("The date of the receipt in ISO format (YYYY-MM-DD)"),
  total_amount: z
    .union([z.number(), z.string().nullable()])
    .transform((val) => {
      if (val === null || val === "null") return 0;
      if (typeof val === "string") return parseFloat(val) || 0;
      return val;
    })
    .describe(
      "The total amount on the receipt in GBP (without currency symbols)",
    ),
  raw_text: z
    .string()
    .nullable()
    .transform((val) => val || "")
    .describe("The complete raw text content of the receipt"),
  line_items: z
    .array(lineItemSchema)
    .nullable()
    .transform((val) => val || [])
    .describe("Array of individual items from the receipt"),
});

export const scanAndUpdateReceiptsTask = task({
  id: "scan-and-update-receipts",
  run: async (payload: {
    receiptId: string;
    filePath: string;
  }): Promise<ExtractedReceipt> => {
    try {
      // Update status to processing
      await updateReceipt({
        id: payload.receiptId,
        status: "processing",
      });

      const chatCompletion = await generateText({
        model: anthropic("claude-3-5-sonnet-20240620"),
        system:
          "You are a receipt information extraction assistant. You MUST use the extractReceiptTool to return your analysis. Do not provide any other response.",
        prompt: `Extract information from this receipt image. You MUST use the extractReceiptTool to return the following information:

Required fields (use null if unclear):
- vendor: The store or business name
- purchase_date: Date in YYYY-MM-DD format
- total_amount: Numeric amount without currency symbols (e.g., 10.99 not £10.99)
- raw_text: All visible text from the receipt
- line_items: Array of items, each with:
  - name: Item description
  - quantity: Numeric quantity
  - price: Numeric price without currency symbols

Here is the receipt image URL: ${payload.filePath}`,
        tools: {
          extractReceiptTool: {
            description:
              "Use this tool to return the extracted receipt information",
            parameters: receiptSchema,
          },
        },
      });

      // Add better error handling for missing tool results
      if (!chatCompletion.toolCalls || chatCompletion.toolCalls.length === 0) {
        logger.error("No tool calls returned from AI", { chatCompletion });
        throw new Error(
          "Failed to extract receipt information: No tool results returned",
        );
      }

      const extractedInfo = chatCompletion.toolCalls[0]
        .args as ExtractedReceipt;
      if (!extractedInfo) {
        logger.error("Tool result is undefined", { chatCompletion });
        throw new Error(
          "Failed to extract receipt information: Invalid tool result",
        );
      }

      // Log the extracted info for debugging
      logger.info("Extracted receipt information", { extractedInfo });

      // Validate the extracted info has required fields
      if (!extractedInfo.vendor || !extractedInfo.purchase_date) {
        throw new Error("Failed to extract required receipt information");
      }

      // Update the receipt record in the database
      const [updatedReceipt] = await updateReceipt({
        id: payload.receiptId,
        vendor: extractedInfo.vendor,
        totalAmount: Math.round((extractedInfo.total_amount || 0) * 100),
        purchaseDate: new Date(extractedInfo.purchase_date),
        status: "processed",
        rawText: extractedInfo.raw_text || "",
      });

      logger.info("Updated receipt in database", { updatedReceipt });

      return extractedInfo;
    } catch (error) {
      logger.error("Failed to process receipt", { error });

      // Update receipt status to failed
      await updateReceipt({
        id: payload.receiptId,
        status: "failed",
      });

      throw error;
    }
  },
});
