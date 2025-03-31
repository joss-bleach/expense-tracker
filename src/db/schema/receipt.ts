import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { user } from "./auth";
import { project } from "./project";

export const receipt = pgTable("receipt", {
  id: uuid("id").primaryKey().defaultRandom(),
  imageUrl: text("image_url").notNull(),
  status: text("status", {
    enum: ["pending", "processing", "processed", "failed"],
  })
    .notNull()
    .default("pending"),
  vendor: text("vendor"),
  totalAmount: integer("total_amount"),
  purchaseDate: timestamp("purchase_date"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  projectId: uuid("project_id")
    .notNull()
    .references(() => project.id, { onDelete: "cascade" }),
  rawText: text("raw_text"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});
