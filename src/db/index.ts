import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@/db/schema";
import { env } from "@/config/env";

export const connection = postgres(env.DATABASE_URL);

export const db = drizzle(connection, {
  schema,
  logger: env.NODE_ENV === "development",
});

export type db = typeof db;

export default db;
