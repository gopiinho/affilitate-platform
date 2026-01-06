import type { Metadata } from "next";
import { Pacifico, DM_Sans, Jersey_10 } from "next/font/google";
import "./globals.css";

const pacifico = Pacifico({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pacifico",
});

const dm = DM_Sans({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-dm",
});

const jersy = Jersey_10({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-jersy",
});

export const metadata: Metadata = {
  title: "nemeowww",
  description: "cute beauty finds ♡",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${dm.variable} ${pacifico.variable} ${jersy.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
