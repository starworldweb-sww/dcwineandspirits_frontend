"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { Sumana } from "next/font/google";
import { useGetGiftByOccasion } from "../api/hooks/category/useGiftsByOccassion";
import { useLovebyBanner } from "../api/hooks/category/useLovebyBanner";


const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_PRODUCTION_IMAGE_URL;


const GiftsByOccasionHero = ({ data, bannersData, isLoading: propLoading, isError: propError }) => {
  const standalone = propLoading === undefined;
  const giftHookResult = useGetGiftByOccasion({ enabled: standalone });
  const bannerHookResult = useLovebyBanner({ enabled: standalone });

  const finalGiftData = data !== undefined ? data : giftHookResult.data;
  const finalBannersData = bannersData !== undefined ? bannersData : bannerHookResult.data;
  const isLoading = standalone ? (giftHookResult.isLoading || bannerHookResult.isLoading) : propLoading;
  const isError = standalone ? (giftHookResult.isError || bannerHookResult.isError) : propError;

  const occasionSection = Array.isArray(finalGiftData?.sections)
    ? finalGiftData.sections.find((section) => Array.isArray(section.items))
    : null;

  const occasions = (occasionSection?.items || []).map((item) => ({
    name: item.title,
    slug: item.seo_url,
    image: `${IMAGE_BASE_URL}${item.image}`,
    href: item.custom_url ? item.custom_url : `/${item.seo_url}/`,
  }));

  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateArrows = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(el.scrollLeft + el.offsetWidth < el.scrollWidth - 2);
  };

  useEffect(() => {
    updateArrows();
  }, [occasions.length]);

  const scroll = (direction) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({
      left: direction === "left" ? -el.offsetWidth : el.offsetWidth,
      behavior: "smooth",
    });
  };

  return (
    <>
      <div className="w-full px-3 2xl:px-32 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {finalBannersData?.sections?.flatMap(section =>
            section?.items?.map((item) => {
              const href =
                item.type === "custom"
                  ? item.custom_url
                  : `/${item.seo_url || item.id}`;

              return (
                <Link
                  key={item.id}
                  href={href}
                  className="block w-full"
                  target={item.type === "custom" ? "_blank" : undefined}
                >
                  <img
                    src={`${IMAGE_BASE_URL}${item.image}`}
                    alt={item.alt}
                    width={640}
                    height={220}
                    loading="lazy"
                    className="block w-full h-auto aspect-[640/220] object-cover"
                  />
                </Link>
              );
            })
          )}
        </div>
      </div>


      <div className={`w-full bg-white px-3 2xl:px-32 py-4 `}>

        <div className="text-center max-w-3xl mx-auto mb-8 md:mb-10">
          <h2 className="text-2xl md:text-[24px] font-bold uppercase tracking-widest text-black font-sumana">
            Gifts By Occasion
          </h2>
          <p className="mt-3 text-[16px] md:text-base text-gray-700 leading-relaxed font-hind-madurai">
            Celebrate every moment with thoughtfully curated wine gifts for every occasion.
            <br className="hidden md:block" />
            From birthdays to anniversaries, find the perfect bottle or basket to make it memorable.
          </p>
        </div>

        <div className="relative">

          {canScrollLeft && (
            <button
              onClick={() => scroll("left")}
              aria-label="Scroll left"
              className="md:hidden absolute left-2 top-[21vw] -translate-y-1/2 z-10
                         w-9 h-9 rounded-full bg-[#98022e] backdrop-blur-sm
                         flex items-center justify-center
                         text-white text-2xl leading-none
                         active:scale-90 transition-transform shadow-lg"
            >
              ‹
            </button>
          )}

          {canScrollRight && (
            <button
              onClick={() => scroll("right")}
              aria-label="Scroll right"
              className="md:hidden absolute right-2 top-[21vw] -translate-y-1/2 z-10
                         w-9 h-9 rounded-full bg-[#98022e] backdrop-blur-sm
                         flex items-center justify-center
                         text-white text-xl leading-none
                         active:scale-90 transition-transform shadow-lg flex items-center justify-center"
            >
              ›
            </button>
          )}

          <div
            ref={scrollRef}
            onScroll={updateArrows}
            className="flex flex-nowrap items-start gap-4 overflow-x-auto overflow-y-hidden no-scrollbar scroll-smooth
                       md:grid md:grid-cols-3 lg:grid-cols-5 md:gap-6 md:overflow-visible"
          >
            {isLoading ? (
              <p className="w-full text-center py-6 text-gray-500">Loading...</p>
            ) : isError ? (
              <p className="w-full text-center py-6 text-[#98022e]">
                Failed to load occasions. Please try again.
              </p>
            ) : occasions.length === 0 ? (
              <p className="w-full text-center py-6 text-gray-400">No occasions found.</p>
            ) : (
              occasions.map((item) => (
                <Link
                  title={item.name}
                  key={item.slug}
                  href={item.href}
                  className="flex-shrink-0 w-[42vw] md:w-auto group"
                >
                  <div className="w-full aspect-square overflow-hidden rounded-md border border-gray-200 bg-gray-50">
                    <img
                      src={item.image}
                      alt={item.name}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <p className="mt-3 text-center text-[14px] md:text-[15px] text-black group-hover:text-[#c99000] transition-colors">
                    {item.name}
                  </p>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default GiftsByOccasionHero;
