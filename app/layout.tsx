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
  title: "mtlpothole — where's the hole?",
  description:
    "Montreal's community pothole map. Report a pothole, vote up the worst ones, and watch them get filled.",
  openGraph: {
    title: "mtlpothole — where's the hole?",
    description:
      "Report a pothole, vote on the worst, watch them get filled. Montreal's community pothole map.",
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
