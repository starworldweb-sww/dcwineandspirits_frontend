"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useGiftDropDown } from "@/app/api/hooks/category/useGiftDropDown";
import { useGiftsShopyByCategory } from "@/app/api/hooks/category/useGiftsShopByCategory";
import { useGiftDropDownGiftByOrigin } from "@/app/api/hooks/category/useGiftDropDownGiftsByOrigin";
import { useGiftDropDownShopByPrice } from "@/app/api/hooks/category/useGiftsDropDownShopByPrice";


// Apna exact hook path check kar lena

// ============================================
// Country ka naam dekh ke uska flag emoji dena
// (Simple keyword match - naam mein country dhundh rahe hain)
// ============================================
const getCountryFlag = (title = "") => {
  const lowerTitle = title.toLowerCase();

  if (lowerTitle.includes("australian")) return "🇦🇺";
  if (lowerTitle.includes("french")) return "🇫🇷";
  if (lowerTitle.includes("italian")) return "🇮🇹";
  if (lowerTitle.includes("napa") || lowerTitle.includes("paso")) return "🇺🇸";
  if (lowerTitle.includes("portuguese")) return "🇵🇹";
  if (lowerTitle.includes("spanish")) return "🇪🇸";
  if (lowerTitle.includes("israel")) return "🇮🇱";

  return "🍷"; // koi match nahi mila to default icon
};

const GiftsByDropdown = () => {
  // ============================================
  // STEP 1: Chaaro APIs se data mangwa rahe hain
  // ============================================

  // "GIFTS BY" ke andar wale items: Shop by Category, Gifts By Origin, Shop By Price
  const { data: mainMenuData, isLoading } = useGiftDropDown();
  const mainMenuItems = Array.isArray(mainMenuData) ? mainMenuData : [];

  // "Shop by Category" ka submenu data
  const { data: categoryData } = useGiftsShopyByCategory();
  const categoryAllSections = categoryData?.sections || [];

  // "Gifts By Origin" ka submenu data
  const { data: originData } = useGiftDropDownGiftByOrigin();
  const originAllSections = originData?.sections || [];

  // "Shop By Price" ka submenu data — yeh flat list hai (heading + items), sections nahi
  const { data: priceData } = useGiftDropDownShopByPrice();
  const priceHeading = priceData?.heading || "";
  const priceItems = priceData?.items || [];

  // ============================================
  // STEP 2: "Shop by Category" ke 3 hisse nikal rahe hain
  // ============================================

  const categoryLinkColumns = categoryAllSections.filter((s) => s.heading);
  const categoryRecommendedSection = categoryAllSections.find(
    (s) => s.heading === ""
  );
  const categoryRecommendedItems = (
    categoryRecommendedSection?.items || []
  ).filter((item) => item.seo_url);

  // ============================================
  // STEP 3: "Gifts By Origin" ke 3 hisse nikal rahe hain
  // ============================================

  // 3a. "Gifts By Region" wala section - country flags ki list
  const originCountrySection = originAllSections.find(
    (s) => s.heading === "Gifts By Region"
  );
  const originCountries = originCountrySection?.items || [];

  // 3b. Brand logos wala section - heading null hai
  const originBrandSection = originAllSections.find((s) => !s.heading);
  const originBrands = originBrandSection?.items || [];

  // 3c. "Recommended" wala black bar - heading empty string hai
  const originRecommendedSection = originAllSections.find(
    (s) => s.heading === ""
  );
  const originRecommendedItems = (
    originRecommendedSection?.items || []
  ).filter((item) => item.seo_url);

  // ============================================
  // STEP 4: Track karna hai konsa item hover ho raha hai
  // ============================================

  // Value hogi: null, "Shop by Category", "Gifts By Origin", ya "Shop By Price"
  const [openSubmenu, setOpenSubmenu] = useState(null);

  if (isLoading) return null;

  // ============================================
  // STEP 5: UI render karna
  // ============================================

  return (
    <div className="absolute top-full left-0 mt-0 w-64 bg-white border border-gray-200 shadow-xl z-50">
      <ul className="flex flex-col divide-y divide-gray-100">
        {mainMenuItems.map((item) => {
          const isShopByCategory = item.title === "Shop by Category";
          const isGiftsByOrigin = item.title === "Gifts By Origin";
          const isShopByPrice = item.title === "Shop By Price"; // ⚠️ exact API title se match karwa lena
          const hasSubmenu = isShopByCategory || isGiftsByOrigin || isShopByPrice;
          const isOpen = openSubmenu === item.title;

          return (
            <li
              key={item.title}
              className="relative"
              onMouseEnter={() => {
                if (hasSubmenu) setOpenSubmenu(item.title);
              }}
              onMouseLeave={() => {
                if (hasSubmenu) setOpenSubmenu(null);
              }}
            >
              <a className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer group">
                <span className="text-[14px] font-bold uppercase tracking-wide text-black font-hind-madurai group-hover:text-[#98022e] transition-colors group-hover:scale-105">
                  {item.title}
                </span>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-3 h-3 text-black flex-shrink-0 group-hover:text-[#98022e] transition-colors"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.22 3.97a.75.75 0 0 1 1.06 0l6.75 6.75a.75.75 0 0 1 0 1.06l-6.75 6.75a.75.75 0 0 1-1.06-1.06L14.44 12 8.22 5.03a.75.75 0 0 1 0-1.06Z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>

              {/* ============================================ */}
              {/* SUBMENU 1: Shop by Category (3 columns wala) */}
              {/* ============================================ */}
              {isShopByCategory && isOpen && (
                <div className="absolute top-0 left-full w-[600px] bg-white border border-gray-200 shadow-xl z-50">
                  <div className="grid grid-cols-3 gap-6 px-6 py-6">
                    {categoryLinkColumns.map((section) => (
                      <div key={section.heading}>
                        <h3 className="text-[13px] font-bold uppercase text-black mb-3 font-sumana">
                          {section.heading}
                        </h3>

                        <ul className="space-y-2">
                          {section.items.map((subItem) => (
                            <li key={subItem.id}>
                              <Link
                                href={`/${subItem.seo_url}`}
                                className="text-[14px] text-gray-700 hover:text-[#98022e] transition-colors font-hind-madurai normal-case"
                              >
                                <span>{subItem.title}</span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  {categoryRecommendedItems.length > 0 && (
                    <div className="bg-black px-6 py-3 flex items-center flex-wrap gap-x-2 gap-y-1 normal-case">
                      <span className="font-bold text-white text-[13px] font-hind-madurai">
                        Recommended:
                      </span>
                      {categoryRecommendedItems.map((recItem, index) => (
                        <React.Fragment key={recItem.id}>
                          <Link
                            href={`/${recItem.seo_url}`}
                            className="text-white hover:text-gray-300 transition-colors text-[13px] font-hind-madurai"
                          >
                            {recItem.title}
                          </Link>
                          {index < categoryRecommendedItems.length - 1 && (
                            <span className="text-gray-500">•</span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ============================================ */}
              {/* SUBMENU 2: Gifts By Origin (flags + logo grid) */}
              {/* ============================================ */}
              {isGiftsByOrigin && isOpen && (
                <div className="absolute top-0 left-full w-[800px] bg-white border border-gray-200 shadow-xl z-50">
                  <div className="flex gap-8 px-6 py-6">
                    {/* Left side - country flags ki list */}
                    <div className="w-[220px] flex-shrink-0">
                      <h3 className="text-[13px] font-bold uppercase text-black mb-3 font-sumana">
                        Gifts By Region
                      </h3>

                      <ul className="space-y-3">
                        {originCountries.map((country) => (
                          <li key={country.id}>
                            <Link
                              href={`/${country.seo_url}`}
                              className="flex items-center gap-2 text-[14px] text-gray-700 hover:text-[#98022e] transition-colors font-hind-madurai normal-case"
                            >
                              <span>{getCountryFlag(country.title)}</span>
                              <span>{country.title}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Right side - brand logos ka grid (3 columns) */}
                    <div className="flex-1 grid grid-cols-3 gap-4">
                      {originBrands.map((brand) => (
                        <Link
                          key={brand.id}
                          href={`/${brand.seo_url}`}
                          className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition-colors h-[90px] px-3"
                        >
                          <img
                            src={`${process.env.NEXT_PUBLIC_PRODUCTION_IMAGE_URL || ""}${brand.image}`}
                            alt={brand.title}
                            className="max-h-full max-w-full object-contain"
                          />
                        </Link>
                      ))}
                    </div>
                  </div>

                  {originRecommendedItems.length > 0 && (
                    <div className="bg-black px-6 py-3 flex items-center flex-wrap gap-x-2 gap-y-1 normal-case">
                      <span className="font-bold text-white text-[13px] font-hind-madurai">
                        Recommended:
                      </span>
                      {originRecommendedItems.map((recItem, index) => (
                        <React.Fragment key={recItem.id}>
                          <Link
                            href={`/${recItem.seo_url}`}
                            className="text-white hover:text-gray-300 transition-colors text-[13px] font-hind-madurai"
                          >
                            {recItem.title}
                          </Link>
                          {index < originRecommendedItems.length - 1 && (
                            <span className="text-gray-500">•</span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ============================================ */}
              {/* SUBMENU 3: Shop By Price (flat list, no columns) */}
              {/* ============================================ */}
              {isShopByPrice && isOpen && (
                <div className="absolute top-0 left-full w-[280px] bg-white border border-gray-200 shadow-xl z-50">
                  <div className="px-6 py-6">
                    {priceHeading && (
                      <h3 className="text-[13px] font-bold uppercase text-black mb-3 font-sumana">
                        {priceHeading}
                      </h3>
                    )}

                    <ul className="space-y-2">
                      {priceItems.map((priceItem) => (
                        <li key={priceItem.id}>
                          <Link
                            href={`/${priceItem.slug}`}
                            className="text-[14px] text-gray-700 hover:text-[#98022e] transition-colors font-hind-madurai normal-case"
                          >
                            <span
                              // name mein &amp; jaisa HTML entity aa raha hai, isliye decode karna padega
                              dangerouslySetInnerHTML={{ __html: priceItem.name }}
                            />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default GiftsByDropdown;