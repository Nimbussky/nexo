import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nexo — Connect and share",
  description: "A real social platform for people, posts, photos, and video.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-ink">{children}</body>
    </html>
  );
}
