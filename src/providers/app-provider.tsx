import { TRPCProvider } from "@/trpc/client";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "@/components/ui/sonner";

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <TRPCProvider>
      <NuqsAdapter>
        <Toaster />
        {children}
      </NuqsAdapter>
    </TRPCProvider>
  );
};
