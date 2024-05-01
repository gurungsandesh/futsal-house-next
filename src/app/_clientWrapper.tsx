"use client"

import { AuthProvider } from "@/components/AuthProvider";
import { ReactQueryClientProvider } from "@/components/ReactQueryClientProvider";
import { Toaster } from "@/components/ui/toaster";

export default function ClientWrapper({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <ReactQueryClientProvider>
      <Toaster />
      <AuthProvider>{children}</AuthProvider>
    </ReactQueryClientProvider>
  );
}
