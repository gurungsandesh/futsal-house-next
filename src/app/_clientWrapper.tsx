"use client"

import { AuthProvider } from "@/components/AuthProvider";
import { ReactQueryClientProvider } from "@/components/ReactQueryClientProvider";
import { ToastContainer } from "react-toastify";

export default function ClientWrapper({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <ReactQueryClientProvider>
      <ToastContainer />
      <AuthProvider>{children}</AuthProvider>
    </ReactQueryClientProvider>
  );
}
