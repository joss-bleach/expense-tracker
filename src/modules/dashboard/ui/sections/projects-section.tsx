"use client";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { trpc } from "@/trpc/client";
import { EmptyState } from "../components/empty-state";

export const ProjectsSection = () => {
  return (
    <Suspense fallback={<p>Loading</p>}>
      <ErrorBoundary fallback={<p>Error</p>}>
        <ProjectsSectionSuspense />
      </ErrorBoundary>
    </Suspense>
  );
};

const ProjectsSectionSuspense = () => {
  const [data] = trpc.project.getProjectsByUserId.useSuspenseQuery();
  console.log(data);

  if (data.length === 0) {
    return <EmptyState />;
  }

  return <div>Projects</div>;
};
