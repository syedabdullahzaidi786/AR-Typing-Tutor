import type { Metadata, Viewport } from "next";
import "./globals.css";
import { auth } from "@/lib/auth";
import Navbar from "@/components/layout/Navbar";
import PWARegistration from "@/components/layout/PWARegistration";
import { SessionProvider } from "next-auth/react";

export const metadata: Metadata = {
  title: "AR Typing Tutor - Multi-Language Typing Practice & Certification",
  description:
    "Practice typing in English, Urdu, Arabic, and Sindhi. Get certified with our professional typing tests.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "AR Typing",
  },
  icons: {
    apple: "/icon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#7c3aed",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="bg-gray-950 text-gray-100 antialiased">
        <SessionProvider>
          <PWARegistration />
          <Navbar
            user={
              session?.user
                ? {
                    name: session.user.name || "",
                    email: session.user.email || "",
                    role: session.user.role || "USER",
                  }
                : null
            }
          />
          <main className="pt-16 min-h-screen">{children}</main>
        </SessionProvider>
      </body>
    </html>
  );
}
