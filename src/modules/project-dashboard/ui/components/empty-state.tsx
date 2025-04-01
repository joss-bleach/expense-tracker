import { CreateProjectButton } from "./create-project-button";

export const EmptyState = () => {
  return (
    <div className="flex flex-col items-center py-6">
      <h1 className="text-xl font-semibold tracking-tight">No projects</h1>
      <p className="text-muted-foreground pb-4">
        Create a project to start tracking your expenses
      </p>
      <CreateProjectButton />
    </div>
  );
};
