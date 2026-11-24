"use client";

import React from "react";
import Link from "next/link";
import {
  GraduationCap,
  Gift,
  Cake,
  Martini,
  Home,
  Heart,
  Sparkles,
  TreePine,
  Gem,
  Handshake,
  Leaf, // Thanksgiving icon
} from "lucide-react";
import { GiPumpkinLantern } from "react-icons/gi";
import { useOccasionMenu } from "@/app/api/hooks/category/useOccasionMenu";

// Step 1: Keyword -> Icon mapping.
// Naya occasion aaye toh bas yahan ek line add karo.
// Order matter karta hai: pehle match hone wala keyword jeetega.
const ICON_RULES = [
  { keywords: ["thanksgiving"], icon: Leaf },
  { keywords: ["halloween", "pumpkin"], icon: GiPumpkinLantern },
  { keywords: ["christmas", "xmas", "holiday"], icon: TreePine },
  { keywords: ["graduation", "graduate"], icon: GraduationCap },
  { keywords: ["birthday"], icon: Cake },
  { keywords: ["wedding"], icon: Gem }, // Wedding ke liye Gem icon
  { keywords: ["corporate"], icon: Handshake }, // Corporate ke liye Handshake icon
  { keywords: ["anniversary", "valentine", "love"], icon: Heart },
  { keywords: ["housewarming", "house-warming", "new-home", "home"], icon: Home },
  { keywords: ["cocktail", "party", "happy-hour"], icon: Martini },
  { keywords: ["new-year", "newyear"], icon: Sparkles },
];

// Step 2: Koi keyword match na ho toh ye default icon dikhega
const DEFAULT_ICON = Gift;

// Step 3: Label + slug se sahi icon dhundhne wala helper function
const getIconForOccasion = (label = "", slug = "") => {
  const searchText = `${label} ${slug}`.toLowerCase();

  const matchedRule = ICON_RULES.find((rule) =>
    rule.keywords.some((keyword) => searchText.includes(keyword))
  );

  return matchedRule ? matchedRule.icon : DEFAULT_ICON;
};

// Step 4: Jis occasion ko highlight karna hai (bold + 2px bada text),
// uska keyword yahan daalo. Label ya slug mein match hoga.
const HIGHLIGHT_KEYWORDS = ["thanksgiving"];

const isHighlighted = (label = "", slug = "") => {
  const searchText = `${label} ${slug}`.toLowerCase();
  return HIGHLIGHT_KEYWORDS.some((keyword) => searchText.includes(keyword));
};

const OccasionBar = ({ data, isLoading: propLoading, isError: propError }) => {
  const hookResult = useOccasionMenu({ enabled: !data && !propLoading });

  const finalData = data !== undefined ? data : hookResult.data;
  const isLoading = propLoading !== undefined ? propLoading : hookResult.isLoading;
  const isError = propError !== undefined ? propError : hookResult.isError;

  if (isLoading || isError) return null;

  const occasions = finalData?.sections?.[0]?.items || finalData?.sections || [];

  if (!occasions.length) return null;

  return (
    <div className="w-full bg-[#f2f2f2] border-y border-gray-200 px-3 2xl:px-32 hidden md:block">
      {/* flex-nowrap + overflow-x-auto: items ek hi line mein, scrollbar hidden */}
      <div className="flex flex-nowrap items-center justify-between gap-x-3 overflow-x-auto py-2 2xl:py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {occasions.map((occasion, index) => {
          const active = index === 0;
          const label = occasion.title || occasion.label || occasion.heading;
          const apiSlug = occasion.seo_url || occasion.custom_url || occasion.href;

          // Har occasion API ka slug use karta hai
          const slug = apiSlug;

          // Icon naam/slug se decide hota hai
          const Icon = getIconForOccasion(label, apiSlug);

          // Highlight hona chahiye ya nahi
          const highlighted = isHighlighted(label, apiSlug);

          // react-icons filled hote hain, isliye pumpkin pe strokeWidth nahi lagate
          const strokeProps =
            Icon === GiPumpkinLantern
              ? {}
              : { strokeWidth: active || highlighted ? 2 : 1.5 };

          return (
            <div
              key={occasion.id || label}
              className="flex shrink-0 items-center pr-3 border-r border-gray-300 last:border-r-0 last:pr-0"
            >
              <Link
                href={`/${slug}`}
                // Tailwind dynamic class build time pe nahi chalti,
                // isliye dono size sets poore likhe hain (highlighted = normal + 2px)
                className={`relative flex font-sumana items-center gap-1.5 font-serif tracking-wide uppercase whitespace-nowrap transition-colors ${
                  highlighted
                    ? "text-[14px] xl:text-[15px] 2xl:text-[16px] font-bold"
                    : "text-[12px] xl:text-[13px] 2xl:text-[14px]"
                } ${
                  active
                    ? "text-[#98022e] font-bold"
                    : highlighted
                    ? "text-[#98022e] hover:text-[#98022e]"
                    : "text-[#2b2b2b] font-normal hover:text-[#98022e]"
                }`}
              >
                <Icon
                  size={highlighted ? 18 : 16}
                  {...strokeProps}
                  className="text-[#98022e]"
                />
                {label}
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OccasionBar;