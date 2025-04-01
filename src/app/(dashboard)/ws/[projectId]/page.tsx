export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";

import { getSession } from "@/modules/auth/actions/get-session";

import { HydrateClient, trpc } from "@/trpc/server";

import { DashboardView } from "@/modules/receipt-dashboard/ui/views/dashboard-view";

const Page = async ({ params }: { params: Promise<{ projectId: string }> }) => {
  const { projectId } = await params;
  void trpc.project.getProjectById.prefetch({ id: projectId });

  const session = await getSession();
  if (!session) {
    redirect("/auth");
  }

  return (
    <HydrateClient>
      <DashboardView projectId={projectId} />
    </HydrateClient>
  );
};

export default Page;
