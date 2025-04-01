export const DashboardLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <main className="container mx-auto px-4 py-10 md:px-6">{children}</main>
  );
};
