"use client";

import React from "react";
import Link from "next/link";
import { Gem, GraduationCap, Gift, Cake, Martini, Home } from "lucide-react";
import { useOccasionMenu } from "@/app/api/hooks/category/useOccasionMenu";

// Apna exact path zaroor check kar lena

// 1. Static icons list - API se aane wale items ke saath INDEX ke hisaab se map honge
//    (jo icon pehle wale slot mein tha, wahi ab first API item ke saath aayega)
const ICONS = [Gem, GraduationCap, Gift, Cake, Martini, Home];

const OccasionBar = () => {
  // 2. API hook call - occasion menu wala hook
  const { data, isLoading, isError } = useOccasionMenu();

  // 3. Loading/error state - UI kharab na ho isliye bar hide kar dete hain
  if (isLoading || isError) return null;

  // 4. Data extraction - sections ke andar items hain (backend structure ke hisaab se adjust kar lena)
  const occasions = data?.sections?.[0]?.items || data?.sections || [];

  // 5. Agar API se kuch nahi mila toh bar hi hide kar do
  if (!occasions.length) return null;

  return (
    <div className="w-full bg-[#f2f2f2] border-y border-gray-200 px-3 2xl:px-32 hidden md:block">
      <div className="flex items-center justify-center flex-wrap gap-x-3 gap-y-2 py-2 2xl:py-3">
        {occasions.map((occasion, index) => {
          // 6. Position ke hisaab se icon uthaya - agar occasions ICONS se zyada hain toh cycle kar diya
          const Icon = ICONS[index % ICONS.length];

          // 7. Pehla item hamesha active/highlighted rahega - bold + maroon
          const active = index === 0;

          // 8. Backend field names adjust kar lena (label/title, href/seo_url ya custom_url)
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

              {/* Divider between items, skipped after the last one */}
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