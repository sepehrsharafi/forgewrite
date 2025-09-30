import type { Metadata } from "next";
import "./globals.css";
import { Inter, PT_Sans } from "next/font/google";
import ClientLayout from "./clientlayout";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

const ptSans = PT_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-pt-sans",
});

export const metadata: Metadata = {
  title: "Forgewrite",
  description: "Innovative Fire solutions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`relative ${inter.className} ${ptSans.variable}`}
    >
      <head>
        <title>Forgewrite</title>
        <meta name="description" content="Innovative Fire solutions" />

        <meta property="og:url" content="https://forgewrite.vercel.app" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Forgewrite" />
        <meta property="og:description" content="Innovative Fire solutions" />
        <meta
          property="og:image"
          content="https://forgewrite.vercel.app/opengraph-image.jpg?31a546c5e54a40da"
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="forgewrite.vercel.app" />
        <meta property="twitter:url" content="https://forgewrite.vercel.app" />
        <meta name="twitter:title" content="Forgewrite" />
        <meta name="twitter:description" content="Innovative Fire solutions" />
        <meta
          name="twitter:image"
          content="https://forgewrite.vercel.app/opengraph-image.jpg?31a546c5e54a40da"
        />
      </head>
      <body>
        <main>
          <ClientLayout>{children}</ClientLayout>
        </main>
      </body>
    </html>
  );
}
