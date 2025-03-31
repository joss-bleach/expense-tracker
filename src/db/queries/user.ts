import { eq } from "drizzle-orm";
import db from "..";
import { user } from "../schema";

export async function getUserById({ userId }: { userId: string }) {
  return await db.select().from(user).where(eq(user.id, userId));
}
