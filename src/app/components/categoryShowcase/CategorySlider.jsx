"use client";

import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const CategorySlider = ({ categories, CategoryCard }) => {
  const sliderRef = useRef(null);

  const scrollSliderByOneCard = (direction) => {
    if (!sliderRef.current) return;

    const CARD_WIDTH_PLUS_GAP = 254; // 234px card + 20px gap
    sliderRef.current.scrollBy({
      left: direction * CARD_WIDTH_PLUS_GAP,
      behavior: "smooth",
    });
  };

  return (
    <div className="hidden md:block relative">
      {/* The scrollable row of cards */}
      <div
        ref={sliderRef}
        className="flex gap-5 overflow-x-auto no-scrollbar scroll-smooth justify-between"
      >
        {categories.map((category) => (
          <div key={category.label} className="w-[234px] shrink-0">
            <CategoryCard {...category} />
          </div>
        ))}
      </div>

      {/* Left arrow button */}
      <button
        onClick={() => scrollSliderByOneCard(-1)}
        className="absolute -left-4 top-[45%] -translate-y-1/2 bg-white border border-gray-200 shadow-md rounded-full w-9 h-9 flex items-center justify-center hover:bg-black hover:text-white transition-colors hover:cursor-pointer"
        aria-label="Scroll left"
      >
        <ChevronLeft size={18} />
      </button>

      {/* Right arrow button */}
      <button
        onClick={() => scrollSliderByOneCard(1)}
        className="absolute -right-4 top-[45%] -translate-y-1/2 bg-white border border-gray-200 shadow-md rounded-full w-9 h-9 flex items-center justify-center hover:bg-black hover:text-white transition-colors hover:cursor-pointer"
        aria-label="Scroll right"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
};

export default CategorySlider;