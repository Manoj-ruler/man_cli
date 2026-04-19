import type { Metadata } from "next";
import { Syne, DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "TermAssist — The Terminal That Understands English",
  description:
    "A local, privacy-first terminal assistant that maps natural language to exact terminal commands. No cloud, no GPU, no latency. Powered by local vector search.",
  keywords: [
    "terminal",
    "CLI",
    "assistant",
    "bash",
    "commands",
    "AI",
    "local",
    "privacy",
    "vector search",
  ],
  metadataBase: new URL("https://termassist.vercel.app"),
  openGraph: {
    title: "TermAssist — The Terminal That Understands English",
    description:
      "Map natural language to bash commands instantly. 100% offline, 100% private.",
    url: "https://termassist.vercel.app",
    siteName: "TermAssist",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "TermAssist",
    description: "Map natural language to bash commands. 100% offline.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
