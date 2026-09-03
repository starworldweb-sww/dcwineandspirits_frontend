"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useShopByBrand } from "@/app/api/hooks/category/useShopByBrands";


const ShopByBrandDropdown = ({ onClose }) => {
  
  const { data } = useShopByBrand();
  const heading = data?.heading || "";
  const brands = data?.items || [];
  

  return (
    <div className="absolute top-full left-0 w-full bg-white border border-gray-200 shadow-xl z-50 px-3 2xl:px-32 py-6">

      {/* ================= BRANDS GRID (6 columns) ================= */}
      <div className="grid grid-cols-6 gap-4 xl:gap-6">
        {brands.map((brand) => (
          <Link
            key={brand.id}
            href={`/${brand.slug}`}
            onClick={onClose}
            className="relative flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition-colors aspect-[190/79] w-full"
          >
            <Image
              src={
                brand?.image?.startsWith("http")
                  ? brand.image
                  : `${process.env.NEXT_PUBLIC_PRODUCTION_IMAGE_URL || ""}${brand?.image || ""}`
              }
              alt={brand.name}
              fill
              sizes="190px"
              className="max-h-full max-w-[85%] object-contain !p-2"
            />
          </Link>
        ))}
      </div>

      {/* ================= "VIEW ALL" BUTTON ================= */}
      <div className="mt-4">
        <Link
          href="/brands/"
          onClick={onClose}
          className="inline-block bg-[#98022e] hover:bg-[#7e1a3c] text-white text-[13px] font-bold uppercase tracking-wide px-6 py-3 transition-all hover:rounded-xl"
        >
          View All
        </Link>
      </div>
    </div>
  );
};

export default ShopByBrandDropdown;