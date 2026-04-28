import type { Metadata } from "next";
import { Space_Grotesk, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LF's Gallery",
  description: "A gallery of life moments",
};

export default function RootLayout({
  children,
  gallerymodal,
}: Readonly<{
  children: React.ReactNode;
  gallerymodal: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("dark:bg-background", "font-sans", geist.variable)}>
      <body className={`${spaceGrotesk.className} antialiased dark:bg-background dark:text-foreground`}>
        {children}
        {gallerymodal}
      </body>
    </html>
  );
}
