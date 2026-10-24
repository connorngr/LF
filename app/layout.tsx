import type { Metadata } from "next";
import { Space_Grotesk, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { SoundCloudPlayer } from "@/components/organisms/SoundCloudPlayer";
import { SoundCloudTrackProvider } from "@/components/organisms/SoundCloudTrackProvider";
import { getLatestPostTrackId } from "@/lib/posts";
import { UmamiScript } from "@/components/organisms/UmamiScript";
import { themeInitScript } from "@/lib/theme";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LF's Gallery",
  description: "A gallery of life moments",
};

export default async function RootLayout({
  children,
  gallerymodal,
}: Readonly<{
  children: React.ReactNode;
  gallerymodal: React.ReactNode;
}>) {
  const latestTrackId = await getLatestPostTrackId();

  return (
    // suppressHydrationWarning: the theme script sets class/style on <html> before hydration.
    <html lang="en" className={cn("font-sans", geist.variable)} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className={`${spaceGrotesk.className} antialiased`}>
        <UmamiScript />
        <SoundCloudTrackProvider initialTrackId={latestTrackId}>
          {children}
          {gallerymodal}
          <SoundCloudPlayer />
        </SoundCloudTrackProvider>
      </body>
    </html>
  );
}
