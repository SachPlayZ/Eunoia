import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type React from "react"; // Import React
import { headers } from "next/headers";
import { cookieToInitialState } from "wagmi";

import { getConfig } from "./config";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MindAI - AI-Powered Mental Health Support",
  description:
    "Experience personalized mental health therapy with our advanced AI agents, available 24/7.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialState = cookieToInitialState(
    getConfig(),
    headers().get("cookie")
  );
  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        <Providers initialState={initialState}>{children}</Providers>
      </body>
    </html>
  );
}
