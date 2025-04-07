/**
 * Root layout for the Next.js app.
 * Provides basic structure and metadata.
 */
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blogging App",
  description: "A secure blogging platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
