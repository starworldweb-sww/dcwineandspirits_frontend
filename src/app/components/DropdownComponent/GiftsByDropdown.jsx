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

// ============================================
// WIDTH CONTROLS — yahan se left menu aur right
// submenus ki width alag-alag control karo
// ============================================
const MAIN_MENU_WIDTH = "w-[200px] max-w-[90vw]"; // Left wala GIFTS BY / ORIGIN / PRICE list
const CATEGORY_SUBMENU_WIDTH = "w-[92vw] sm:w-[600px] lg:w-[850px] xl:w-[1075px] max-w-[95vw]"; // Right wala "Shop by Category" panel
const ORIGIN_SUBMENU_WIDTH = "w-[92vw] sm:w-[600px] lg:w-[850px] xl:w-[1075px] max-w-[95vw]"; // Right wala "Gifts By Origin" panel
const PRICE_SUBMENU_WIDTH = "w-[300px] max-w-[95vw]"; // Right wala "Shop By Price" panel

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
    (s) => s.heading === "",
  );
  const categoryRecommendedLabel = categoryRecommendedSection?.items?.find(
    (item) => !item.seo_url,
  )?.title || "Recommended:";
  const categoryRecommendedItems = (
    categoryRecommendedSection?.items || []
  ).filter((item) => item.seo_url);

  // ============================================
  // STEP 3: "Gifts By Origin" ke 3 hisse nikal rahe hain
  // ============================================

  // 3a. "Gifts By Region" wala section - country flags ki list
  const originCountrySection = originAllSections.find(
    (s) => s.heading === "Gifts By Region",
  );
  const originCountries = originCountrySection?.items || [];

  // 3b. Brand logos wala section - heading null hai
  const originBrandSection = originAllSections.find((s) => !s.heading);
  const originBrands = originBrandSection?.items || [];

  // 3c. "Recommended" wala black bar - heading empty string hai
  const originRecommendedSection = originAllSections.find(
    (s) => s.heading === "",
  );
  const originRecommendedLabel = originRecommendedSection?.items?.find(
    (item) => !item.seo_url,
  )?.title || "Recommended:";
  const originRecommendedItems = (originRecommendedSection?.items || []).filter(
    (item) => item.seo_url,
  );

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
    <div className={`absolute top-full left-0 mt-0 ${MAIN_MENU_WIDTH} bg-white border border-gray-200 shadow-xl z-50`}>
      <ul className="flex flex-col divide-y divide-gray-100">
        {mainMenuItems.map((item) => {
          const isShopByCategory = item.title === "Shop by Category";
          const isGiftsByOrigin = item.title === "Gifts By Origin";
          const isShopByPrice = item.title === "Shop By Price"; // ⚠️ exact API title se match karwa lena
          const hasSubmenu =
            isShopByCategory || isGiftsByOrigin || isShopByPrice;
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
              <a className="w-full flex items-center justify-between px-2 py-4 text-left cursor-pointer group">
                <span className="text-[16px] font-bold uppercase tracking-wide text-black font-hind-madurai group-hover:text-[#d70b48] transition-colors">
                  {item.title}
                </span>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-3 h-3 text-black flex-shrink-0 group-hover:text-[#d70b48] transition-colors"
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
                <div className={`absolute top-0 left-full ${CATEGORY_SUBMENU_WIDTH} bg-white border border-gray-200 shadow-2xl z-50 max-h-[80vh] overflow-y-auto`}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr] gap-4 sm:gap-6 lg:gap-0 px-4 sm:px-6 py-4 sm:py-6 divide-y sm:divide-y-0 lg:divide-x divide-gray-200">
                    {categoryLinkColumns.map((section) => (
                      <div key={section.heading} className="pb-4 sm:pb-0 lg:first:pl-0 lg:pl-6">
                        <h3 className="text-[18px] font-bold uppercase text-black mb-3 pb-2 border-b-2 border-[#d70b48] inline-block font-sumana">
                          {section.heading}
                        </h3>

                        <ul className="space-y-0.5 mt-3">
                          {section.items.map((subItem) => (
                            <li key={subItem.id}>
                              <Link
                                href={`/${subItem.seo_url}`}
                                className="block py-0.5 text-[15px] text-gray-600 hover:text-[#d70b48] hover:pl-1 transition-all duration-200 font-hind-madurai normal-case"
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
                    <div className="bg-black w-full px-4 sm:px-8 py-3 sm:py-4">
                      <div className="w-full flex flex-wrap items-center gap-x-2 gap-y-1 font-hind-madurai">
                        <span
                          className="font-bold text-white mr-1 text-[16px] normal-case"
                          dangerouslySetInnerHTML={{ __html: categoryRecommendedLabel }}
                        />
                        {categoryRecommendedItems.map((recItem, index) => (
                          <React.Fragment key={recItem.id}>
                            {index !== 0 && (
                              <span className="text-white">•</span>
                            )}
                            <Link
                              href={`/${recItem.seo_url}`}
                              className="text-white normal-case text-[16px] hover:text-[#d70b48] transition-colors duration-200"
                            >
                              {recItem.title}
                            </Link>
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ============================================ */}
              {/* SUBMENU 2: Gifts By Origin (flags + logo grid) */}
              {/* ============================================ */}
              {isGiftsByOrigin && isOpen && (
                <div className={`absolute top-0 left-full ${ORIGIN_SUBMENU_WIDTH} bg-white border border-gray-200 shadow-2xl z-50 max-h-[80vh] overflow-y-auto`}>
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 lg:gap-8 px-4 sm:px-6 py-4 sm:py-6">
                    {/* Left side - country flags ki list */}
                    <div className="w-full sm:w-[220px] flex-shrink-0 sm:border-r border-gray-200 sm:pr-6 pb-4 sm:pb-0 border-b sm:border-b-0">
                      <h3 className="text-[18px] font-bold uppercase text-black mb-3 pb-2 border-b-2 border-[#d70b48] inline-block font-sumana">
                        {originCountrySection?.heading || "Gifts By Region"}
                      </h3>

                      <ul className="space-y-2 mt-3">
                        {originCountries.map((country) => (
                          <li key={country.id}>
                            <Link
                              href={`/${country.seo_url}`}
                              className="flex items-center gap-2 text-[15px] text-gray-600 hover:text-[#d70b48] hover:pl-1 transition-all duration-200 font-hind-madurai normal-case"
                            >
                              <span>{getCountryFlag(country.title)}</span>
                              <span>{country.title}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Right side - brand logos ka grid (3 columns) */}
                    <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-1">
                      {originBrands.map((brand) => (
                        <Link
                          key={brand.id}
                          href={`/${brand.seo_url}`}
                          className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition-colors h-[90px] px-3 w-[213px]"
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
                    <div className="bg-black w-full px-4 sm:px-8 py-3 sm:py-4">
                      <div className="w-full flex flex-wrap items-center gap-x-2 gap-y-1 font-hind-madurai">
                        <span
                          className="font-bold text-white mr-1 text-[16px] normal-case"
                          dangerouslySetInnerHTML={{ __html: originRecommendedLabel }}
                        />
                        {originRecommendedItems.map((recItem, index) => (
                          <React.Fragment key={recItem.id}>
                            {index !== 0 && (
                              <span className="text-white">•</span>
                            )}
                            <Link
                              href={`/${recItem.seo_url}`}
                              className="text-white normal-case text-[16px] hover:text-[#d70b48] transition-colors duration-200"
                            >
                              {recItem.title}
                            </Link>
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ============================================ */}
              {/* SUBMENU 3: Shop By Price (flat list, no columns) */}
              {/* ============================================ */}
              {isShopByPrice && isOpen && (
                <div className={`absolute top-0 left-full ${PRICE_SUBMENU_WIDTH} bg-white border border-gray-200 shadow-2xl z-50 max-h-[80vh] overflow-y-auto`}>
                  <div className="px-4 sm:px-6 py-4 sm:py-6">
                    {priceHeading && (
                      <h3 className="text-[18px] font-bold uppercase text-black mb-3 pb-2 border-b-2 border-[#d70b48] inline-block font-sumana">
                        {priceHeading}
                      </h3>
                    )}

                    <ul className="space-y-0.5 mt-3">
                      {priceItems.map((priceItem) => (
                        <li key={priceItem.id}>
                          <Link
                            href={`/${priceItem.slug}`}
                            className="block py-0.5 text-[15px] text-gray-600 hover:text-[#d70b48] hover:pl-1 transition-all duration-200 font-hind-madurai normal-case"
                          >
                            <span
                              // name mein &amp; jaisa HTML entity aa raha hai, isliye decode karna padega
                              dangerouslySetInnerHTML={{
                                __html: priceItem.name,
                              }}
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