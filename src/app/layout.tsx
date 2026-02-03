import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "0xRob Bounty Hunter | Autonomous AI Agent",
  description: "An autonomous AI agent that hunts GitHub bounties, writes code, and earns crypto. Built for the Colosseum Agent Hackathon.",
  openGraph: {
    title: "0xRob Bounty Hunter",
    description: "Autonomous AI agent hunting GitHub bounties and earning crypto",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
