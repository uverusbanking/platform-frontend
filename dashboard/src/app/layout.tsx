"use client";

import { useEffect } from "react";
import { useCheckAuth } from "@/hooks/useCheckAuth";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import LoadingDataComponent from "@/components/LoadingData2";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "@/utils/queryClient";
import { Toaster } from "@/components/ui/sonner";
import { Inter, JetBrains_Mono } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
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
    reAuthUser();
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
            <TooltipProvider>
              {isLoading ? (
                <LoadingDataComponent containerHeight="100dvh" />
              ) : (
                children
              )}
              {/*TODO:  <InactivityTracker /> */}
              <Toaster position="top-center" richColors closeButton />
            </TooltipProvider>
          </ThemeProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </body>
    </html>
  );
}
