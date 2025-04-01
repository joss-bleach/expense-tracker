import { protectedProcedure } from "@/trpc/init";
import {
  createReceipt,
  getReceiptsByProjectIdAndUserId,
} from "@/db/queries/receipt";
import { z } from "zod";

export const receiptProcedures = {
  create: protectedProcedure
    .input(
      z.object({
        imageUrl: z.string(),
        projectId: z.string().uuid(),
        filePath: z.string(),
        status: z
          .enum(["pending", "processing", "processed", "failed"])
          .default("pending"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [newReceipt] = await createReceipt({
        ...input,
        userId: ctx.user.id,
      });

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
