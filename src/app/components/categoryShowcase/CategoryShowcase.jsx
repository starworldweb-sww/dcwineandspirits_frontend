"use client";

import React, { useRef } from "react";
import { Hind_Madurai } from "next/font/google";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Loads the "Hind Madurai" font from Google Fonts.
// We apply this font's className further down on the outer wrapper div,
// so every bit of text inside this component uses it automatically.
const hindMadurai = Hind_Madurai({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
});

// ---------------------------------------------------------------
// 1. CATEGORY DATA
// This is just a list of the cards we want to show.
// To add/remove/edit a category, just add/remove/edit an object here.
// "image" should point to a file inside your /public folder,
// e.g. /public/wine-gift.webp -> use "/wine-gift.webp" below.
// ---------------------------------------------------------------
const CATEGORIES = [
  {
    label: "Wine Gifts",
    href: "/wine-gifts",
    image: "/prosecco-gift-800x800.webp",
  },
  {
    label: "Champagne Gifts",
    href: "/champagne-gifts",
    image: "/prosecco-gift-800x800.webp",
  },
  {
    label: "Prosecco Gifts",
    href: "/prosecco-gifts",
    image: "/prosecco-gift-800x800.webp",
  },
  {
    label: "Cheese Baskets",
    href: "/cheese-baskets",
    image: "/cheese-basket.webp",
  },
  {
    label: "Chocolate Gifts",
    href: "/chocolate-gifts",
    image: "/chocolate-gift.webp",
  },
];

// ---------------------------------------------------------------
// 2. SINGLE CARD
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
// 3. MAIN COMPONENT
// Shows a horizontal slider on desktop/tablet (md and up),
// and switches to a simple 2-column grid on mobile.
// Below that: a short description + "Explore All Products" button.
// ---------------------------------------------------------------
const CategoryShowcase = () => {
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
    <div className={`${hindMadurai.className} w-full px-3 2xl:px-32 py-10`}>

      {/* ---------- DESKTOP / TABLET VIEW: horizontal slider ---------- */}
      <div className="hidden md:block relative">

        {/* The scrollable row of cards */}
        <div
          ref={sliderRef}
          className="flex gap-5 overflow-x-auto no-scrollbar scroll-smooth justify-between"
        >
          {CATEGORIES.map((category) => (
            <div key={category.label} className="w-[234px] shrink-0">
              <CategoryCard {...category} />
            </div>
          ))}
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
        {CATEGORIES.map((category) => (
          <CategoryCard key={category.label} {...category} />
        ))}
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
          href="/all-products"
          className="inline-block mt-6 bg-black hover:bg-[#98022e] text-white text-sm uppercase tracking-wide px-8 py-4 transition-colors active:scale-95 hover:rounded-2xl"
        >
          Explore All Products
        </a>
      </div>

    </div>
  );
};

export default CategoryShowcase;