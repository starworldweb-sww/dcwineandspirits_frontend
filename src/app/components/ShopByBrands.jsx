"use client"; // Hook use kar rahe hain isliye client component banana zaroori hai
import React from 'react';
import { useHomeBrands } from '../api/hooks/category/useHomeBrands';
// Apna path zaroor check kar lena


export default function ShopByBrand() {
  // 1. API hook call
  const { data, isLoading, isError } = useHomeBrands();

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
      <div className="mb-8 flex justify-between items-center border-t pt-2 border-gray-200 pb-2">
        <h2 
          className="uppercase tracking-wide"
          style={{ 
            fontFamily: "'Hind Madurai', sans-serif",
            color: "rgb(152, 2, 46)",
            fontWeight: 400
          }}
        >
          {/* API se aaya heading dynamically use kar liya */}
          <span className="text-2xl font-semibold md:text-2xl md:font-bold text-black">
            {headingText.toUpperCase()}
          </span>
        </h2>
      </div>

      {/* Grid Layout Container */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
        {brands.map((brand) => (
          <a
            key={brand.id}
            // SEO URL ke basis par link bana diya
            href={`/brand/${brand.seo_url}`} 
            className="group relative block w-full overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-lg"
            style={{ aspectRatio: '310 / 160' }} 
          >
            {/* 
              Placeholder div hata kar actual <img> tag laga diya, 
              environment variable wala image URL use karke!
            */}
            <img 
              src={`${process.env.NEXT_PUBLIC_PRODUCTION_IMAGE_URL || ''}${brand.image}`}
              alt={brand.title || brand.seo_url} 
              className="w-full h-full object-cover transition-opacity group-hover:opacity-90"
            />
          </a>
        ))}
      </div>
      
    </section>
  );
}