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
// To support a new occasion, just add one line here.
// Order matters: the first matching keyword wins.
const ICON_RULES = [
  { keywords: ["thanksgiving"], icon: Leaf },
  { keywords: ["halloween", "pumpkin"], icon: GiPumpkinLantern },
  { keywords: ["christmas", "xmas", "holiday"], icon: TreePine },
  { keywords: ["graduation", "graduate"], icon: GraduationCap },
  { keywords: ["birthday"], icon: Cake },
  { keywords: ["wedding"], icon: Gem },
  { keywords: ["corporate"], icon: Handshake },
  { keywords: ["anniversary", "valentine", "love"], icon: Heart },
  { keywords: ["housewarming", "house-warming", "new-home", "home"], icon: Home },
  { keywords: ["cocktail", "party", "happy-hour"], icon: Martini },
  { keywords: ["new-year", "newyear"], icon: Sparkles },
];

// Step 2: Default icon when no keyword matches
const DEFAULT_ICON = Gift;

// Step 3: Helper to find the right icon from label + slug
const getIconForOccasion = (label = "", slug = "") => {
  const searchText = `${label} ${slug}`.toLowerCase();

  const matchedRule = ICON_RULES.find((rule) =>
    rule.keywords.some((keyword) => searchText.includes(keyword))
  );

  return matchedRule ? matchedRule.icon : DEFAULT_ICON;
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
      {/* flex-nowrap + overflow-x-auto: items stay on one line, scrollbar hidden */}
      <div className="flex flex-nowrap items-center justify-between gap-x-3 overflow-x-auto py-2 2xl:py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {occasions.map((occasion) => {
          const label = occasion.title || occasion.label || occasion.heading;
          const slug = occasion.seo_url || occasion.custom_url || occasion.href;

          // Icon is decided by name/slug
          const Icon = getIconForOccasion(label, slug);

          // react-icons are filled, so no strokeWidth for the pumpkin
          const strokeProps =
            Icon === GiPumpkinLantern ? {} : { strokeWidth: 2 };

          return (
            <div
              key={occasion.id || label}
              className="flex shrink-0 items-center pr-3 border-r border-gray-300 last:border-r-0 last:pr-0"
            >
              <Link
                href={`/${slug}`}
                className="relative flex font-sumana items-center gap-1.5 font-serif tracking-wide uppercase whitespace-nowrap transition-colors text-[14px] xl:text-[15px] 2xl:text-[16px] font-bold text-[#98022e]"
              >
                <Icon size={18} {...strokeProps} className="text-[#98022e]" />
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