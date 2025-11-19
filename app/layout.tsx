import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SupabaseAuthProvider } from "@/contexts/SupabaseAuthContext";
import { WorkflowProvider } from "@/contexts/WorkflowContext";
import {
  ErrorBoundary,
  ToastProvider,
  SwrProvider,
  ServiceWorkerRegistration,
  WebVitalsReporter,
} from "@/components/shared";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AURA - Agentic Unified Reasoning Assistant",
  description: "AI-powered workflow automation for Google Workspace",
  manifest: "/manifest.json",
  themeColor: "#000000",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "AURA",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ServiceWorkerRegistration />
        <WebVitalsReporter />
        <ErrorBoundary>
          <SwrProvider>
            <SupabaseAuthProvider>
              <ToastProvider>
                <WorkflowProvider>{children}</WorkflowProvider>
              </ToastProvider>
            </SupabaseAuthProvider>
          </SwrProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
