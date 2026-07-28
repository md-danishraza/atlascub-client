"use client";

import React from "react";
import { ThemeProvider } from "next-themes";
import StoreProvider from "./store-provider";
import { StoreSyncProvider } from "./store-sync-provider";

/**
 * 🛡️ GLOBAL CLIENT PROVIDERS
 * Consolidates all "use client" context providers into a single clean wrapper.
 * This prevents polluting the server-side Root Layout with client boundaries.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
    
      <StoreSyncProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </StoreSyncProvider>
      
    </StoreProvider>
  );
}