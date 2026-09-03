"use client"; // Hook use kar rahe hain isliye client component banana zaroori hai
import React, { useRef } from 'react';
import Image from "next/image";
import { useShopByBrandTitle } from '../api/hooks/category/useHomeShopByBrand';
import Link from 'next/link';

// Apna exact path zaroor check kar lena - jahan bhi ye hook file rakhi hai

export default function ShopByBrand({ data: propData, isLoading: propLoading, isError: propError }) {
  // 1. API hook call - conditional
  const hookResult = useShopByBrandTitle({ enabled: propData === undefined && propLoading === undefined });
  const data = propData !== undefined ? propData : hookResult.data;
  const isLoading = propLoading !== undefined ? propLoading : hookResult.isLoading;
  const isError = propError !== undefined ? propError : hookResult.isError;

  // Mobile horizontal scroll ke liye ref (snap scroll)
  const scrollRef = useRef(null);

  // Loading state (UI kharab na ho isliye simple text/spinner rakh sakte hain)
  if (isLoading) return <div className="w-full px-3 2xl:px-32 py-10 text-center text-gray-500">Loading Brands...</div>;
  if (isError) return null;

  // 2. Data extraction based on API JSON structure
  // Title pehle section me hai, aur items doosre section me hain
  const headingText = data?.sections?.[0]?.heading || "SHOP BY BRAND";
  const brands = data?.sections?.[1]?.items || [];

  return (
    <section className="w-full px-3 2xl:px-32 bg-white">

      {/* Heading Section - mobile pe gold accent underline added for brand feel */}
      <div className="flex justify-between items-center border-t pt-3 border-gray-200 pb-3 lg:pt-2 lg:pb-2">
        <h2 className="uppercase tracking-wide font-sumana mb-0 lg:mb-8 relative">
          {/* API se aaya heading dynamically use kar liya */}
          <span className="text-xl font-semibold md:text-2xl md:font-bold text-black">
            {headingText.toUpperCase()}
          </span>
          {/* Mobile-only gold accent line under heading */}
          <span className="block lg:hidden w-10 h-[3px] bg-[#c99000] mt-2 rounded-full" />
        </h2>
      </div>

      {/* MOBILE (below sm): horizontal snap-scroll carousel - avoids cramped 2-col squeeze */}
      <div
        ref={scrollRef}
        className="sm:hidden flex gap-3 overflow-x-auto pb-4 -mx-3 px-3 snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {brands.map((brand) => {
          const slug = brand.seo_url || brand.custom_url;
          if (!slug) return null;

          return (
            <Link
              key={brand.id}
              href={`/${slug}`}
              className="group relative block shrink-0 w-[42vw] max-w-[220px] overflow-hidden rounded-lg border border-gray-200 shadow-sm active:scale-[0.97] active:shadow-md transition-all snap-start"
              style={{ aspectRatio: '310 / 160' }}
            >
              <Image
                src={`${process.env.NEXT_PUBLIC_PRODUCTION_IMAGE_URL || ''}${brand.image}`}
                alt={brand.title || slug}
                fill
                sizes="50vw"
                className="object-cover"
              />
              {/* Subtle maroon gradient on tap for brand consistency */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#98022e]/0 to-transparent group-active:from-[#98022e]/20 transition-colors" />
            </Link>
          );
        })}
      </div>

      {/* TABLET & DESKTOP (sm and up): original grid layout, unchanged */}
      <div className="hidden sm:grid sm:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-4">
        {brands.map((brand) => {
          // 3. Slug preference: seo_url pehle, agar empty hai toh custom_url use karo
          const slug = brand.seo_url || brand.custom_url;

          // 4. Agar dono hi empty hain toh is brand ko skip kar do (galat link na bane)
          if (!slug) return null;

          return (
            <Link
              key={brand.id}
              // 5. Fallback slug ke basis par link bana diya
              href={`/${slug}`}
              className="group relative block w-full overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-lg"
              style={{ aspectRatio: '310 / 160' }}
            >
              <Image
                src={`${process.env.NEXT_PUBLIC_PRODUCTION_IMAGE_URL || ''}${brand.image}`}
                alt={brand.title || slug}
                fill
                sizes="(max-width: 1024px) 33vw, 20vw"
                className="object-cover transition-opacity group-hover:opacity-90"
              />
            </Link>
          );
        })}
      </div>

    </section>
  );
}