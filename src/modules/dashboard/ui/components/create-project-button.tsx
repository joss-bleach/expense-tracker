"use client";
import { PlusIcon } from "lucide-react";

import { useCreateProject } from "../../hooks/use-create-project";

import { Button } from "@/components/ui/button";
import { CreateProjectModal } from "./create-project-modal";

export const CreateProjectButton = () => {
  const { open } = useCreateProject();
  return (
    <>
      <Button
        onClick={open}
        className="flex w-full items-center gap-2 hover:cursor-pointer sm:w-auto"
      >
        <PlusIcon className="h-4 w-4" />
        <span>Create Project</span>
      </Button>
      <CreateProjectModal />
    </>
  );
};
