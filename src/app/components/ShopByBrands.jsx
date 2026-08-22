"use client"; // Hook use kar rahe hain isliye client component banana zaroori hai
import React from 'react';
import { useShopByBrandTitle } from '../api/hooks/category/useHomeShopByBrand';
import Link from 'next/link';

// Apna exact path zaroor check kar lena - jahan bhi ye hook file rakhi hai


export default function ShopByBrand({ data: propData, isLoading: propLoading, isError: propError }) {
  // 1. API hook call - conditional
  const hookResult = useShopByBrandTitle({ enabled: propData === undefined && propLoading === undefined });
  const data = propData !== undefined ? propData : hookResult.data;
  const isLoading = propLoading !== undefined ? propLoading : hookResult.isLoading;
  const isError = propError !== undefined ? propError : hookResult.isError;

  // Loading state (UI kharab na ho isliye simple text/spinner rakh sakte hain)
  if (isLoading) return <div className="w-full px-3 2xl:px-32 py-10 text-center text-gray-500">Loading Brands...</div>;
  if (isError) return null;

  // 2. Data extraction based on API JSON structure
  // Title pehle section me hai, aur items doosre section me hain
  const headingText = data?.sections?.[0]?.heading || "SHOP BY BRAND";
  const brands = data?.sections?.[1]?.items || [];

  return (
    <section className="w-full px-3 2xl:px-32 bg-white">
      
      {/* Heading Section */}
      <div className=" flex justify-between items-center border-t pt-2 border-gray-200 pb-2">
        <h2 
          className="uppercase tracking-wide font-sumana mb-8"
         
        >
          {/* API se aaya heading dynamically use kar liya */}
          <span className="text-2xl font-semibold md:text-2xl md:font-bold text-black">
            {headingText.toUpperCase()}
          </span>
        </h2>
      </div>

      {/* Grid Layout Container - 6 brands ek line mein (lg aur upar) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-4">
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
              <img
                src={`${process.env.NEXT_PUBLIC_PRODUCTION_IMAGE_URL || ''}${brand.image}`}
                alt={brand.title || slug}
                className="w-full h-full object-cover transition-opacity group-hover:opacity-90"
              />
            </Link>
          );
        })}
      </div>
      
    </section>
  );
}