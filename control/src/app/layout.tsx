"use client";

// import type { Metadata } from "next";
import "@/styles/globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { useEffect } from "react";
import { useCheckAuth } from "../hooks/useCheckAuth";
import LoadingDataComponent from "@/components/LoadingData2";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "@/lib/queryClient";
import localFont from "next/font/local";
import { Toaster } from "@/components/ui/sonner";
import { InactivityProvider } from "@/contexts/InactivityContext";

const inter = localFont({
  src: "../../../shared/fonts/inter.woff2",
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = localFont({
  src: "../../../shared/fonts/jetbrains-mono.woff2",
  variable: "--font-mono",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { reAuthUser, isLoading } = useCheckAuth();

  useEffect(() => {
    const initPersistence = async () => {
      try {
        const { persistQueryClient } =
          await import("@tanstack/react-query-persist-client");
        const { createSyncStoragePersister } =
          await import("@tanstack/query-sync-storage-persister");

        const localStoragePersister = createSyncStoragePersister({
          storage: window.localStorage,
        });

        persistQueryClient({
          queryClient,
          persister: localStoragePersister,
          maxAge: 1000 * 60 * 60 * 24, // 24 hours
        });
      } catch (error) {
        console.error("Failed to initialize React Query persistence:", error);
      }
    };

    initPersistence();
    void reAuthUser();
  }, [reAuthUser]);

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <InactivityProvider>
              <TooltipProvider>
                {isLoading ? (
                  <LoadingDataComponent containerHeight="100dvh" />
                ) : (
                  children
                )}
                <Toaster
                  position="top-center"
                  richColors
                  closeButton
                  duration={10000}
                />
              </TooltipProvider>
            </InactivityProvider>
          </ThemeProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </body>
    </html>
  );
}
