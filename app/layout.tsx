import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";

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
    <html lang="en">
      <body className={`${spaceGrotesk.className} antialiased`}>
        {children}
        {gallerymodal}
      </body>
    </html>
  );
}
