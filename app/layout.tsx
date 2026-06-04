import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "IrieOS",
  description: "A dreamy fake operating system portfolio shell for Irie.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body>{children}</body>
    </html>
  );
}
