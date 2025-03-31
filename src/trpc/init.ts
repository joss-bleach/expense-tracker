import { initTRPC, TRPCError } from "@trpc/server";
import { cache } from "react";
import superjson from "superjson";

import { getSession } from "@/modules/auth/actions/get-session";
import { getUserById } from "@/db/queries/user";

export const createTRPCContext = cache(async () => {
  const session = await getSession();
  return { session: session ?? null };
});

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(
  async function isAuthenticated(opts) {
    const { ctx } = opts;

    if (!ctx.session?.user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You must be logged in to access this resource",
      });
    }

    const [user] = await getUserById({ userId: ctx.session.user.id });

    if (!user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You must be logged in to access this resource",
      });
    }

    return opts.next({
      ctx: {
        ...ctx,
        user,
      },
    });
  },
);
