import Link from "next/link";
import { format } from "date-fns";

import {
  CalendarIcon,
  EllipsisIcon,
  ReceiptIcon,
  PencilIcon,
  TrashIcon,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/trpc/client";

import {
  formatCurrency,
  calculateWorkingDays,
  calculateTotalBudget,
} from "@/lib/utils";

interface ProjectCardProps {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  restDays: number;
  dailyExpense: number;
}

export const ProjectCard = ({
  id,
  name,
  startDate,
  endDate,
  restDays,
  dailyExpense,
}: ProjectCardProps) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl">
          <span className="flex flex-row items-center justify-between">
            {name}
            <DropdownMenu>
              {/* TODO: Edit/Delete functionality */}
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <EllipsisIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <PencilIcon className="mr-2 h-4 w-4" />
                  Edit Project
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">
                  <TrashIcon className="mr-2 h-4 w-4" />
                  Delete Project
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </span>
        </CardTitle>
        <CardDescription className="line-clamp-2">
          {calculateWorkingDays(startDate, endDate, restDays)} working days
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-2 text-sm">
          <div className="text-muted-foreground flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            <span>
              {format(startDate, "MMM d, yyyy")} -{" "}
              {format(endDate, "MMM d, yyyy")}
            </span>
          </div>
          <div className="text-muted-foreground flex items-center gap-2">
            <ReceiptIcon className="h-4 w-4" />
            <span>
              Total budget:{" "}
              {formatCurrency(
                calculateTotalBudget(
                  dailyExpense,
                  startDate,
                  endDate,
                  restDays,
                ),
              )}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button asChild className="w-full">
          <Link prefetch={true} href={`/ws/${id}`}>
            View Receipts
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export const ProjectCardSkeleton = () => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        {/* Title and menu button */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-[140px]" />
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
        {/* Description */}
        <Skeleton className="mt-2 h-4 w-[120px]" />
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-2">
          {/* Date range skeleton */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-[180px]" />
          </div>
          {/* Budget skeleton */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-[160px]" />
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Skeleton className="h-9 w-full" />
      </CardFooter>
    </Card>
  );
};
