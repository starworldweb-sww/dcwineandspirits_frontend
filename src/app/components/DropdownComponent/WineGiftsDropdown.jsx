"use client";

import React from "react";
import Link from "next/link";
import { useGetWineGifts } from "@/app/api/hooks/category/useWineGifts";

export default function WineGiftsDropdown() {
  const { data: wineGiftsResponse, isLoading, isError } = useGetWineGifts();

  if (isLoading || isError) return null;

  const sections = wineGiftsResponse?.data?.sections || [];

  // Helper to find sections by keyword
  const findSection = (keyword) =>
    sections.find(
      (s) => s.heading && s.heading.toLowerCase().includes(keyword.toLowerCase())
    );

  // Extract main sections
  const mainSections = [
    findSection("type"),
    findSection("glasses"),
    findSection("gourmet"),
    findSection("variet"),
    findSection("bottle"),
    findSection("gifting"),
  ].filter(Boolean);

  // Recommended section
  const recommendedSection = sections.find((s) => s.heading === "");
  const recommendedItems = (recommendedSection?.items || []).filter(
    (item) => item.seo_url || item.custom_url
  );

  return (
    <div className="w-full bg-white">
      {/* Main Dropdown Content - ShopByBrand ke exact padding */}
      <div className="w-full px-3 2xl:px-32">
        
        {/* Grid Layout - exact same as ShopByBrand */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-4 py-4">
          {mainSections.map((section, idx) => (
            <div key={idx} className="space-y-2">
              {/* Section Heading */}
              <h3 className="font-sumana text-xs font-bold uppercase tracking-wider text-black">
                {section.heading}
              </h3>

              {/* Section Items */}
              <ul className="space-y-1.5">
                {section.items?.slice(0, 6).map((item) => {
                  const slug = item.seo_url || item.custom_url;
                  if (!slug) return null;

                  return (
                    <li key={item.id || slug}>
                      <Link
                        href={`/${slug.replace(/^\//, "")}`}
                        className="text-xs text-gray-600 hover:text-[#98022e] transition-colors duration-200 block"
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
      </div>

      {/* Recommended Bar */}
      {recommendedItems.length > 0 && (
        <div className="bg-gray-50 border-t border-gray-200 w-full">
          <div className="w-full px-3 2xl:px-32 py-2 flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="font-sumana text-xs font-bold uppercase tracking-wider text-black">
              Recommended:
            </span>
            {recommendedItems.slice(0, 8).map((item, index) => {
              const slug = item.seo_url || item.custom_url;
              if (!slug) return null;

              return (
                <React.Fragment key={item.id || slug}>
                  {index !== 0 && (
                    <span className="text-gray-300 text-xs">•</span>
                  )}
                  <Link
                    href={`/${slug.replace(/^\//, "")}`}
                    className="text-xs text-gray-600 hover:text-[#98022e] transition-colors duration-200"
                  >
                    {item.title}
                  </Link>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}