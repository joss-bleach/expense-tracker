import { protectedProcedure } from "@/trpc/init";
import { createProjectSchema } from "../schema/create-project";
import {
  createProject,
  getProjectsByUserId,
  deleteProject,
  getProjectById,
} from "@/db/queries/project";
import { z } from "zod";

export const projectProcedures = {
  create: protectedProcedure
    .input(createProjectSchema)
    .mutation(async ({ ctx, input }) => {
      const [newProject] = await createProject({
        ...input,
        userId: ctx.user.id,
      });

      return newProject;
    }),

  getProjectsByUserId: protectedProcedure.query(async ({ ctx }) => {
    return await getProjectsByUserId({ userId: ctx.user.id });
  }),

  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input }) => {
      const [deletedProject] = await deleteProject({ id: input.id });
      return deletedProject;
    }),

  getProjectById: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input }) => {
      const [project] = await getProjectById({ id: input.id });
      return project;
    }),
};
