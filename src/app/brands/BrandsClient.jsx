"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import Link from "next/link"; // 1. useRouter ki jagah Link import kiya
import ProductsHeader from "../components/TittleAndBreadcrumb";
import { useGetAllManufacturers } from "../api/hooks/useAllManufacturers";
import { decodeHtml } from "@/libs/decodeHtml";

// ─────────────────────────────────────────────
// Helper: Group brands alphabetically
// ─────────────────────────────────────────────
function groupBrandsByLetter(brands) {
  const grouped = {};
  brands.forEach((brand) => {
    if (!brand?.name) return;
    const firstLetter = brand.name.charAt(0).toUpperCase();
    if (!grouped[firstLetter]) {
      grouped[firstLetter] = [];
    }
    grouped[firstLetter].push(brand);
  });
  return grouped;
}

// ─────────────────────────────────────────────
// Sub-Component: Brand Index
// ─────────────────────────────────────────────
function BrandIndex({ alphabet }) {
  return (
    <section className="flex flex-wrap gap-x-4 gap-y-2 items-center mb-10 mt-6">
      <span className="font-bold text-[15px] text-[#333333]">Brand Index:</span>
      {alphabet.map((letter) => (
        <a 
          key={letter}
          href={`#brand-${letter}`}
          className="text-[15px] text-[#333333] hover:text-[#901c3f] transition-colors"
        >
          {letter}
        </a>
      ))}
    </section>
  );
}

// ─────────────────────────────────────────────
// Sub-Component: Single Brand Card
// ─────────────────────────────────────────────
function BrandCard({ brand }) {
  // 2. router.push wala function aur useRouter hata diya, ab Link use karenge

  const href = brand.slug
    ? `/${brand.slug}/`
    : `/products?manufacturer=${brand.manufacturer_id}`;

  const imageSrc = brand.image
    ? brand.image.startsWith("http")
      ? brand.image
      : `${process.env.NEXT_PUBLIC_PRODUCTION_IMAGE_URL || ""}${brand.image}`
    : null;

  return (
    // 3. Poora card ab Link ke andar wrap hai, onClick ki zaroorat nahi
    <Link href={href} className="flex flex-col items-center cursor-pointer group">
      <div className="w-full h-[120px] bg-[#f4f4f4] rounded-sm flex items-center justify-center overflow-hidden transition-all duration-200 relative">
        {imageSrc ? (
          <Image
            fill
            loading="lazy"
            src={imageSrc}
            alt={brand.name}
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
          />
        ) : (
          <span className="text-[14px] font-hind-madurai text-[#555555] text-center px-2 group-hover:scale-105 transition-transform duration-300">
            {decodeHtml(brand.name)}
          </span>
        )}
      </div>
      <p className="mt-3 text-[14px] text-center text-[#333333] group-hover:text-[#901c3f] transition-colors">
        {brand.name}
      </p>
    </Link>
  );
}

// ─────────────────────────────────────────────
// Sub-Component: Brand Group (one letter section)
// ─────────────────────────────────────────────
function BrandGroup({ letter, brands }) {
  return (
    <div id={`brand-${letter}`} className="scroll-mt-10 mb-12">
      <div className="mb-6">
        <h2 className="text-[20px] font-bold text-[#333333] leading-none mb-2">
          {letter}
        </h2>
        <div className="w-8 h-[2px] bg-[#901c3f]" /> {/* Wine color underline */}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {brands.map((brand, index) => (
          <BrandCard key={`${letter}-${index}`} brand={brand} />
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Main Component: BrandsPage
// ─────────────────────────────────────────────
const BrandsClient = () => {
  const { data, isLoading, isError } = useGetAllManufacturers();

  const brands = data || [];

  const brandsData = useMemo(() => {
    return groupBrandsByLetter(brands);
  }, [brands]);

  const alphabet = Object.keys(brandsData).sort();

  return (
    <main className="text-[#333333] select-none bg-white min-h-screen flex flex-col w-full">
      
      {/* 1. HEADER WIDGET: Placed outside max-width container to take 100% width */}
      <div className="w-full">
        <ProductsHeader categoryName="Brands"/>
      </div>

      {/* 2. PAGE CONTENT: Constrained width to match the rest of the layout */}
      <div className="w-full max-w-[1400px] mx-auto px-4 md:px-8 2xl:px-12 mt-6">
        {isLoading && (
          <p className="text-[14px] text-[#555555]">Loading brands...</p>
        )}

        {isError && (
          <p className="text-[14px] text-[#555555]">
            Something went wrong while loading brands.
          </p>
        )}

        {!isLoading && !isError && (
          <>
            <BrandIndex alphabet={alphabet} />

            <section className="space-y-4">
              {alphabet.map((letter) => (
                <BrandGroup
                  key={letter}
                  letter={letter}
                  brands={brandsData[letter]}
                />
              ))}
            </section>
          </>
        )}
      </div>

    </main>
  );
};

export default BrandsClient;