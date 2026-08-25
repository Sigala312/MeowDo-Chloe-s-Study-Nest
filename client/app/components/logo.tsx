// src/components/Logo.tsx
import React from "react";

interface LogoProps {
  className?: string;
  size?: number | string;
  variant?: "full" | "icon-only"; // 支援完整徽章或純 Icon 模式
}

export const Logo: React.FC<LogoProps> = ({
  className = "",
  size = 200,
  variant = "full",
}) => {
  // 1. 純 Icon 版 (手繪感 Chloe 名字與天使貓)
  if (variant === "icon-only") {
    return (
      <div className={`inline-flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
        <svg viewBox="0 0 160 160" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          {/* 內圈底色 */}
          <circle cx="80" cy="80" r="75" fill="#FFFDF9" stroke="#4A3E3D" strokeWidth="4"/>
          
          {/* 核心內容 (應用圓潤字體) */}
          <g transform="translate(-70, -70)">
            {/* Chloe 名稱 */}
            <text x="150" y="98" font-family="'Fredoka', 'Quicksand', sans-serif" font-weight="700" font-size="24" fill="#8B6B61" text-anchor="middle" letter-spacing="1">
              Chloe
            </text>

            {/* 巢穴編織籃 (修正生硬線條) */}
            <path d="M 85,175 C 85,215 215,215 215,175 C 205,185 95,185 85,175 Z" fill="#D4A373" stroke="#4A3E3D" strokeWidth="3" stroke-linejoin="round"/>

            {/* 書本 */}
            <rect x="92" y="148" width="16" height="32" rx="2" fill="#E76F51" stroke="#4A3E3D" strokeWidth="2.5" transform="rotate(-12, 100, 164)"/>
            <rect x="192" y="148" width="16" height="32" rx="2" fill="#457B9D" stroke="#4A3E3D" strokeWidth="2.5" transform="rotate(15, 200, 164)"/>

            {/* 天使翅膀貓咪 (重製為手繪感線條) */}
            <g transform="translate(10, 5)">
              <path d="M 115,172 C 105,150 125,135 150,135 C 175,135 185,155 175,172 C 160,178 130,178 115,172 Z" fill="#FFFFFF" stroke="#4A3E3D" strokeWidth="3"/>
              <path d="M 118,168 C 110,165 105,152 112,145 C 118,140 128,148 128,158 Z" fill="#FFFFFF" stroke="#4A3E3D" strokeWidth="3"/>
              <polygon points="108,146 112,136 120,144" fill="#FFE5D9" stroke="#4A3E3D" strokeWidth="2.5" stroke-linejoin="round"/>
              <polygon points="120,144 126,135 132,146" fill="#FFE5D9" stroke="#4A3E3D" strokeWidth="2.5" strokeLinejoin="round"/>
              <path d="M 112,154 Q 116,158 120,154" fill="none" stroke="#4A3E3D" strokeWidth="2.5" stroke-linecap="round"/>
              <path d="M 175,168 C 185,175 178,185 168,180" fill="none" stroke="#4A3E3D" strokeWidth="3" stroke-linecap="round"/>
              <g fill="#FFFFFF" stroke="#4A3E3D" strokeWidth="2.5" strokeLinejoin="round">
                <path d="M 148,140 C 145,122 160,118 168,128 C 172,122 180,126 176,134 C 180,135 180,143 170,144 C 160,145 152,142 148,140 Z" />
              </g>
            </g>
          </g>
        </svg>
      </div>
    );
  }

  // 2. 完整徽章版 (提升整體細節與溫暖感)
  return (
    <div className={`inline-flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg
        viewBox="0 0 300 300"
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.08" />
          </filter>
          {/* 定義文字環繞路徑 */}
          <path id="topTextPath" d="M 50,150 A 100,100 0 0,1 250,150" fill="none" />
          <path id="bottomTextPath" d="M 250,150 A 100,100 0 0,1 50,150" fill="none" />
        </defs>

        {/* 外圈底色與手繪感邊框 */}
        <circle cx="150" cy="150" r="140" fill="#FAF7F2" stroke="#4A3E3D" strokeWidth="5" filter="url(#shadow)"/>
        <circle cx="150" cy="150" r="130" fill="none" stroke="#E6C5B8" strokeWidth="2" strokeDasharray="6,4"/>

        {/* 內圈插畫區 */}
        <circle cx="150" cy="150" r="92" fill="#FFFDF9" stroke="#4A3E3D" strokeWidth="4"/>

        {/* 環形文字：MeowDo (應用 Fredoka 圓潤字體) */}
        <text font-family="'Fredoka', 'Quicksand', sans-serif" font-weight="700" font-size="22" fill="#4A3E3D" letter-spacing="2">
          <textPath href="#topTextPath" startOffset="50%" text-anchor="middle">
            MeowDo
          </textPath>
        </text>

        {/* 環形文字：Study Nest */}
        <text font-family="'Fredoka', 'Quicksand', sans-serif" font-weight="700" font-size="20" fill="#4A3E3D" letter-spacing="1.5">
          <textPath href="#bottomTextPath" startOffset="50%" text-anchor="middle">
            Study Nest
          </textPath>
        </text>

        {/* 左右貓爪印 (提升清晰度與貓咪感) */}
        <g transform="translate(32, 142) scale(0.7)" fill="#4A3E3D">
          <ellipse cx="12" cy="15" rx="5" ry="6" />
          <circle cx="2" cy="6" r="2.5" />
          <circle cx="8" cy="2" r="2.5" />
          <circle cx="16" cy="2" r="2.5" />
          <circle cx="22" cy="6" r="2.5" />
        </g>
        <g transform="translate(248, 142) scale(0.7)" fill="#4A3E3D">
          <ellipse cx="12" cy="15" rx="5" ry="6" />
          <circle cx="2" cy="6" r="2.5" />
          <circle cx="8" cy="2" r="2.5" />
          <circle cx="16" cy="2" r="2.5" />
          <circle cx="22" cy="6" r="2.5" />
        </g>

        {/* 核心內容：Chloe 名稱 (應用莫蘭迪 secondary 色) */}
        <text x="150" y="98" font-family="'Fredoka', 'Quicksand', sans-serif" font-weight="700" font-size="24" fill="#8B6B61" text-anchor="middle" letter-spacing="1">
          Chloe
        </text>

        {/* 巢穴編織籃 */}
        <path d="M 85,175 C 85,215 215,215 215,175 C 205,185 95,185 85,175 Z" fill="#D4A373" stroke="#4A3E3D" strokeWidth="3" stroke-linejoin="round"/>
        <path d="M 100,182 C 120,202 180,202 200,182" fill="none" stroke="#B8860B" strokeWidth="2" opacity="0.5"/>

        {/* 書本 */}
        <rect x="92" y="148" width="16" height="32" rx="2" fill="#E76F51" stroke="#4A3E3D" strokeWidth="2.5" transform="rotate(-12, 100, 164)"/>
        <rect x="192" y="148" width="16" height="32" rx="2" fill="#457B9D" stroke="#4A3E3D" strokeWidth="2.5" transform="rotate(15, 200, 164)"/>

        {/* 天使翅膀貓咪 */}
        <g transform="translate(10, 5)">
          <path d="M 115,172 C 105,150 125,135 150,135 C 175,135 185,155 175,172 C 160,178 130,178 115,172 Z" fill="#FFFFFF" stroke="#4A3E3D" strokeWidth="3"/>
          <path d="M 118,168 C 110,165 105,152 112,145 C 118,140 128,148 128,158 Z" fill="#FFFFFF" stroke="#4A3E3D" strokeWidth="3"/>
          <polygon points="108,146 112,136 120,144" fill="#FFE5D9" stroke="#4A3E3D" strokeWidth="2.5" stroke-linejoin="round"/>
          <polygon points="120,144 126,135 132,146" fill="#FFE5D9" stroke="#4A3E3D" strokeWidth="2.5" strokeLinejoin="round"/>
          <path d="M 112,154 Q 116,158 120,154" fill="none" stroke="#4A3E3D" strokeWidth="2.5" stroke-linecap="round"/>
          <path d="M 175,168 C 185,175 178,185 168,180" fill="none" stroke="#4A3E3D" strokeWidth="3" stroke-linecap="round"/>
          <g fill="#FFFFFF" stroke="#4A3E3D" strokeWidth="2.5" strokeLinejoin="round">
            <path d="M 148,140 C 145,122 160,118 168,128 C 172,122 180,126 176,134 C 180,135 180,143 170,144 C 160,145 152,142 148,140 Z" />
          </g>
        </g>
      </svg>
    </div>
  );
};

export default Logo;