"use client";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { FileIcon, Loader2Icon } from "lucide-react";

import { trpc } from "@/trpc/client";
import { cn, formatCurrency } from "@/lib/utils";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export const ReceiptsSection = ({ projectId }: { projectId: string }) => {
  return (
    <Suspense fallback={<ReceiptsSectionLoading />}>
      <ErrorBoundary fallback={<p>Error</p>}>
        <ReceiptsSectionSuspense projectId={projectId} />
      </ErrorBoundary>
    </Suspense>
  );
};

const ReceiptsSectionSuspense = ({ projectId }: { projectId: string }) => {
  const [data] = trpc.receipt.getReceiptsByProjectIdAndUserId.useSuspenseQuery({
    projectId,
  });

  if (!data) {
    return null;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Receipt</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((receipt) => (
            <TableRow key={receipt.id}>
              <TableCell>
                <a
                  href={receipt.filePath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 font-semibold text-blue-600 hover:cursor-pointer hover:underline"
                >
                  <FileIcon className="h-4 w-4" />
                  {receipt.imageUrl}
                </a>
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    receipt.status === "pending" ? "secondary" : "default"
                  }
                  className={cn(
                    "flex items-center gap-1",
                    receipt.status === "pending" ? "animate-pulse" : "",
                  )}
                >
                  {receipt.status === "pending" && (
                    <Loader2Icon className="size-4 animate-spin" />
                  )}
                  {receipt.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                {receipt.totalAmount
                  ? formatCurrency(receipt.totalAmount)
                  : "-"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

const ReceiptsSectionLoading = () => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Receipt</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(3)].map((_, i) => (
            <TableRow key={i}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-pulse rounded-md bg-gray-200" />
                  <div className="h-4 w-48 animate-pulse rounded-md bg-gray-200" />
                </div>
              </TableCell>
              <TableCell>
                <div className="h-5 w-20 animate-pulse rounded-full bg-gray-200" />
              </TableCell>
              <TableCell className="text-right">
                <div className="ml-auto h-4 w-20 animate-pulse rounded-md bg-gray-200" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
