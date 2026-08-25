// // src/app/layout.tsx
// import type { Metadata } from "next";
// import Header from "./components/Header";
// import "./globals.css";

// // 1. 引入字體 (Fredoka 和 Quicksand)
// export const metadata: Metadata = {
//   title: "MeowDo: Chloe's Study Nest",
//   description: "Chloe 專屬的貓咪陪伴備考待辦清單",
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="zh-TW">
//       <head>
//         {/* 2. 貼上 Google Fonts 的 引入連結 */}
//         <link rel="preconnect" href="https://fonts.googleapis.com" />
//         <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
//         <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@500;700&family=Noto+Sans+TC:wght@400;500;700&family=Quicksand:wght@500;700&display=swap" rel="stylesheet" />
//       </head>
//       {/* 3. 在 body 应用字體 (font-sans) 和背景顏色 (bg-cat-bg) */}
//       <body className="font-sans bg-cat-bg text-cat-text antialiased min-h-screen flex flex-col">
//         <Header />
//         <main className="flex-1 max-w-7xl w-full mx-auto p-6">
//           {children}
//         </main>
//       </body>
//     </html>
//   );
// }
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW">
      <body className={`${fredoka.variable} ${quicksand.variable} font-sans bg-cat-bg text-cat-text antialiased min-h-screen`}>
        {children}
      </body>
    </html>
  );
}