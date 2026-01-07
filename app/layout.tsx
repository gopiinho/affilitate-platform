import type { Metadata } from "next";
import { Pacifico, DM_Sans, Jersey_10 } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "@/components/ConvexClientProvider";

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
  title: "Neme's World",
  description: "I share everything here...",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${dm.variable} ${pacifico.variable} ${jersy.variable} antialiased relative min-h-screen`}
      >
        <div
          className="fixed inset-0 -z-10 opacity-30 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(236,72,153,0.99) 1px, transparent 1px)",
            backgroundSize: "14px 14px",
          }}
        />
        <ConvexClientProvider>{children}</ConvexClientProvider>
      </body>
    </html>
  );
}
