"use client";

import React from "react";
import Link from "next/link";
import { useShopByBrand } from "@/app/api/hooks/category/useShopByBrands";


const ShopByBrandDropDown = () => {
  // 1. API se brands ka data fetch kar rahe hain
  const { data } = useShopByBrand();

  // 2. Actual response structure: { heading, items: [{ id, name, image, slug }] }
  const heading = data?.heading || "";
  const brands = data?.items || [];

  return (
    // 3. Poora dropdown panel - nav ki poori width, seedha niche se shuru
    //    px-3 chhote screens ke liye, 2xl:px-32 bade screens pe (tera standard pattern)
    <div className="absolute top-full left-0 w-full bg-white border border-gray-200 shadow-xl z-50 px-3 2xl:px-32 py-6">

      {/* ================= BRANDS GRID (6 columns) ================= */}
      <div className="grid grid-cols-6 gap-3">
        {brands.map((brand) => (
          <Link
            key={brand.id}
            href={`/${brand.slug}`}
            className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition-colors"
            style={{ width: "190px", height: "79px" }}
          >
            {/* 4. Brand ka logo image - fixed size 190x79 ke andar fit kiya */}
            <img
              src={`${process.env.NEXT_PUBLIC_PRODUCTION_IMAGE_URL || ""}${brand.image}`}
              alt={brand.name}
              className="max-h-full max-w-[85%] object-contain"
            />
          </Link>
        ))}
      </div>

      {/* ================= "VIEW ALL" BUTTON ================= */}
      <div className="mt-4">
        <Link
          href="/brands/"
          className="inline-block bg-[#98022e] hover:bg-[#7e1a3c] text-white text-[13px] font-bold uppercase tracking-wide px-6 py-3 transition-colors hover:rounded-xl"
        >
          View All
        </Link>
      </div>
    </div>
  );
};

export default ShopByBrandDropDown;