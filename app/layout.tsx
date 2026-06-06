import type { Metadata } from "next";
import { Anton, Inter } from "next/font/google";
import "./globals.css";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://mtlpothole.com"),
  title: "On répare MTL — la carte des nids-de-poule de Montréal",
  description:
    "Signale un nid-de-poule, vote pour les pires, suis les réparations. Le mouvement de Marquize — la carte communautaire des trous de Montréal.",
  openGraph: {
    title: "On répare MTL — la carte des nids-de-poule de Montréal",
    description:
      "Signale un trou, vote pour les pires, suis les réparations. Le mouvement de Marquize.",
    type: "website",
    url: "https://mtlpothole.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body
        className={`${anton.variable} ${inter.variable} min-h-full antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
