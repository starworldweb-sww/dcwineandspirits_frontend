"use client";

import { Sumana } from "next/font/google";
import React from "react";
import { usePathname } from "next/navigation";
import { Leaf, Snowflake } from "lucide-react";
import Breadcrumbs from "./navcomponents/Breadcrumbs";
import { decodeHtml } from "@/libs/decodeHtml";

// Sumana font - only for the category/product title heading
const sumana = Sumana({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
});

// ============================================================
// Thanksgiving theme settings
// ============================================================

// Step 1: Master switch. Set to false to turn the theme off completely.
const THANKSGIVING_THEME_ENABLED = true;

// Step 2: The theme only runs on the page with this slug.
const THEME_SLUG = "thank-you-wine-gift-baskets";

// Step 3: Date window ("YYYY-MM-DD"). Set both to null to skip the date check
// and decide only by slug.
const THEME_START_DATE = "2026-11-01";
const THEME_END_DATE = "2026-11-30";

// ============================================================
// Christmas theme settings (same idea as Thanksgiving)
// ============================================================

// Master switch for Christmas. Set to false to turn it off completely.
const CHRISTMAS_THEME_ENABLED = true;

// The Christmas theme runs on these page slugs (removed trailing slash).
const CHRISTMAS_SLUGS = ["holiday-gift-basket", "christmas-wine-gift-baskets"];

// Santa cap shows only on this specific Christmas page slug
const CHRISTMAS_CAP_SLUG = "christmas-wine-gift-baskets";

// Christmas date window ("YYYY-MM-DD"). Set both to null to decide only by slug.
const CHRISTMAS_START_DATE = "2026-11-01";
const CHRISTMAS_END_DATE = "2026-12-31";

// Step 4: Is today inside the date window?
const isThemeActiveToday = (startDate = null, endDate = null) => {
  const today = new Date();
  if (startDate && today < new Date(`${startDate}T00:00:00`)) return false;
  if (endDate && today > new Date(`${endDate}T23:59:59`)) return false;
  return true;
};

// Step 5: Supports both a single slug string and an array of slugs.
const isThemeSlugPage = (pathname, slugs = THEME_SLUG) => {
  const segments = (pathname || "").split("/").filter(Boolean);
  const currentSlug = segments[0];
  if (!currentSlug) return false;

  const slugList = Array.isArray(slugs) ? slugs : [slugs];
  return slugList
    .map((s) => s.replace(/^\/+|\/+$/g, ""))
    .includes(currentSlug);
};

// Step 6: Small decorative turkey (inline SVG, since lucide has no turkey icon).
const TurkeyIcon = ({ size = 22 }) => {
  const feathers = [
    { angle: -60, color: "#b45309" },
    { angle: -30, color: "#c2570c" },
    { angle: 0, color: "#d97706" },
    { angle: 30, color: "#c2570c" },
    { angle: 60, color: "#b45309" },
  ];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      {feathers.map((feather) => (
        <g key={feather.angle} transform={`rotate(${feather.angle} 16 20)`}>
          <ellipse cx="16" cy="10" rx="3" ry="7" fill={feather.color} />
        </g>
      ))}
      <circle cx="16" cy="21" r="6" fill="#7c2d12" />
      <circle cx="16" cy="16" r="3.2" fill="#92400e" />
      <polygon points="15,16.8 17,16.8 16,18.6" fill="#f59e0b" />
      <ellipse cx="16" cy="19.4" rx="0.9" ry="1.4" fill="#dc2626" />
      <circle cx="14.7" cy="15.2" r="0.6" fill="#fff7ed" />
      <circle cx="17.3" cy="15.2" r="0.6" fill="#fff7ed" />
    </svg>
  );
};

// ============================================================
// Step 7: Fairy lights (twinkle + swing)
// ============================================================
const SWAGS = 7;
const BULB_POSITIONS = [0.16, 0.5, 0.84];
const BULB_COLORS = ["#ff4d5a", "#ffd45a", "#3ddc84", "#ffffff"];

const buildLights = (stripHeight, sag) => {
  const bulbs = Array.from({ length: SWAGS * BULB_POSITIONS.length }, (_, i) => {
    const seg = Math.floor(i / BULB_POSITIONS.length);
    const u = BULB_POSITIONS[i % BULB_POSITIONS.length];
    return {
      id: i,
      left: `${((seg + u) / SWAGS) * 100}%`,
      top: 4 * sag * u * (1 - u),
      color: BULB_COLORS[i % BULB_COLORS.length],
      delay: (i % 4) * 0.55,
      swingDuration: 3 + (i % 5) * 0.45,
    };
  });

  const path = Array.from({ length: SWAGS }, (_, s) => {
    const x0 = (s / SWAGS) * 100;
    const x1 = ((s + 1) / SWAGS) * 100;
    const mid = (x0 + x1) / 2;
    return `${s === 0 ? `M${x0},0 ` : ""}Q${mid},${sag * 2} ${x1},0`;
  }).join(" ");

  return { stripHeight, bulbs, path };
};

const THANKSGIVING_LIGHTS = buildLights(18, 8);
const CHRISTMAS_LIGHTS = buildLights(14, 4);

const FairyLights = ({ lights = THANKSGIVING_LIGHTS }) => (
  <div
    aria-hidden="true"
    className="pointer-events-none absolute inset-x-0 top-0 z-[2]"
    style={{ height: lights.stripHeight }}
  >
    <svg
      className="absolute inset-0 h-full w-full"
      viewBox={`0 0 100 ${lights.stripHeight}`}
      preserveAspectRatio="none"
    >
      <path
        d={lights.path}
        fill="none"
        stroke="rgba(20,20,20,0.8)"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
      />
    </svg>

    {lights.bulbs.map((b) => (
      <span
        key={b.id}
        className="absolute block -translate-x-1/2"
        style={{ left: b.left, top: b.top }}
      >
        <span
          className="xmas-bulb block h-[9px] w-[6px] rounded-full md:h-[11px] md:w-[7px]"
          style={{
            backgroundColor: b.color,
            color: b.color,
            animationDelay: `${b.delay}s, ${b.delay}s`,
            animationDuration: `2.1s, ${b.swingDuration}s`,
          }}
        />
      </span>
    ))}

    <style jsx global>{`
      .xmas-bulb {
        box-shadow: 0 0 6px 2px currentColor;
        transform-origin: 50% 0;
        animation:
          bulbTwinkle 2.1s ease-in-out infinite,
          bulbSwing 3.6s ease-in-out infinite;
      }

      @keyframes bulbTwinkle {
        0%,
        100% {
          opacity: 1;
          box-shadow: 0 0 8px 3px currentColor;
        }
        50% {
          opacity: 0.45;
          box-shadow: 0 0 3px 1px currentColor;
        }
      }

      @keyframes bulbSwing {
        0%,
        100% {
          transform: rotate(-9deg);
        }
        50% {
          transform: rotate(9deg);
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .xmas-bulb {
          animation: none;
        }
      }
    `}</style>
  </div>
);

// ============================================================
// Small decorative Christmas tree (inline SVG)
// ============================================================
const ChristmasTreeIcon = ({ size = 22 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* trunk */}
    <rect x="14" y="26" width="4" height="4" rx="0.8" fill="#7c2d12" />
    {/* tree layers */}
    <polygon points="16,9 7,20 25,20" fill="#15803d" />
    <polygon points="16,14 5,26 27,26" fill="#166534" />
    {/* star */}
    <polygon
      points="16,2 17.6,6 21.8,6.2 18.5,8.8 19.6,12.9 16,10.6 12.4,12.9 13.5,8.8 10.2,6.2 14.4,6"
      fill="#facc15"
    />
    {/* ornaments */}
    <circle cx="13" cy="19" r="1.3" fill="#ef4444" />
    <circle cx="19.5" cy="22" r="1.3" fill="#ef4444" />
    <circle cx="12" cy="24" r="1.1" fill="#facc15" />
    <circle cx="17" cy="16.5" r="1.1" fill="#facc15" />
  </svg>
);

// ============================================================
// Step 8: Santa cap (inline SVG)
// ============================================================
const SantaCap = ({ size = 32 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    className="pointer-events-none absolute -top-[18px] -left-[12px] z-[3] -rotate-[18deg] drop-shadow-[0_0_4px_rgba(255,255,255,0.95)] drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)]"
  >
    <path
      d="M6 21 C6 11 13 4 21 5 C26 6 29 9 29 13 C25 10 22 13 26 21 Z"
      fill="#ef4444"
    />
    <path d="M10 20 C10 14 14 9 19 8 C15 12 14 16 15 21 Z" fill="#b91c1c" />
    <path
      d="M12 9 C14 7 17 6.5 19 7"
      fill="none"
      stroke="#fecaca"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
    <rect
      x="3"
      y="20"
      width="26"
      height="7"
      rx="3.5"
      fill="#ffffff"
      stroke="#d1d5db"
      strokeWidth="0.8"
    />
    <circle cx="29" cy="13" r="3.2" fill="#ffffff" stroke="#d1d5db" strokeWidth="0.8" />
  </svg>
);

const ProductsHeader = ({ categoryName, breadcrumbs }) => {
  const pathname = usePathname();

  // Thanksgiving: switch on + slug match + inside date window
  const isThanksgivingTheme =
    THANKSGIVING_THEME_ENABLED &&
    isThemeSlugPage(pathname, THEME_SLUG) &&
    isThemeActiveToday(THEME_START_DATE, THEME_END_DATE);

  // Christmas: switch on + any slug in CHRISTMAS_SLUGS match + inside date window
  const isChristmasTheme =
    CHRISTMAS_THEME_ENABLED &&
    isThemeSlugPage(pathname, CHRISTMAS_SLUGS) &&
    isThemeActiveToday(CHRISTMAS_START_DATE, CHRISTMAS_END_DATE);

  // Cap: only on the dedicated Christmas page slug during active Christmas window
  const showSantaCap =
    isChristmasTheme && isThemeSlugPage(pathname, CHRISTMAS_CAP_SLUG);

  const topStripClass = "bg-[#c28293]";
  const headerBgClass = "bg-[#eeeeee]";
  const headerTopPaddingClass = showSantaCap ? "pt-6" : isChristmasTheme ? "pt-5" : "pt-3";

  const titleColorClass = isThanksgivingTheme
    ? "text-[#6b2410] font-bold [text-shadow:0_1px_0_rgba(255,255,255,0.8)]"
    : isChristmasTheme
    ? "text-[#991b1b] font-bold [text-shadow:0_1px_0_rgba(255,255,255,0.8)]"
    : "text-black";

  return (
    <>
      <div className={`w-full h-[2px] ${topStripClass}`} />

      <div
        className={`relative w-full ${headerBgClass} ${headerTopPaddingClass} px-3 2xl:px-20 text-center flex flex-col items-center`}
      >
        {isThanksgivingTheme && <FairyLights lights={THANKSGIVING_LIGHTS} />}
        {isChristmasTheme && <FairyLights lights={CHRISTMAS_LIGHTS} />}

        <h1
          className={`${sumana.className} block w-full max-w-[1400px] ${titleColorClass} text-[22px] md:text-[26px] leading-[31.2px] tracking-[1px] text-center capitalize transition-all duration-300 mb-2`}
        >
          {showSantaCap ? (
            <span className="relative inline-block">
              <SantaCap size={32} />
              {decodeHtml(categoryName)}
            </span>
          ) : (
            decodeHtml(categoryName)
          )}
        </h1>

        {isThanksgivingTheme ? (
          <div className="flex items-center justify-center gap-2" aria-hidden="true">
            <div className="w-14 h-[1px] bg-gradient-to-l from-[#c2570c] to-transparent" />
            <Leaf size={14} strokeWidth={1.75} className="text-[#c2570c] -rotate-12" />
            <TurkeyIcon size={22} />
            <Leaf size={14} strokeWidth={1.75} className="text-[#c2570c] -scale-x-100 -rotate-12" />
            <div className="w-14 h-[1px] bg-gradient-to-r from-[#c2570c] to-transparent" />
          </div>
        ) : isChristmasTheme ? (
          <div className="flex items-center justify-center gap-2" aria-hidden="true">
            <div className="w-14 h-[1px] bg-gradient-to-l from-[#991b1b] to-transparent" />
            <Snowflake size={14} strokeWidth={1.75} className="text-[#166534]" />
            <ChristmasTreeIcon size={22} />
            <Snowflake size={14} strokeWidth={1.75} className="text-[#166534]" />
            <div className="w-14 h-[1px] bg-gradient-to-r from-[#991b1b] to-transparent" />
          </div>
        ) : (
          <div className="w-32 h-[0.5px] bg-[#98022e] mx-auto" />
        )}

        <div className="w-full mt-1 flex justify-center pb-2">
          <Breadcrumbs breadcrumbs={breadcrumbs} />
        </div>
      </div>
    </>
  );
};

export default ProductsHeader;