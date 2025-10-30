import type { Metadata } from "next";
import { Poppins, Fira_Code } from "next/font/google";
import "./globals.css";
import AuthInitializer from "@/components/AuthInitializer";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const firaCode = Fira_Code({
  variable: "--font-fira",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "GPA Calculator",
  description:
    "Easily compute your GPA with a modern UI, data persistence, and interactive features.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${firaCode.variable} font-sans bg-gray-50 text-gray-900 antialiased`}
      >
        {/* ✅ Client-side logic handled here */}
        <AuthInitializer />
        {children}
      </body>
    </html>
  );
}
