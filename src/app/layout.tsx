import type { Metadata } from "next";
import { Bebas_Neue, Montserrat } from "next/font/google";
import { AuthProvider } from "@/lib/auth/auth-context";
import Script from "next/script";
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
        
        {/* Tawk.to Live Chat */}
        <Script
          id="tawk-to-script"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
              Tawk_API.onLoad = function(){
                Tawk_API.hideWidget();
                Tawk_API.showWidget();
                Tawk_API.minimize();
              };
              (function(){
              var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
              s1.async=true;
              s1.src='https://embed.tawk.to/695d78b01b9b1e197b6103a6/1jeahusip';
              s1.charset='UTF-8';
              s1.setAttribute('crossorigin','*');
              s0.parentNode.insertBefore(s1,s0);
              })();
            `,
          }}
        />
      </body>
    </html>
  );
}
