import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThemeProvider from "../components/ThemeProvider";
import ThemeScript from "@/components/ThemeScript";
import CustomSessionProvider from "@/components/SessionProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NucleAV",
  description: "Plataforma para gestión audiovisual",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      {/* <head>
        <style>{`body { background-color: #0f1214; color: #f6f7f8; }`}</style>
      </head> */}
      <head>
        <ThemeScript />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <CustomSessionProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </CustomSessionProvider>
      </body>
    </html>
  );
}
