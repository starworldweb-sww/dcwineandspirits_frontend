"use client";

import React from "react";
import Link from "next/link";
import { useOccasionTreasures } from "@/app/api/hooks/category/useOccasionTreasures";
// Apna exact hook path check kar lena

const OcassionsDropDown = () => {
  const { data, isLoading, isError } = useOccasionTreasures();
 




  if (isLoading || isError) return null;

  // API response ka shape kabhi { sections } hota hai,
  // kabhi { data: { sections } } (agar service unwrap na kare)
  // dono handle kar rahe hain taaki crash na ho
  const sections = data?.data?.sections || data?.sections || [];
  

  // ============================================
  // Banner wala section - jis section ke kisi item
  // mein "image" field hai (Personalized Bottles wala)
  // ============================================
  const bannerSection = sections.find((s) =>
    s.items?.some((item) => item.image),
  );
  const bannerItem = bannerSection?.items?.find((item) => item.image);

  // ============================================
  // Recommended wala section - jis section ke kisi item
  // ka title "Recommended" wala hai (ye item khud link nahi
  // hai, seo_url null hai - ye sirf label hai)
  // ============================================
  const recommendedSection = sections.find((s) =>
    s.items?.some((item) =>
      item.title?.toLowerCase().includes("recommended"),
    ),
  );
  const recommendedLabel =
    recommendedSection?.items?.find((item) => !item.seo_url)?.title ||
    "Recommended:";
  const recommendedItems = (recommendedSection?.items || []).filter(
    (item) => item.seo_url,
  );

  // ============================================
  // Baaki sections - plain occasion links ke columns
  // (banner aur recommended wale section chhod ke)
  // ============================================
  const categorySections = sections.filter(
    (s) => s !== bannerSection && s !== recommendedSection,
  );

  return (
    <div className="absolute top-full left-0 w-full bg-white border border-gray-200 shadow-xl z-50">
      {/* Main Dropdown Content */}
      <div className="w-full px-3 2xl:px-32 py-6 sm:py-10">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
          {/* Occasion columns */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10">
            {categorySections.map((section, index) => (
              <div
                key={index}
                className={
                  index !== 0
                    ? "border-t sm:border-t-0 lg:border-l border-gray-200 pt-4 sm:pt-0 lg:pt-0 lg:pl-10"
                    : ""
                }
              >
                <ul className="space-y-0">
                  {section.items?.map((item) => {
                    if (!item.seo_url) return null;

                    return (
                      <li key={item.id}>
                        <Link
                          href={`/${item.seo_url}`}
                          className="block text-[14px] py-1 text-gray-600 hover:text-[#98022e] hover:pl-1 transition-all duration-200 font-hind-madurai normal-case"
                        >
                          {item.title}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>

          {/* Banner image */}
          {bannerItem && (
            <Link
              href={`/${(bannerItem.seo_url || bannerItem.custom_url || "").replace(/^\//, "")}`}
              className="block w-full lg:w-[260px] flex-shrink-0"
            >
              <img
                src={`${process.env.NEXT_PUBLIC_PRODUCTION_IMAGE_URL || ""}${bannerItem.image}`}
                alt={bannerItem.alt || "Occasion banner"}
                className="w-full h-full max-h-[280px] lg:max-h-none object-cover"
              />
            </Link>
          )}
        </div>
      </div>

      {/* Recommended Bar */}
      {recommendedItems.length > 0 && (
        <div className="bg-[#98022e] w-full">
          <div className="w-full px-3 2xl:px-32 py-3 flex flex-wrap items-center gap-x-2 gap-y-1 font-hind-madurai">
            <span
              className="font-bold text-white mr-1 text-[16px] normal-case"
              dangerouslySetInnerHTML={{ __html: recommendedLabel }}
            />
            {recommendedItems.map((item, index) => (
              <React.Fragment key={item.id}>
                {index !== 0 && <span className="text-white">•</span>}
                <Link
                  href={`/${item.seo_url}`}
                  className="text-white normal-case text-[16px] hover:text-black transition-colors duration-200"
                >
                  {item.title}
                </Link>
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OcassionsDropDown;