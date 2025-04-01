"use client";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { format } from "date-fns";

import { trpc } from "@/trpc/client";

import { calculateTotalBudget, formatCurrency } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { UploadReceiptButton } from "../components/upload-receipt-button";

export const HeadingSection = ({ projectId }: { projectId: string }) => {
  return (
    <Suspense fallback={<HeadingSectionLoading />}>
      <ErrorBoundary fallback={<p>Error</p>}>
        <HeadingSectionSuspense projectId={projectId} />
      </ErrorBoundary>
    </Suspense>
  );
};

const HeadingSectionSuspense = ({ projectId }: { projectId: string }) => {
  const [data] = trpc.project.getProjectById.useSuspenseQuery({
    id: projectId,
  });
  console.log(data);

  if (!data) {
    return null;
  }

  return (
    <div className="flex flex-col justify-between gap-4 py-4 sm:flex-row sm:items-center">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{data.name}</h1>
        <p className="text-muted-foreground flex items-center gap-2">
          <span>
            {format(data.startDate, "MMM d, yyyy")} -{" "}
            {format(data.endDate, "MMM d, yyyy")}
          </span>
          <span>|</span>
          <span>
            {formatCurrency(
              calculateTotalBudget(
                data.dailyExpense,
                data.startDate,
                data.endDate,
                data.restDays,
              ),
            )}
          </span>
        </p>
      </div>
      <UploadReceiptButton projectId={projectId} />
    </div>
  );
};

const HeadingSectionLoading = () => {
  return (
    <div className="flex flex-col justify-between gap-4 py-4 sm:flex-row sm:items-center">
      <div>
        <div className="h-8 w-48 animate-pulse rounded-md bg-gray-200" />
        <div className="mt-2 h-4 w-32 animate-pulse rounded-md bg-gray-200" />
      </div>
      <div className="h-10 w-full animate-pulse rounded-md bg-gray-200 sm:w-36" />
    </div>
  );
};
