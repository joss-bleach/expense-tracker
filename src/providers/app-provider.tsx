import { TRPCProvider } from "@/trpc/client";

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  return <TRPCProvider>{children}</TRPCProvider>;
};
