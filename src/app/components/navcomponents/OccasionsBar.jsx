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
} from "lucide-react";
import { GiPumpkinLantern } from "react-icons/gi";
import { useOccasionMenu } from "@/app/api/hooks/category/useOccasionMenu";

// Step 1: Keyword -> Icon mapping.
// Naya occasion aaye toh bas yahan ek line add karo.
// Order matter karta hai: pehle match hone wala keyword jeetega.
const ICON_RULES = [
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

// Corporate occasion ka slug API se nahi, hamari taraf se fixed hoga
const CORPORATE_SLUG = "corporate/";

// Step 3: Label + slug se sahi icon dhundhne wala helper function
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
      <div className="flex items-center justify-between flex-wrap gap-y-2 py-2 2xl:py-3">
        {occasions.map((occasion, index) => {
          const active = index === 0;
          const label = occasion.title || occasion.label || occasion.heading;
          const apiSlug = occasion.seo_url || occasion.custom_url || occasion.href;

          // Agar label/slug me "corporate" hai toh API ka slug ignore karke apna slug use karo
          const isCorporate = `${label ?? ""} ${apiSlug ?? ""}`
            .toLowerCase()
            .includes("corporate");
          const slug = isCorporate ? CORPORATE_SLUG : apiSlug;

          // Icon ab index se nahi, naam/slug se decide hoga
          const Icon = getIconForOccasion(label, apiSlug);

          // react-icons filled hote hain, isliye pumpkin pe strokeWidth nahi lagate
          const strokeProps =
            Icon === GiPumpkinLantern
              ? {}
              : { strokeWidth: active ? 2 : 1.5 };

          return (
            <div
              key={occasion.id || label}
              className="flex items-center pr-3 border-r border-gray-300 last:border-r-0 last:pr-0"
            >
              <Link
                href={`/${slug}`}
                className={`flex font-sumana items-center gap-1.5 text-[14px] font-serif tracking-wide uppercase whitespace-nowrap transition-colors ${
                  active
                    ? "text-[#98022e] font-bold"
                    : "text-[#2b2b2b] font-normal hover:text-[#98022e]"
                }`}
              >
                <Icon
                  size={16}
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