import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/lib/auth/auth-context";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CCOS Charity Guild - Nonprofit Management System",
  description: "Comprehensive nonprofit management system for CCOS Charity Guild featuring member management, donation tracking, event management, and AI-powered insights.",
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    title: "CCOS Charity Guild - Nonprofit Management System",
    description: "Comprehensive nonprofit management system for CCOS Charity Guild featuring member management, donation tracking, event management, and AI-powered insights.",
    images: ['/logo.png'],
    siteName: "CCOS Charity Guild",
  },
  twitter: {
    card: 'summary_large_image',
    title: "CCOS Charity Guild - Nonprofit Management System",
    description: "Comprehensive nonprofit management system for CCOS Charity Guild featuring member management, donation tracking, event management, and AI-powered insights.",
    images: ['/logo.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
