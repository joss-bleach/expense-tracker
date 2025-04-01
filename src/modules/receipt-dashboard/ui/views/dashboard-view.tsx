import { BreadcrumbsSection } from "../sections/breadcrumbs-section";
import { HeadingSection } from "../sections/heading-section";
import { ReceiptsSection } from "../sections/receipts-section";

export const DashboardView = ({ projectId }: { projectId: string }) => {
  return (
    <div className="flex flex-col gap-2">
      <BreadcrumbsSection projectId={projectId} />
      <HeadingSection projectId={projectId} />
      <ReceiptsSection projectId={projectId} />
    </div>
  );
};
