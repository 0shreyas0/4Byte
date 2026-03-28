import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "NeuralPath — AI-Powered Adaptive Learning",
  description:
    "Understand what you don't know — and why. NeuralPath uses AI and concept dependency graphs to detect your weak topics, find root causes, and build a personalized learning path.",
  keywords: "adaptive learning, AI tutor, personalized education, DSA, web development, aptitude",
  openGraph: {
    title: "NeuralPath — AI-Powered Adaptive Learning",
    description: "Understand what you don't know — and why.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
