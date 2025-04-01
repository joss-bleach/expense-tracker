import { createAgent, createTool, openai } from "@inngest/agent-kit";
import { z } from "zod";

const parseReceiptTool = createTool({
  name: "parse-receipt",
  description: "Parses the receipt and extracts the data",
  parameters: z.object({
    filePath: z.string().describe("The URL of the receipt image"),
  }),
  handler: async ({ filePath }, { step }) => {
    try {
      return await step?.ai.infer("parse-receipt", {
        model: openai({
          model: "gpt-4o-mini",
        }),
        body: {
          messages: [
            {
              role: "user",
              content: `Please analyze this receipt image: ${filePath}

Extract the data from the receipt and return the structured output as follows:
{
    "vendor": "Store name",
    "totalAmount": "Total amount spent on the receipt",
    "purchaseDate": "Date of the receipt",
    "rawText": [
        {
            "itemName": "Name of the item",
            "quanitity": "Quanitity of individual item if applicable",
            "price": "Price of individual item"
        }
    ]
}`,
            },
          ],
        },
      });
    } catch (err) {
      throw new Error(err as any);
    }
  },
});

export const receiptScanAgent = createAgent({
  name: "Receipt scanning agent",
  description: "Responsible for scanning the receipt and extracting the data",
  system: `You are a helpful assistant that takes the image of a receipt and extracts the data from it. In particular, you are tasked with indentifying and parsing:
    - The vendor name
    - The total amount spent on the receipt
    - The purchase date
    - The raw text of the receipt
    If you are unable to identify any of these, please clearly state by returning "Cannot identify automatically".
    Ensure high accuracy by detecting OCR errors and correcting misread text when possible
    All dates should be in ISO 8601 format
    All amounts should be formatted for GBP
    You must be able to handle multiple formats for receipts
    Maintain a structured JSON output for easy integration with databases
    `,
  model: openai({
    model: "gpt-4o-mini",
  }),
  tools: [parseReceiptTool],
});
