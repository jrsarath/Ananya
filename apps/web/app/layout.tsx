import type { Metadata } from "next";
import "./globals.css";
import { Navigation } from "../src/components/Navigation";

export const metadata: Metadata = {
  title: "Ananya - 48 Studios Operations System",
  description: "Internal operations system for physical inventory, procurement, and manufacturing",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="app-shell">
          <Navigation />
          <main className="main-content">{children}</main>
        </div>
      </body>
    </html>
  );
}
