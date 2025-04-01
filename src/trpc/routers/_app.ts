import { createTRPCRouter } from "../init";
import { projectProcedures } from "@/modules/project-dashboard/server/procedures";

export const appRouter = createTRPCRouter({
  project: createTRPCRouter(projectProcedures),
});

export type AppRouter = typeof appRouter;
