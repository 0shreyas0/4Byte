import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Geist_Mono, Inter, Outfit, Lora, Space_Mono } from "next/font/google";
import "../styles/globals.css";
import { ClientLayout } from "@/components/layout/ClientLayout";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Hackathon Starter Kit",
  description: "Built for speed and aesthetics",
  icons: {
    icon: [
      { url: "/logo_lightmode.png", media: "(prefers-color-scheme: light)" },
      { url: "/logo_darkmode.png", media: "(prefers-color-scheme: dark)" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jakarta.variable} ${inter.variable} ${outfit.variable} ${lora.variable} ${spaceMono.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <body className="antialiased">
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
