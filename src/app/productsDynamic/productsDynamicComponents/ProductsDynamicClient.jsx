"use client";
import React, { useState } from "react";
import Filters from "./Filters";
import ProductsDynamicMain from "./ProductsDynamicMain";
import { useGetProductBySlugOrId } from "@/app/api/hooks/useAllProducts";
import PhoneHeader from "@/app/components/navcomponents/Phoneheader";
import ProductsHeader from "@/app/components/TittleAndBreadcrumb";
import { SlidersHorizontal, X } from "lucide-react";

const ProductsDynamicClient = ({ slug }) => {
  const {
    data: dynamicData,
    isLoading,
    isError,
  } = useGetProductBySlugOrId(slug);

  // ============================================================
  // Drawer state — sirf mobile/tablet ke liye. Desktop pe Filters
  // hamesha static sidebar ki tarah dikhta hai, is state se koi
  // matlab nahi.
  // ============================================================
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="w-full py-20 text-center text-gray-500 font-bold text-lg">
        Loading...
      </div>
    );
  }

  if (isError || !dynamicData || dynamicData?.type === "not_found") {
    return (
      <div className="w-full py-20 text-center text-[#98022e] font-bold text-lg">
        Not found.
      </div>
    );
  }

  return (
    <>
      <ProductsHeader
        categoryName={dynamicData?.meta_h1 || dynamicData?.name}
      />

      <div className="2xl:px-32 flex items-start justify-between gap-6">
        {/* ---------- DESKTOP: static sidebar — untouched, always visible ---------- */}
        <div className="hidden md:block">
          <Filters data={dynamicData} />
        </div>

        <ProductsDynamicMain data={dynamicData} />
      </div>

      {/* ============================================================
          MOBILE/TABLET: Floating Filter Button
          `md:hidden` — desktop pe kabhi nahi dikhega, wahan sidebar
          already visible hai.
      ============================================================ */}
      <button
        onClick={() => setIsFilterDrawerOpen(true)}
        className="md:hidden fixed bottom-18 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-2 bg-[#98022e] text-white px-6 py-3 rounded-full shadow-lg active:scale-95 transition-transform font-hind-madurai"
      >
        <SlidersHorizontal size={16} className="text-[#c99000]" />
        <span className="text-sm font-semibold tracking-wide">Filters</span>
      </button>

      {/* ============================================================
          MOBILE/TABLET: Drawer
          Sirf isFilterDrawerOpen true hone par mount hota hai —
          backdrop click ya X button se close hota hai.
      ============================================================ */}
      {isFilterDrawerOpen && (
        <div className="md:hidden fixed inset-0 z-100">
          {/* Backdrop */}
          <div
            onClick={() => setIsFilterDrawerOpen(false)}
            className="absolute inset-0 bg-black/50"
          />

          {/* Slide-in panel */}
          <div className="absolute top-0 left-0 h-full w-[85%] max-w-[320px] bg-white shadow-2xl flex flex-col animate-[slideIn_0.25s_ease-out]">
            <div className="flex items-center justify-end px-4 py-4 border-b border-gray-200 shrink-0">
              <button
                onClick={() => setIsFilterDrawerOpen(false)}
                aria-label="Close filters"
                className="p-1 text-[#98022e] hover:text-black "
              >
                <X size={22} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <Filters data={dynamicData} />
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes slideIn {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
};

export default ProductsDynamicClient;
