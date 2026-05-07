import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ArtistPulse - Artist Analytics Dashboard",
  description: "Comprehensive analytics dashboard for artists - track performance, trends, and fan engagement",
  keywords: "artist analytics, music dashboard, spotify analytics, artist performance",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-black">
        {children}
      </body>
    </html>
  );
}
