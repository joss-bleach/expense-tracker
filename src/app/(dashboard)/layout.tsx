import { DashboardLayout } from "@/modules/project-dashboard/ui/layouts/dashboard-layout";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <DashboardLayout>{children}</DashboardLayout>;
};

export default Layout;
