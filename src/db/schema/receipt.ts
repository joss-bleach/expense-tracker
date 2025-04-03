import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { user } from "./auth";
import { project } from "./project";

export const receipt = pgTable("receipt", {
  id: uuid("id").primaryKey().defaultRandom(),
  imageUrl: text("image_url").notNull(),
  filePath: text("file_path").notNull(),
  status: text("status", {
    enum: ["created", "analysing", "complete", "failed"],
  })
    .notNull()
    .default("created"),
  vendor: text("vendor"),
  totalAmount: integer("total_amount"),
  purchaseDate: timestamp("purchase_date"),
  rawJson: text("raw_json"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  projectId: uuid("project_id")
    .notNull()
    .references(() => project.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});
