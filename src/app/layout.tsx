import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "McNotes - Outlining & Markdown Writing",
  description: "A cozy, distraction-free markdown editor for writing books, novels, and outlines.",
  icons: {
    icon: "/branding/logos/mcnotes-app-badge.svg",
    shortcut: "/branding/logos/mcnotes-app-badge.svg",
    apple: "/branding/logos/mcnotes-app-badge.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

