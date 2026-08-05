"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useGiftDropDown } from "@/app/api/hooks/category/useGiftDropDown";
import { useGiftDropDownShopByCategory } from "@/app/api/hooks/category/useGiftDropDownShopByCategory";
import { useGiftDropDownGiftByOrigin } from "@/app/api/hooks/category/useGiftDropDownGiftsByOrigin";
import { useGiftDropDownShopByPrice } from "@/app/api/hooks/category/useGiftsDropDownShopByPrice";


// Apna exact path zaroor check kar lena - "Gifts" vs "Gift" spelling match kar lena file names mein

// 1. Left side ke 3 tabs - har tab ka apna naam aur uska "key" hai
const TABS = [
  { key: "category", label: "Shop By Category" },
  { key: "origin", label: "Gifts By Origin" },
  { key: "price", label: "Shop By Price" },
];

const GiftsByDropDown = () => {
  // 2. Track karte hain konsa left-tab abhi active/selected hai
  const [activeTab, setActiveTab] = useState("category");

  // 3. Saari 4 APIs ka data fetch kar rahe hain
  const { data: mainData } = useGiftDropDown();
  const { data: categoryData } = useGiftDropDownShopByCategory();
  const { data: originData } = useGiftDropDownGiftByOrigin();
  const { data: priceData } = useGiftDropDownShopByPrice();

  // 4. Active tab ke hisaab se sahi API ka data chuna
  const TAB_DATA = {
    category: categoryData,
    origin: originData,
    price: priceData,
  };

  const activeData = TAB_DATA[activeTab];

  // 5. Category/Origin ka structure: { sections: [{ heading, items: [{ title, seo_url, custom_url }] }] }
  const columns = activeData?.sections || [];

  // 6. Price ka alag structure: { heading, items: [{ name, slug }] } - single list hai, columns nahi
  const isPriceTab = activeTab === "price";
  const priceHeading = activeData?.heading || "";
  const priceItems = activeData?.items || [];

  // 7. "Recommended" bar ke liye items nikal rahe hain (main API se)
  const recommendedItems = mainData?.sections?.[0]?.items || [];

  return (
    // 8. Poora dropdown panel
    <div className="absolute top-full left-0 flex bg-white border border-gray-200 shadow-xl z-50 w-[900px]">

      {/* ================= LEFT SIDEBAR (3 tabs + image) ================= */}
      <div className="w-56 border-r border-gray-200">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;

          return (
            <button
              key={tab.key}
              onMouseEnter={() => setActiveTab(tab.key)}
              className={`w-full flex items-center justify-between px-5 py-4 text-left text-[14px] font-bold uppercase tracking-wide transition-colors ${
                isActive
                  ? "text-[#98022e] bg-gray-50"
                  : "text-black hover:text-[#98022e]"
              }`}
            >
              {tab.label}
              <ChevronRight size={14} />
            </button>
          );
        })}

        {/* 9. Sidebar ke neeche image */}
     
      </div>

      {/* ================= RIGHT SIDE ================= */}
      <div className="flex-1 p-6">
        {isPriceTab ? (
          // 10. PRICE TAB - alag structure hai, ek hi heading + list (columns nahi)
          <>
            {priceHeading && (
              <h4 className="text-[15px] font-bold uppercase text-black mb-3">
                {priceHeading}
              </h4>
            )}
            <ul className="grid grid-cols-2 gap-x-8 gap-y-2">
              {priceItems.map((item) => (
                <li key={item.id}>
                  <Link
                    href={`/${item.slug}`}
                    className="text-[13px] text-gray-700 hover:text-[#98022e] transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </>
        ) : (
          // 11. CATEGORY/ORIGIN TAB - multiple columns wala structure
          <div className="grid grid-cols-3 gap-8">
            {columns.map((column) => (
              <div key={column.heading}>
                <h4 className="text-[15px] font-bold uppercase text-black mb-3">
                  {column.heading}
                </h4>
                <ul className="space-y-2">
                  {(column.items || []).map((item) => {
                    // 12. Slug preference: seo_url pehle, agar empty hai toh custom_url
                    const slug = item.seo_url || item.custom_url;

                    return (
                      <li key={item.id}>
                        <Link
                          href={`/${slug}`}
                          className="text-[13px] text-gray-700 hover:text-[#98022e] transition-colors"
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
        )}

        {/* ================= BOTTOM "RECOMMENDED" BAR ================= */}
        {recommendedItems.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-200 flex items-center flex-wrap gap-x-2 gap-y-1 text-[13px]">
            <span className="font-bold text-black">Recommended:</span>
            {recommendedItems.map((item, index) => {
              const slug = item.seo_url || item.custom_url;

              return (
                <React.Fragment key={item.id}>
                  <Link
                    href={`/${slug}`}
                    className="text-gray-700 hover:text-[#98022e] transition-colors"
                  >
                    {item.title}
                  </Link>
                  {index < recommendedItems.length - 1 && (
                    <span className="text-gray-400">•</span>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default GiftsByDropDown;