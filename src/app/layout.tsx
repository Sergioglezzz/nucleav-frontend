import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThemeProvider from "../components/ThemeProvider";
import ThemeScript from "@/components/ThemeScript";
import CustomSessionProvider from "@/components/SessionProvider";
import { NotificationProvider } from "@/components/context/NotificationContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "NucleAV | Plataforma de Gestión Audiovisual",
    template: "%s | NucleAV",
  },
  description: "Gestiona eventos, materiales y personal en el sector audiovisual con NucleAV. Optimiza tu logística con una plataforma moderna y eficiente.",
  metadataBase: new URL("https://www.nucleav.com"),
  authors: [{ name: "Sergioglezzz", url: "https://www.nucleav.com" }],
  keywords: [
    "NucleAV",
    "gestión audiovisual",
    "eventos audiovisuales",
    "material audiovisual",
    "bolos",
    "producción audiovisual",
    "logística audiovisual",
    "tecnología audiovisual",
    "plataforma de gestión",
  ],
  alternates: {
    canonical: "https://www.nucleav.com",
  },
  openGraph: {
    title: "NucleAV | Plataforma de Gestión Audiovisual",
    description: "La plataforma definitiva para gestionar recursos humanos y materiales en la industria audiovisual.",
    url: "https://www.nucleav.com",
    siteName: "NucleAV",
    type: "website",
    locale: "es_ES",
    images: [
      {
        url: "https://www.nucleav.com/og-image.jpg", // asegúrate de tener esta imagen
        width: 1200,
        height: 630,
        alt: "NucleAV - Gestión Audiovisual",
      },
    ],
  },
};
// alternates: { canonical: "/" },

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <CustomSessionProvider>
          <ThemeProvider>
            <NotificationProvider>
              {children}
            </NotificationProvider>
          </ThemeProvider>
        </CustomSessionProvider>
      </body>
    </html>
  );
}
