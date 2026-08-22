"use client";

import React from "react";
import Link from "next/link";
import { Gem, GraduationCap, Gift, Cake, Martini, Home } from "lucide-react";
import { useOccasionMenu } from "@/app/api/hooks/category/useOccasionMenu";

const ICONS = [Gem, GraduationCap, Gift, Cake, Martini, Home];

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
      <div className="flex items-center justify-center flex-wrap gap-x-3 gap-y-2 py-2 2xl:py-3">
        {occasions.map((occasion, index) => {
          const Icon = ICONS[index % ICONS.length];
          const active = index === 0;
          const label = occasion.title || occasion.label || occasion.heading;
          const slug = occasion.seo_url || occasion.custom_url || occasion.href;

          return (
            <React.Fragment key={occasion.id || label}>
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
                  strokeWidth={active ? 2 : 1.5}
                  className="text-[#98022e]"
                />
                {label}
              </Link>

              {index < occasions.length - 1 && (
                <span className="hidden sm:block h-4 w-px bg-gray-300" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default OccasionBar;
