"use client";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { trpc } from "@/trpc/client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export const BreadcrumbsSection = ({ projectId }: { projectId: string }) => {
  return (
    <Suspense fallback={<BreadcrumbsSectionLoading />}>
      <ErrorBoundary fallback={<p>Error</p>}>
        <BreadcrumbsSectionSuspense projectId={projectId} />
      </ErrorBoundary>
    </Suspense>
  );
};

const BreadcrumbsSectionSuspense = ({ projectId }: { projectId: string }) => {
  const [data] = trpc.project.getProjectById.useSuspenseQuery({
    id: projectId,
  });
  console.log(data);

  if (!data) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{data.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

const BreadcrumbsSectionLoading = () => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      <div className="flex items-center gap-2">
        <div className="h-4 w-12 animate-pulse rounded-md bg-gray-200" />
        <div className="h-4 w-4 animate-pulse rounded-md bg-gray-200" />
        <div className="h-4 w-24 animate-pulse rounded-md bg-gray-200" />
      </div>
    </div>
  );
};
