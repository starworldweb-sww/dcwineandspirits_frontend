"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePersonalizedDropDown } from "@/app/api/hooks/category/usePersonalizedDropDown";



const PersonalizedDropDown = ({ onClose }) => {
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
              <h3
                className="text-[18px] font-semibold text-[#98022e] uppercase  mb-2 font-sumana "
              
              >
                {column.heading}
              </h3>

              <ul className="space-y-0">
                {(column.items || []).map((item) => (
                  <li key={item.id}>
                    <Link
                      href={`/${item.seo_url}`}
                      onClick={onClose}
                      className="inline-block text-[14px] text-gray-800 hover:text-[#98022e] normal-case font-hind-madurai hover:translate-x-1 transition-all duration-200"
                     
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
            <Link
              href={banner.custom_url || `/${banner.seo_url}`}
              onClick={onClose}
              className="ml-auto relative w-[450px] h-[195px]"
            >
              <Image
                src={`${process.env.NEXT_PUBLIC_PRODUCTION_IMAGE_URL || ""}${banner.image}`}
                alt={banner.alt || banner.title}
                fill
                sizes="450px"
                className="object-cover"
              />
            </Link>
          )}
        </div>
      </div>

      {/* ================= BOTTOM "RECOMMENDED" BLACK BAR ================= */}
   {recommendedItems.length > 0 && (
  <div className="bg-[#98022e] px-3 2xl:px-32 py-3 flex items-center flex-wrap gap-x-2 gap-y-1 font-hind-madurai">
    <span className="font-bold text-white mr-1 text-[16px] normal-case">
      Recommended:
    </span>
    {recommendedItems.map((item, index) => (
      <React.Fragment key={item.id}>
        {index !== 0 && <span className="text-white">•</span>}
        <Link
          href={`/${item.seo_url}`}
          onClick={onClose}
          className="text-white normal-case text-[16px] hover:text-black transition-colors duration-200 "
        >
          {item.title}
        </Link>
      </React.Fragment>
    ))}
  </div>
)}
    </div>
  );
};

export default PersonalizedDropDown;