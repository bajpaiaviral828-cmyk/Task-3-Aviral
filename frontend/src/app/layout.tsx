import type { Metadata } from "next";
import { Inter, Bodoni_Moda } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import MagneticCursor from "@/components/ui/magnetic-cursor";
import { SmoothScroll } from "@/components/ui/SmoothScroll";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const bodoni = Bodoni_Moda({
  variable: "--font-heading",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "cleo.org",
  description: "cleo.org - Where imagination meets structure.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${bodoni.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-[#000000] text-[#ffffff] selection:bg-[#ffffff] selection:text-[#000000]">
        <SmoothScroll>
          {/* Grain overlay for tactile depth */}
          <div className="fixed inset-0 z-50 pointer-events-none opacity-[0.05] mix-blend-screen bg-[url('https://upload.wikimedia.org/wikipedia/commons/7/76/1k_Dissolve_Noise_Texture.png')] bg-repeat" />
          
          {children}
          <MagneticCursor />
          <Toaster theme="dark" />
        </SmoothScroll>
      </body>
    </html>
  );
}
