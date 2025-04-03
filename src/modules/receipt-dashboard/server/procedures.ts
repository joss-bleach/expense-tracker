import { protectedProcedure } from "@/trpc/init";
import {
  createReceipt,
  getReceiptsByProjectIdAndUserId,
} from "@/db/queries/receipt";
import { scanAndUpdateReceiptsTask } from "@/trigger/scan-and-update-receipts";
import { z } from "zod";

export const receiptProcedures = {
  create: protectedProcedure
    .input(
      z.object({
        imageUrl: z.string(),
        projectId: z.string().uuid(),
        filePath: z.string(),
        status: z
          .enum(["created", "analysing", "complete", "failed"])
          .default("created"),
        rawJson: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      console.log("Creating receipt with input:", input);

      const [newReceipt] = await createReceipt({
        ...input,
        userId: ctx.user.id,
      });

      console.log("Created receipt:", newReceipt);

      try {
        await scanAndUpdateReceiptsTask.trigger({
          receiptId: newReceipt.id,
          rawJson: input.rawJson || "",
        });
      } catch (error) {
        console.error("Failed to trigger receipt scanning:", error);
      }

      return newReceipt;
    }),

  getReceiptsByProjectIdAndUserId: protectedProcedure
    .input(z.object({ projectId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      return await getReceiptsByProjectIdAndUserId({
        projectId: input.projectId,
        userId: ctx.user.id,
      });
    }),
};
