"use client";

import React from "react";
import Link from "next/link";
import { GraduationCap, Gift, Cake, Martini, Home } from "lucide-react";
import { GiPumpkinLantern } from "react-icons/gi";
import { useOccasionMenu } from "@/app/api/hooks/category/useOccasionMenu";

// First icon is the Halloween pumpkin, the rest are the same as before
const ICONS = [GiPumpkinLantern, GraduationCap, Gift, Cake, Martini, Home];

const OccasionBar = ({ data, isLoading: propLoading, isError: propError }) => {
  // 1. Agar parent se data diya gaya hai to hook ko disable kar dete hain
  const hookResult = useOccasionMenu({ enabled: !data && !propLoading });

  // 2. Prop-based data ko priority do, warna hook wala data use karo
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
          const Icon = ICONS[index % ICONS.length];
          const active = index === 0;
          const label = occasion.title || occasion.label || occasion.heading;
          const slug = occasion.seo_url || occasion.custom_url || occasion.href;

          // react-icons are filled icons, so strokeWidth would only make the pumpkin look blurry.
          // Only the lucide icons get it.
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