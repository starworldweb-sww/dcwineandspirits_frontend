"use client";

import React from "react";
import Image from "next/image";
import { useGetTopCategories } from "@/app/api/hooks/category/useTopCategories";

const MAROON = "#98022e";
const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_PRODUCTION_IMAGE_URL;

const CategoryTile = ({ label, href, image }) => (
  <a
    href={href}
    title={label}
    className="group relative block aspect-square overflow-hidden bg-[#eeeeee]"
  >
    <Image
      src={image}
      alt={label}
      fill
      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
      className="object-contain p-4 pb-14 transition-transform duration-500 group-hover:scale-105"
    />

    {/* Label bar */}
    <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-white/90 px-4 py-3 transition-colors duration-300 group-hover:bg-[#98022e]">
      <span className="text-[13px] md:text-[15px] font-semibold uppercase tracking-wide text-[#1c1f22] transition-colors duration-300 group-hover:text-white">
        {label}
      </span>
      <span
        aria-hidden="true"
        className="text-lg leading-none transition-all duration-300 group-hover:translate-x-1 group-hover:text-white text-[#98022e]"
       
      >
        →
      </span>
    </div>
  </a>
);

const CorporateCategories = ({
  data,
  isLoading: propLoading,
  isError: propError,
}) => {
  const hookResult = useGetTopCategories({
    enabled: data === undefined && propLoading === undefined,
  });
  const finalData = data !== undefined ? data : hookResult.data;
  const isLoading =
    propLoading !== undefined ? propLoading : hookResult.isLoading;
  const isError = propError !== undefined ? propError : hookResult.isError;

  const cardSection = Array.isArray(finalData?.sections)
    ? finalData.sections.find((section) => Array.isArray(section.items))
    : null;

  const CATEGORIES = (cardSection?.items || []).map((item) => ({
    label: item.title,
    href:
      item.type === "custom"
        ? item.custom_url || "#"
        : item.seo_url
          ? `/${item.seo_url}/`
          : "#",
    image: `${IMAGE_BASE_URL}${item.image}`,
  }));

  if (isError || (!isLoading && CATEGORIES.length === 0)) return null;

  return (
    <section className="w-full bg-white px-3 2xl:px-32 py-10 md:py-14 font-hind-madurai">
      {/* Heading */}
      <div className="mb-6 md:mb-8">
        <h2 className="text-2xl md:text-[32px] font-bold font-sarabun text-[#1c1f22]">
          Shop Corporate Gifts by Category
        </h2>
        <div className="mt-3 h-[2px] w-16" style={{ backgroundColor: MAROON }} />
      </div>

      {/* Equal grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square animate-pulse bg-[#eceff1]"
              />
            ))
          : CATEGORIES.map((category, index) => (
              <CategoryTile key={`${category.label}-${index}`} {...category} />
            ))}
      </div>
    </section>
  );
};

export default CorporateCategories;