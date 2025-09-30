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
      <body>
        <main>
          <ClientLayout>{children}</ClientLayout>
        </main>
      </body>
    </html>
  );
}
