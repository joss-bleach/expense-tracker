export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";

import { getSession } from "@/modules/auth/actions/get-session";

import { HydrateClient, trpc } from "@/trpc/server";

import { DashboardView } from "@/modules/dashboard/ui/views/dashboard-view";

const Page = async () => {
  void trpc.project.getProjectsByUserId.prefetch();

  const session = await getSession();
  if (!session) {
    redirect("/auth");
  }

  return (
    <HydrateClient>
      <DashboardView />
    </HydrateClient>
  );
};

export default Page;
