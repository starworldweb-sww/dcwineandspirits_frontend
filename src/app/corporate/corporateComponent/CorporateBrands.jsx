"use client";

import { useRef } from "react";
import { useShopByBrandTitle } from "@/app/api/hooks/category/useHomeShopByBrand";
import Image from "next/image";
import Link from "next/link";

const MAROON = "#98022e";

const getImageUrl = (path = "") =>
  path.startsWith("http")
    ? path
    : `${process.env.NEXT_PUBLIC_PRODUCTION_IMAGE_URL}${path}`;

// mobile = 2 visible, sm = 3, lg = 5
const ITEM_WIDTH_CLASSES = "w-1/2 sm:w-1/3 lg:w-1/5";

const CorporateBrands = () => {
  const { data, isLoading, isError } = useShopByBrandTitle();
  const sliderRef = useRef(null);

  const root = [data, data?.data, data?.data?.data].find((item) =>
    Array.isArray(item?.sections),
  );

  const brands =
    root?.sections.find((section) => Array.isArray(section.items))?.items ?? [];

  if (isError || (!isLoading && brands.length === 0)) return null;

  const scroll = (direction) => {
    const el = sliderRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <section className="bg-white py-10 md:py-14 px-3 2xl:px-32 font-hind-madurai">
      {/* Heading + arrows */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="text-2xl md:text-[32px] font-bold  font-sarabun">
            Shop Corporate Gifts by Brand
          </h2>
          <div className="mt-3 h-[2px] w-16" style={{ backgroundColor: MAROON }} />
          
        </div>

      </div>

      {/* Slider */}
      <div
        ref={sliderRef}
        className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {isLoading &&
          Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className={`${ITEM_WIDTH_CLASSES} flex-none`}
            >
              <div className="h-[80px] md:h-[100px] rounded-md bg-[#eceff1] animate-pulse" />
            </div>
          ))}

        {brands.map((brand) => {
          const brandName = brand.title || brand.seo_url;

          return (
            <Link
              key={brand.id}
              href={brand.custom_url || `/${brand.seo_url}`}
              title={brandName}
              className={`group ${ITEM_WIDTH_CLASSES} flex-none snap-start px-3 md:px-4 no-underline`}
            >
              <div className="relative w-full h-[80px] md:h-[100px]">
                <Image
                  src={encodeURI(getImageUrl(brand.image))}
                  alt={brandName}
                  fill
                  sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 200px"
                  className="object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            </Link>
          );
        })}
      </div>

      {/* View all button */}
      <div className="flex justify-center mt-8 md:mt-10">
        <Link
          href="/brands"
          className="inline-flex items-center justify-center text-white px-8 py-3 font-semibold text-sm tracking-wide no-underline transition-colors"
          style={{ backgroundColor: MAROON }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#7a0225")
          }
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = MAROON)}
        >
          View All Brands
        </Link>
      </div>
    </section>
  );
};

export default CorporateBrands;