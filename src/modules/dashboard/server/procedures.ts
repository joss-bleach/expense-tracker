import { protectedProcedure } from "@/trpc/init";
import { createProjectSchema } from "../schema/create-project";
import { createProject, getProjectsByUserId } from "@/db/queries/project";

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
};
