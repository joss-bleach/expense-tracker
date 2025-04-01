"use client";
import { PlusIcon } from "lucide-react";

import { useUploadReceipt } from "../../hooks/use-upload-receipt";

import { Button } from "@/components/ui/button";
import { UploadReceiptModal } from "./upload-receipt-modal";

export const UploadReceiptButton = ({ projectId }: { projectId: string }) => {
  const { open } = useUploadReceipt();
  return (
    <>
      <Button
        onClick={open}
        className="flex w-full items-center gap-2 sm:w-auto"
      >
        <PlusIcon className="h-4 w-4" />
        <span>Upload Receipt</span>
      </Button>
      <UploadReceiptModal projectId={projectId} />
    </>
  );
};
