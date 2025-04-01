import { and, eq } from "drizzle-orm";
import { db } from "..";
import { receipt } from "../schema";

type CreateReceiptInput = {
  imageUrl: string;
  projectId: string;
  userId: string;
  filePath: string;
  status: "pending" | "processing" | "processed" | "failed";
};

type UpdateReceiptInput = {
  id: string;
  vendor?: string;
  totalAmount?: number;
  purchaseDate?: Date;
  status?: "pending" | "processing" | "processed" | "failed";
  rawText?: string;
};

export async function createReceipt({
  imageUrl,
  projectId,
  userId,
  filePath,
  status,
}: CreateReceiptInput) {
  return await db
    .insert(receipt)
    .values({
      imageUrl,
      projectId,
      userId,
      filePath,
      status,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();
}

export async function updateReceipt({
  id,
  vendor,
  totalAmount,
  purchaseDate,
  status,
  rawText,
}: UpdateReceiptInput) {
  return await db
    .update(receipt)
    .set({
      vendor,
      totalAmount,
      purchaseDate,
      status,
      rawText,
      updatedAt: new Date(),
    })
    .where(eq(receipt.id, id))
    .returning();
}

export async function getReceiptsByProjectIdAndUserId({
  projectId,
  userId,
}: {
  projectId: string;
  userId: string;
}) {
  return await db
    .select()
    .from(receipt)
    .where(and(eq(receipt.projectId, projectId), eq(receipt.userId, userId)));
}
