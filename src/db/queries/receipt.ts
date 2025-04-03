import { and, eq } from "drizzle-orm";
import { db } from "..";
import { receipt } from "../schema";

type CreateReceiptInput = {
  imageUrl: string;
  projectId: string;
  userId: string;
  filePath: string;
  status: "created" | "analysing" | "complete" | "failed";
  rawJson?: string;
};

type UpdateReceiptInput = {
  id: string;
  vendor?: string;
  totalAmount?: number;
  purchaseDate?: Date;
  status?: "created" | "analysing" | "complete" | "failed";
  rawJson?: string;
};

export async function createReceipt({
  imageUrl,
  projectId,
  userId,
  filePath,
  status,
  rawJson,
}: CreateReceiptInput) {
  return await db
    .insert(receipt)
    .values({
      imageUrl,
      projectId,
      userId,
      filePath,
      status,
      rawJson,
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
  rawJson,
}: UpdateReceiptInput) {
  return await db
    .update(receipt)
    .set({
      vendor,
      totalAmount,
      purchaseDate,
      status,
      rawJson,
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
