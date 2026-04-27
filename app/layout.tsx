import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "DAIS Canteen Menu",
  description: "Server-rendered daily canteen menu"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
