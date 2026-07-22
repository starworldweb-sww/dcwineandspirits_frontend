"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ProductsHeader from "../components/TittleAndBreadcrumb";

// ─────────────────────────────────────────────
// MOCK DATA (Replaces API Call)
// ─────────────────────────────────────────────
const mockBrands = [
  { manufacturer_id: 1, name: "Albert Bichot", slug: "albert-bichot", image: null },
  { manufacturer_id: 2, name: "Ancient Peaks", slug: "ancient-peaks", image: null },
  { manufacturer_id: 3, name: "Antinori", slug: "antinori", image: null },
  { manufacturer_id: 4, name: "Armand De Brignac", slug: "armand-de-brignac", image: null },
  { manufacturer_id: 5, name: "Arnaldo Rivera", slug: "arnaldo-rivera", image: null },
  { manufacturer_id: 6, name: "Austin Hope", slug: "austin-hope", image: null },
  { manufacturer_id: 7, name: "Bacardi", slug: "bacardi", image: null },
  { manufacturer_id: 8, name: "Beringer", slug: "beringer", image: null },
  { manufacturer_id: 9, name: "Chivas Regal", slug: "chivas-regal", image: null },
  { manufacturer_id: 10, name: "Dom Perignon", slug: "dom-perignon", image: null },
];

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
  const router = useRouter();

  function handleClick() {
    const url = brand.slug
      ? `/${brand.slug}`
      : `/products?manufacturer=${brand.manufacturer_id}`;
    router.push(url);
  }

  return (
    <div
      onClick={handleClick}
      className="flex flex-col items-center cursor-pointer group"
    >
      <div className="w-full h-[120px] bg-[#f4f4f4] rounded-sm flex items-center justify-center overflow-hidden transition-all duration-200 relative">
        {brand.image ? (
          <Image
            fill
            loading="lazy"
            src={brand.image}
            alt={brand.name}
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
          />
        ) : (
          <span className="text-[14px] font-serif text-[#555555] text-center px-2 group-hover:scale-105 transition-transform duration-300">
            {brand.name}
          </span>
        )}
      </div>
      <p className="mt-3 text-[14px] text-center text-[#333333] group-hover:text-[#901c3f] transition-colors">
        {brand.name}
      </p>
    </div>
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
  const brandsData = useMemo(() => {
    return groupBrandsByLetter(mockBrands);
  }, []);

  const alphabet = Object.keys(brandsData).sort();

  return (
    <main className="text-[#333333] select-none bg-white min-h-screen flex flex-col w-full">
      
      {/* 1. HEADER WIDGET: Placed outside max-width container to take 100% width */}
      <div className="w-full">
        <ProductsHeader categoryName="Brands"/>
      </div>

      {/* 2. PAGE CONTENT: Constrained width to match the rest of the layout */}
      <div className="w-full max-w-[1400px] mx-auto px-4 md:px-8 2xl:px-12 mt-6">
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
      </div>

    </main>
  );
};

export default BrandsClient;