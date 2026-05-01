import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VoteMate — AI Election Assistant",
  description:
    "An intelligent, AI-powered election assistant that guides voters through eligibility, registration, deadlines, documents, and voting with personalized, step-by-step guidance powered by Google Gemini.",
  keywords: ["voting", "election", "AI assistant", "voter registration", "Gemini", "NLP"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
