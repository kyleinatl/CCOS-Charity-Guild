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
  title: "Charity Guild",
  description: "Country Club of the South Charity Guild - Supporting Atlanta area non-profits through volunteer-based fundraising and community grants.",
  icons: {
    icon: '/ccos-logo.png',
    shortcut: '/ccos-logo.png',
    apple: '/ccos-logo.png',
  },
  openGraph: {
    title: "Charity Guild",
    description: "Country Club of the South Charity Guild - Supporting Atlanta area non-profits through volunteer-based fundraising and community grants.",
    images: ['/ccos-logo.png'],
    siteName: "CCOS Charity Guild",
  },
  twitter: {
    card: 'summary_large_image',
    title: "Charity Guild",
    description: "Country Club of the South Charity Guild - Supporting Atlanta area non-profits through volunteer-based fundraising and community grants.",
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
