// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "cat-bg": "#FAF7F2",      // 復古暖奶油白背景
        "cat-accent": "#E07A5F",  // 溫暖珊瑚粉
        "cat-blue": "#8C9DA8",    // 莫蘭迪藍
        "cat-text": "#2D2B2A",    // 深炭灰字體
        "cat-border": "#E5DCCB",  // 柔和邊框
      },
      boxShadow: {
        'polaroid': '0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
};
export default config;