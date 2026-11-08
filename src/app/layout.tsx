import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import Providers from "@/components/Providers";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";
import { SITE_URL } from "@/lib/site";

const description =
  "تبدیل تاریخ شمسی به میلادی و میلادی به شمسی، همراه با تقویم هجری قمری، بدیع، چینی، ساکا و عبری. سریع، دقیق و قابل استفاده بدون اینترنت.";

export const metadata: Metadata = {
  ...(SITE_URL ? { metadataBase: new URL(SITE_URL) } : {}),
  title: {
    default: "تبدیل تاریخ | شمسی، میلادی، قمری، بدیع",
    template: "%s | تبدیل تاریخ",
  },
  description,
  applicationName: "تبدیل تاریخ",
  keywords: [
    "تبدیل تاریخ",
    "تبدیل تاریخ شمسی به میلادی",
    "تبدیل تاریخ میلادی به شمسی",
    "تقویم شمسی",
    "تقویم میلادی",
    "تقویم هجری قمری",
    "تقویم بدیع",
    "تقویم چینی",
    "تقویم ساکا",
    "تقویم عبری",
    "محاسبه فاصله دو تاریخ",
  ],
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/logo192.png",
  },
  openGraph: {
    type: "website",
    locale: "fa_IR",
    siteName: "تبدیل تاریخ",
    title: "تبدیل تاریخ | شمسی، میلادی، قمری، بدیع",
    description,
  },
  twitter: {
    card: "summary",
    title: "تبدیل تاریخ | شمسی، میلادی، قمری، بدیع",
    description,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#666cff",
};

const themeScript = `try{document.documentElement.dataset.theme=localStorage.getItem("isDarkMode")==="true"?"dark":"light"}catch(e){document.documentElement.dataset.theme="light"}`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="preload" href="/IranSans.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <Providers>{children}</Providers>
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}
