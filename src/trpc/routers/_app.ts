import { createTRPCRouter } from "../init";
import { projectProcedures } from "@/modules/project-dashboard/server/procedures";
import { receiptProcedures } from "@/modules/receipt-dashboard/server/procedures";

export const appRouter = createTRPCRouter({
  project: createTRPCRouter(projectProcedures),
  receipt: createTRPCRouter(receiptProcedures),
});

export type AppRouter = typeof appRouter;
