import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";

export const metadata: Metadata = {
  title: "MandiReturn - Agri Transport Exchange",
  description: "0% Commission return load transport network for Mandi Vyaparis, Kisan & Drivers across India.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hi">
      <body className="bg-[#0b0f19] text-slate-100 min-h-screen flex justify-center items-start antialiased selection:bg-emerald-500 selection:text-white">
        {/* Standard Mobile Frame Container */}
        <div className="w-full max-w-md min-h-screen bg-[#0F172A] flex flex-col relative shadow-2xl border-x border-slate-800">
          <AuthProvider>{children}</AuthProvider>
        </div>
      </body>
    </html>
  );
}
