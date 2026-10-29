import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PrintFlow - Smart Print Shop Management",
  description: "Next-gen print shop workflow, queue management, and order tracking.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
