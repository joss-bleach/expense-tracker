import { anthropic, createAgent, createTool, openai } from "@inngest/agent-kit";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";

const parseReceiptTool = createTool({
  name: "parse-receipt",
  description: "Parses the receipt and extracts the data",
  parameters: z.object({
    filePath: z.string().describe("The URL of the receipt image"),
  }),
  handler: async ({ filePath: imageUrl }, { step }) => {
    try {
      // Clean the URL by removing any trailing slashes and ensuring it's a valid URL
      const cleanUrl = imageUrl.replace(/\/+$/, "");
      console.log("Original URL:", imageUrl);
      console.log("Cleaned URL:", cleanUrl);

      // Extract the file path from the URL
      const urlParts = cleanUrl.split("/public/");
      if (urlParts.length !== 2) {
        throw new Error("Invalid Supabase storage URL format");
      }
      const filePath = urlParts[1];

      // Initialize Supabase client
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
      );

      // Download the file
      const { data: fileData, error: downloadError } = await supabase.storage
        .from("receipts")
        .download(filePath);

      if (downloadError) {
        console.error("Error downloading file:", downloadError);
        throw downloadError;
      }

      // Convert the file to a base64 data URL
      const base64Data = await fileData.arrayBuffer();
      const base64String = Buffer.from(base64Data).toString("base64");
      const dataUrl = `data:image/jpeg;base64,${base64String}`;

      // Create a more concise prompt that still provides the necessary information
      const prompt = `Analyze this receipt image and return JSON:
      {
        "vendor": "Store name",
        "totalAmount": "Amount in GBP",
        "purchaseDate": "YYYY-MM-DD",
        "rawText": "Receipt text"
      }
      
      Image: ${dataUrl}
      
      Use null for unknown fields.`;

      return await step?.ai.infer("parse-receipt", {
        model: anthropic({
          model: "claude-3-5-sonnet-20241022",
          defaultParameters: {
            max_tokens: 500, // Reduced from 1000 to help with rate limits
          },
        }),
        body: {
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
        },
      });
    } catch (err) {
      console.error("Error in parseReceiptTool:", err);
      throw new Error(err as any);
    }
  },
});

export const receiptScanAgent = createAgent({
  name: "Receipt scanning agent",
  description: "Responsible for scanning the receipt and extracting the data",
  system: `Extract from receipt images:
    - Vendor name
    - Total amount (GBP)
    - Purchase date (ISO 8601)
    - Raw text
    Return "Cannot identify automatically" for unknown fields.`,
  model: anthropic({
    model: "claude-3-5-sonnet-20241022",
    defaultParameters: {
      max_tokens: 500, // Reduced from 1000 to help with rate limits
    },
  }),
  tools: [parseReceiptTool],
});
