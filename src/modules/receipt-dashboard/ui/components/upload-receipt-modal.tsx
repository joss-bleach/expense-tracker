"use client";
import { useEffect } from "react";
import { authClient } from "@/lib/auth-client";

import { useSupabaseUpload } from "@/hooks/use-supabase-upload";
import { useUploadReceipt } from "../../hooks/use-upload-receipt";

import { trpc } from "@/trpc/client";

import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "@/components/dropzone";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const UploadReceiptModal = ({ projectId }: { projectId: string }) => {
  const props = useSupabaseUpload({
    bucketName: "receipts",
    path: `${projectId}`,
    allowedMimeTypes: ["image/*"],
    maxFiles: 1,
    maxFileSize: 1000 * 1000 * 10, // 10MB,
  });

  const utils = trpc.useUtils();

  const { isOpen, close } = useUploadReceipt();

  useEffect(() => {
    if (props.isSuccess) {
      console.log("Success!");
    }
  }, [props.isSuccess]);

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload New Receipt</DialogTitle>
        </DialogHeader>
        <div>
          <Dropzone projectId={projectId} {...props}>
            <DropzoneEmptyState />
            <DropzoneContent />
          </Dropzone>
        </div>
      </DialogContent>
    </Dialog>
  );
};
