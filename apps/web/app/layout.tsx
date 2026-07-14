import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ananya",
  description: "48 Studios Operations System",
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
