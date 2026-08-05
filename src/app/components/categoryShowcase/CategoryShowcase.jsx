"use client";

import React, { useRef } from "react";
import { Hind_Madurai } from "next/font/google";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useGetTopCategories } from "@/app/api/hooks/category/useTopCategories";


// Loads the "Hind Madurai" font from Google Fonts.
// We apply this font's className further down on the outer wrapper div,
// so every bit of text inside this component uses it automatically.
const hindMadurai = Hind_Madurai({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
});

// 0. Image base URL - seedha env variable se (constants file use nahi karni)
const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_PRODUCTION_IMAGE_URL;

// ---------------------------------------------------------------
// 1. SINGLE CARD
// This is ONE square image + label. It gets reused for both the
// slider (desktop/tablet) and the grid (mobile) below.
// ---------------------------------------------------------------
const CategoryCard = ({ label, href, image }) => (
  <a href={href} className="flex flex-col items-center text-center group" title={label}>

    {/* Image box.
        - "border-2 border-transparent" = invisible border by default.
        - "active:border-black" = as soon as you click/tap and hold,
          a black border shows up around the WHOLE image.
          It stays until the browser actually navigates to the new page. */}
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

    {/* Label text under the image - plain black, uppercase */}
    <span className="mt-4 text-[15px] uppercase tracking-wide text-black">
      {label}
    </span>
  </a>
);

// ---------------------------------------------------------------
// 2. MAIN COMPONENT
// Shows a horizontal slider on desktop/tablet (md and up),
// and switches to a simple 2-column grid on mobile.
// Below that: a short description + "Explore All Products" button.
// ---------------------------------------------------------------
const CategoryShowcase = () => {
  // 2a. Live data ab API se aa raha hai — static CATEGORIES array hata diya.
  const { data, isLoading, isError } = useGetTopCategories();

  // 2b. Response ka pehla section hi card list hai (dusra section sirf
  //     description text hota hai "items" key mein string ke roop mein,
  //     usko humein use nahi karna kyunki design mein already static
  //     description paragraph hai neeche).
  const cardSection = Array.isArray(data?.sections)
    ? data.sections.find((section) => Array.isArray(section.items))
    : null;

  // 2c. Backend fields (title, custom_url, seo_url, image, alt) ko design ke
  //     existing card shape (label, href, image) mein map kar rahe hain.
  //     custom_url hamesha priority mein hai (agar mojood hai), warna
  //     seo_url se internal link bana rahe hain.
  const CATEGORIES = (cardSection?.items || []).map((item) => ({
    label: item.title,
    href: item.custom_url || (item.seo_url ? `/${item.seo_url}/` : "#"),
    image: `${IMAGE_BASE_URL}${item.image}`,
  }));

  // This "ref" lets us grab the actual slider DOM element,
  // so the arrow buttons below know what to scroll.
  const sliderRef = useRef(null);

  // Called when an arrow button is clicked.
  // direction = -1 means scroll left, +1 means scroll right.
  const scrollSliderByOneCard = (direction) => {
    if (!sliderRef.current) return;

    const CARD_WIDTH_PLUS_GAP = 254; // 234px card + 20px gap
    sliderRef.current.scrollBy({
      left: direction * CARD_WIDTH_PLUS_GAP,
      behavior: "smooth",
    });
  };

  return (
    <div className={`${hindMadurai.className} w-full px-3 2xl:px-32 py-6 lg:py-10`}>

      {/* ---------- DESKTOP / TABLET VIEW: horizontal slider ---------- */}
      <div className="hidden md:block relative">

        {/* The scrollable row of cards */}
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
            <p className="w-full text-center py-6 text-gray-400">No categories found.</p>
          ) : (
            CATEGORIES.map((category) => (
              <div key={category.label} className="w-[234px] shrink-0">
                <CategoryCard {...category} />
              </div>
            ))
          )}
        </div>

        {/* Left arrow button */}
        <button
          onClick={() => scrollSliderByOneCard(-1)}
          className="absolute -left-4 top-[45%] -translate-y-1/2 bg-white border border-gray-200 shadow-md rounded-full w-9 h-9 flex items-center justify-center hover:bg-black hover:text-white transition-colors hover:cursor-pointer"
        >
          <ChevronLeft size={18} />
        </button>

        {/* Right arrow button */}
        <button
          onClick={() => scrollSliderByOneCard(1)}
          className="absolute -right-4 top-[45%] -translate-y-1/2 bg-white border border-gray-200 shadow-md rounded-full w-9 h-9 flex items-center justify-center hover:bg-black hover:text-white transition-colors hover:cursor-pointer"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* ---------- MOBILE VIEW: simple 2-column grid ---------- */}
      <div className="grid grid-cols-2 gap-5 md:hidden">
        {isLoading ? (
          <p className="col-span-2 text-center py-6 text-gray-500">Loading...</p>
        ) : isError ? (
          <p className="col-span-2 text-center py-6 text-[#98022e]">
            Failed to load categories. Please try again.
          </p>
        ) : CATEGORIES.length === 0 ? (
          <p className="col-span-2 text-center py-6 text-gray-400">No categories found.</p>
        ) : (
          CATEGORIES.map((category) => (
            <CategoryCard key={category.label} {...category} />
          ))
        )}
      </div>

      {/* ---------- DESCRIPTION TEXT + BUTTON ---------- */}
      {/* Feel free to edit this paragraph to whatever copy you want. */}
      <div className="text-center mt-10 max-w-4xl mx-auto">
        <p className="text-gray-600 text-[15px] leading-relaxed">
          At DC Wine & Spirits, we bring you a premium collection of wine, champagne,
          gourmet baskets & sets. Each gift of our selection is designed to delight.
          Elegantly wrapped and carefully curated, our offerings turn gifting into a
          memorable experience, making personal and corporate gifting effortless.
        </p>

        <a
          href="/products/"
          className="inline-block mt-6 bg-black hover:bg-[#98022e] text-white text-sm uppercase tracking-wide px-8 py-4 transition-colors active:scale-95 hover:rounded-2xl"
        >
          Explore All Products
        </a>
      </div>

    </div>
  );
};

export default CategoryShowcase;