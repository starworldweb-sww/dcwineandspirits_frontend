"use client";

import React from "react";
import Link from "next/link";
import { useGetWineGifts } from "@/app/api/hooks/category/useWineGifts";

export default function WineGiftsDropdown({ onClose }) {
  const { data: wineGiftsResponse, isLoading, isError } = useGetWineGifts();

  if (isLoading || isError) return null;

  const sections = wineGiftsResponse?.sections || [];

  const findSection = (keyword) =>
    sections.find(
      (s) =>
        s.heading && s.heading.toLowerCase().includes(keyword.toLowerCase()),
    );

  const columns = [
    [findSection("type")],
    [findSection("glasses"), findSection("gourmet")],
    [findSection("variet")],
    [findSection("bottle"), findSection("gifting")],
  ].map((col) => col.filter(Boolean));

  const recommendedSection = sections.find((s) => s.heading === "");
  const recommendedItems = (recommendedSection?.items || []).filter(
    (item) => item.seo_url || item.custom_url,
  );

  return (
    <div className="absolute top-full left-0 w-full bg-white border border-gray-200 shadow-xl z-50">
      {/* Main Dropdown Content */}
      <div className="w-full px-3 2xl:px-32 py-10">
        <div className="flex">
          {columns.map((col, colIdx) => {
            if (col.length === 0) return null;

            return (
              <div
                key={colIdx}
                className={`flex-1 ${
                  colIdx !== 0 ? "border-l border-gray-200 pl-10 ml-10" : ""
                }`}
              >
                {col.map((section, secIdx) => (
                  <div
                    key={section.heading}
                    className={secIdx !== 0 ? "mt-8" : ""}
                  >
                    <h3 className="text-[18px] mb-3 text-[#98022e] font-sumana font-semibold">
                      {section.heading}
                    </h3>

                    <ul className="space-y-2">
                      {section.items?.map((item) => {
                        const slug = item.seo_url || item.custom_url;
                        if (!slug) return null;

                        return (
                          <li key={item.id || slug}>
                            <Link
                              href={`/${slug.replace(/^\//, "")}`}
                              onClick={onClose}
                              className="block text-[14px] text-gray-600 hover:text-[#98022e] hover:pl-1 transition-all duration-200 font-hind-madurai normal-case"
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
            );
          })}
        </div>
      </div>

      {/* Recommended Bar */}
      {recommendedItems.length > 0 && (
        <div className="bg-[#98022e] w-full">
          <div className="w-full px-3 2xl:px-32 py-3 flex flex-wrap items-center gap-x-2 gap-y-1 font-hind-madurai">
            <span className="font-bold text-white mr-1 text-[16px] normal-case">
              Recommended:
            </span>
            {recommendedItems.map((item, index) => {
              const slug = item.seo_url || item.custom_url;
              if (!slug) return null;

              return (
                <React.Fragment key={item.id || slug}>
                  {index !== 0 && <span className="text-white">•</span>}
                  <Link
                    href={`/${slug.replace(/^\//, "")}`}
                    onClick={onClose}
                    className="text-white normal-case text-[16px] hover:underline transition-colors duration-200"
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