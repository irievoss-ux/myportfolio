import type { Metadata } from "next";
import { Space_Grotesk, Playfair_Display, Caveat } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-sans" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-serif", style: ['normal', 'italic'] });
const caveat = Caveat({ subsets: ["latin"], variable: "--font-handwriting" }); // The new organic font

export const metadata: Metadata = {
  title: "Irie Voss | Portfolio",
  description: "Broadcaster, tactician, and creator.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${spaceGrotesk.variable} ${playfair.variable} ${caveat.variable} font-sans bg-[#0a0a0a] text-[#e5e5e5] antialiased`}>
        {children}
      </body>
    </html>
  );
}