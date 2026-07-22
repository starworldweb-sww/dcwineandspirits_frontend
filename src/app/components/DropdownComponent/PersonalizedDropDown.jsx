"use client";

import React from "react";
import Link from "next/link";
import { usePersonalizedDropDown } from "@/app/api/hooks/category/usePersonalizedDropDown";



const PersonalizedDropDown = () => {
  // 1. API se personalization ka data fetch kar rahe hain
  const { data } = usePersonalizedDropDown();

  // 2. Saare sections nikal rahe hain - backend structure: { sections: [...] }
  const sections = data?.sections || [];

  // 3. Text-link columns wale sections (Engraving, Personalized) - jinka heading hai
  const linkColumns = sections.filter((section) => section.heading);

  // 4. Banner/image wala section - heading khaali hai aur item ke andar "image" field hai
  const bannerSection = sections.find(
    (section) => !section.heading && section.items?.[0]?.image
  );
  const banner = bannerSection?.items?.[0];

  // 5. Recommended bar wala section - heading khaali hai aur "image" wala nahi hai
  const recommendedSection = sections.find(
    (section) => !section.heading && !section.items?.[0]?.image
  );

  // 6. Recommended list mein pehla item sirf label hai ("<b>Recommended:</b>") - use skip kar rahe hain
  const recommendedItems = (recommendedSection?.items || []).filter(
    (item) => item.seo_url || item.custom_url
  );

  return (
    // 7. Poora dropdown panel - nav ki poori width, tera standard padding pattern
    <div className="absolute top-full left-0 w-full bg-white border border-gray-200 shadow-xl z-50">
      <div className="px-3 2xl:px-32 py-8">
        <div className="flex gap-16">

          {/* ================= TEXT LINK COLUMNS (Engraving, Personalized) ================= */}
          {linkColumns.map((column) => (
            <div key={column.heading}>
              {/* 8. Column ka heading - site ke Hind Madurai font aur maroon color mein */}
              <h4
                className="text-[15px] font-semibold uppercase text-black mb-4"
                style={{ fontFamily: "'Hind Madurai', sans-serif" }}
              >
                {column.heading}
              </h4>

              <ul className="space-y-3">
                {(column.items || []).map((item) => (
                  <li key={item.id}>
                    <Link
                      href={`/${item.seo_url}`}
                      className="text-[14px] text-gray-800 hover:text-[#98022e] transition-colors normal-case"
                      style={{ fontFamily: "'Sumana', serif" }}
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* ================= RIGHT SIDE BANNER IMAGE ================= */}
          {banner && (
            <Link href={banner.custom_url || `/${banner.seo_url}`} className="ml-auto">
              <img
                src={`${process.env.NEXT_PUBLIC_PRODUCTION_IMAGE_URL || ""}${banner.image}`}
                alt={banner.alt || banner.title}
                className="w-[450px] h-[195px] object-cover"
              />
            </Link>
          )}
        </div>
      </div>

      {/* ================= BOTTOM "RECOMMENDED" BLACK BAR ================= */}
      {recommendedItems.length > 0 && (
        <div className="bg-black px-3 2xl:px-32 py-3 flex items-center flex-wrap gap-x-2 gap-y-1 text-[13px] normal-case">
          <span className="font-bold text-white">Recommended:</span>
          {recommendedItems.map((item, index) => (
            <React.Fragment key={item.id}>
              <Link
                href={`/${item.seo_url}`}
                className="text-white hover:text-gray-300 transition-colors"
              >
                {item.title}
              </Link>
              {index < recommendedItems.length - 1 && (
                <span className="text-gray-500">•</span>
              )}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};

export default PersonalizedDropDown;