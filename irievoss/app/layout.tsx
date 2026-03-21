import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vista Ultimate Simulator",
  description: "A high-fidelity Windows Vista Ultimate architectural replica.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-[#05070b] text-white antialiased">{children}</body>
    </html>
  );
}
