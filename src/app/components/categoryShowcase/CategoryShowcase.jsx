"use client";

import React, { useRef } from "react";
import { Hind_Madurai } from "next/font/google";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useGetTopCategories } from "@/app/api/hooks/category/useTopCategories";

const hindMadurai = Hind_Madurai({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
});

const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_PRODUCTION_IMAGE_URL;

const CategoryCard = ({ label, href, image }) => (
  <a
    href={href}
    className="flex flex-col items-center text-center group"
    title={label}
  >
    <div
      className="w-full aspect-square bg-[#eeeeee] overflow-hidden
                 border-2 border-transparent active:border-black transition-colors"
    >
      <img
        src={image}
        alt={label}
        width={232}
        height={232}
        loading="lazy"
        className="block w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
      />
    </div>

    <span className="mt-4 text-[15px] uppercase tracking-wide text-black">
      {label}
    </span>
  </a>
);

const CategoryShowcase = ({ data, isLoading: propLoading, isError: propError }) => {
  const hookResult = useGetTopCategories({ enabled: data === undefined && propLoading === undefined });
  const finalData = data !== undefined ? data : hookResult.data;
  const isLoading = propLoading !== undefined ? propLoading : hookResult.isLoading;
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

  const sliderRef = useRef(null);

  const scrollSliderByOneCard = (direction) => {
    if (!sliderRef.current) return;

    const CARD_WIDTH_PLUS_GAP = 254;
    sliderRef.current.scrollBy({
      left: direction * CARD_WIDTH_PLUS_GAP,
      behavior: "smooth",
    });
  };

  return (
    <div
      className={`${hindMadurai.className} w-full px-3 2xl:px-32 py-6 lg:py-10`}
    >
      <div className="hidden md:block relative">
        <div
          ref={sliderRef}
          className="flex gap-5 overflow-x-auto no-scrollbar scroll-smooth justify-between"
        >
          {isLoading ? (
            <p className="w-full text-center py-6 text-gray-500">Loading...</p>
          ) : isError ? (
            <p className="w-full text-center py-6 text-[#98022e]">
              Failed to load categories. Please try again.
            </p>
          ) : CATEGORIES.length === 0 ? (
            <p className="w-full text-center py-6 text-gray-400">
              No categories found.
            </p>
          ) : (
            CATEGORIES.map((category) => (
              <div key={category.label} className="w-[234px] shrink-0">
                <CategoryCard {...category} />
              </div>
            ))
          )}
        </div>

        <button
          onClick={() => scrollSliderByOneCard(-1)}
          className="absolute -left-2 top-[45%] -translate-y-1/2 bg-white border border-gray-200 shadow-md rounded-full w-9 h-9 flex items-center justify-center hover:bg-black hover:text-white transition-colors hover:cursor-pointer"
        >
          <ChevronLeft size={18} />
        </button>

        <button
          onClick={() => scrollSliderByOneCard(1)}
          className="absolute -right-2 top-[45%] -translate-y-1/2 bg-white border border-gray-200 shadow-md rounded-full w-9 h-9 flex items-center justify-center hover:bg-black hover:text-white transition-colors hover:cursor-pointer"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-5 md:hidden">
        {isLoading ? (
          <p className="col-span-2 text-center py-6 text-gray-500">
            Loading...
          </p>
        ) : isError ? (
          <p className="col-span-2 text-center py-6 text-[#98022e]">
            Failed to load categories. Please try again.
          </p>
        ) : CATEGORIES.length === 0 ? (
          <p className="col-span-2 text-center py-6 text-gray-400">
            No categories found.
          </p>
        ) : (
          CATEGORIES.map((category) => (
            <CategoryCard key={category.label} {...category} />
          ))
        )}
      </div>

      <div className="text-center mt-10 max-w-4xl mx-auto">
        <p className="text-gray-600 text-[15px] leading-relaxed">
          At DC Wine & Spirits, we bring you a premium collection of wine,
          champagne, gourmet baskets & sets. Each gift of our selection is
          designed to delight. Elegantly wrapped and carefully curated, our
          offerings turn gifting into a memorable experience, making personal
          and corporate gifting effortless.
        </p>

        <a
          href="/products/"
          className="inline-block mt-6 bg-black hover:bg-[#98022e] text-white text-sm uppercase tracking-wide px-8 py-4 transition-all active:scale-95 hover:rounded-2xl"
        >
          Explore All Products
        </a>
      </div>
    </div>
  );
};

export default CategoryShowcase;
