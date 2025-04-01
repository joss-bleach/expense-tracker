"use client";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { trpc } from "@/trpc/client";
import { EmptyState } from "../components/empty-state";
import { ProjectCard, ProjectCardSkeleton } from "../components/project-card";

export const ProjectsSection = () => {
  return (
    <Suspense fallback={<ProjectsSectionLoading />}>
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

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {data.map((project) => (
        <ProjectCard
          key={project.id}
          id={project.id}
          name={project.name}
          startDate={project.startDate}
          endDate={project.endDate}
          restDays={project.restDays}
          dailyExpense={project.dailyExpense}
        />
      ))}
    </div>
  );
};

const ProjectsSectionLoading = () => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      <ProjectCardSkeleton />
      <ProjectCardSkeleton />
      <ProjectCardSkeleton />
    </div>
  );
};
