import { eq } from "drizzle-orm";
import { db } from "..";
import { project } from "../schema";

type CreateProjectInput = {
  name: string;
  startDate: Date;
  endDate: Date;
  restDays?: number;
  dailyExpense: number;
  userId: string;
};
export async function createProject({
  name,
  startDate,
  endDate,
  restDays,
  dailyExpense,
  userId,
}: CreateProjectInput) {
  return await db
    .insert(project)
    .values({
      name,
      startDate,
      endDate,
      restDays: restDays ?? 0,
      dailyExpense,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();
}

export async function getProjectsByUserId({ userId }: { userId: string }) {
  return await db.select().from(project).where(eq(project.userId, userId));
}

export async function deleteProject({ id }: { id: string }) {
  return await db.delete(project).where(eq(project.id, id)).returning();
}

export async function getProjectById({ id }: { id: string }) {
  return await db.select().from(project).where(eq(project.id, id));
}
