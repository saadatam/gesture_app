"use client";

import { ConnectionProvider } from "@/context/ConnectionContext";
import { ConnectionModeToggle } from "@/components/ConnectionModeToggle";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ConnectionProvider>
      <div className="fixed top-4 right-4 z-50 w-full max-w-md px-4 sm:px-0">
        <ConnectionModeToggle />
      </div>
      {children}
    </ConnectionProvider>
  );
}
