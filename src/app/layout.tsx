import type { Metadata } from "next";
import { Bebas_Neue, Montserrat } from "next/font/google";
import { AuthProvider } from "@/lib/auth/auth-context";
import "./globals.css";

const bebasNeue = Bebas_Neue({
  weight: '400',
  variable: "--font-bebas",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ['400', '500', '600', '700', '800'],
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
        className={`${bebasNeue.variable} ${montserrat.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
