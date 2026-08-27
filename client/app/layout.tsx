import type { Metadata } from "next";
import { Fredoka, Quicksand } from "next/font/google";
import "./globals.css";

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-fredoka",
  display: "swap",
});

const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-quicksand",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MeowDo: Chloe's Study Nest",
  description: "Chloe 專屬的貓咪陪伴備考待辦清單",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW">
      <body className={`${fredoka.variable} ${quicksand.variable} font-sans bg-cat-bg text-cat-text antialiased min-h-screen`}>
        {children}
      </body>
    </html>
  );
}