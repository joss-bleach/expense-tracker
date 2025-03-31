import { SearchIcon } from "lucide-react";

import { ProjectsSection } from "../sections/projects-section";
import { Input } from "@/components/ui/input";
import { CreateProjectButton } from "../components/create-project-button";

export const DashboardView = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
      </div>
      <div className="flex flex-col items-center gap-4 sm:flex-row">
        <div className="relative w-full flex-1">
          <SearchIcon className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input placeholder="Search projects..." className="pl-10" />
        </div>
        <CreateProjectButton />
      </div>
      <ProjectsSection />
    </div>
  );
};
