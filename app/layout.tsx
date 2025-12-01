import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/lib/providers/StoreProvider";
import { QueryProvider } from "@/lib/providers/QueryProvider";
import { NotificationContainer } from "@/components/common/Notification";
import { RetryIndicator } from "@/components/common/RetryIndicator";
import { ErrorSimulatorToolbar } from "@/components/common/ErrorSimulatorToolbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FakeStore - Tienda de Productos",
  description:
    "Aplicación de demostración con FakeStore API - Manejo robusto de errores y resiliencia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0f0f14] min-h-screen`}
      >
        <StoreProvider>
          <QueryProvider>
            <ErrorSimulatorToolbar />
            {children}
            <NotificationContainer />
            <RetryIndicator />
          </QueryProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
