// @ts-nocheck
"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import {
  Search,
  ChevronUp,
  ChevronDown,
  Heart,
  Repeat,
  ShoppingBag,
  Logs,
} from "lucide-react";
import { RiGridFill } from "react-icons/ri";
import { Sumana, Hind_Madurai } from "next/font/google";
import { decodeHtml } from "@/libs/decodeHtml";

// -----------------------------------------------------------------
// FONTS
// -----------------------------------------------------------------
const sumana = Sumana({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
});

const hindMadurai = Hind_Madurai({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  display: "swap",
});

// -----------------------------------------------------------------
// STATIC DROPDOWN OPTIONS
// -----------------------------------------------------------------
const SortOptions = [
  { value: "", label: "Default" },
  { value: "name_asc", label: "Name (A - Z)" },
  { value: "name_desc", label: "Name (Z - A)" },
  { value: "price_asc", label: "Price (Low > High)" },
  { value: "price_desc", label: "Price (High > Low)" },
];

const ShowOptions = [
  { value: 24, label: "24" },
  { value: 50, label: "50" },
  { value: 75, label: "75" },
  { value: 100, label: "100" },
];

// -----------------------------------------------------------------
// LIST VIEW ACTIONS (quantity + add to cart + wishlist + compare)
// -----------------------------------------------------------------
const ProductListActions = () => {
  return (
    <div className="mt-4 flex items-center gap-2 sm:gap-3 w-full">
      <div className="flex items-center border border-gray-300 bg-white flex-shrink-0">
        <input
          type="number"
          min={1}
          defaultValue={1}
          className="w-12 sm:w-14 text-center outline-none py-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <div className="flex flex-col border-l border-gray-300">
          <button
            type="button"
            className="px-2 hover:bg-gray-100 cursor-pointer"
            aria-label="Increase quantity"
          >
            <ChevronUp size={14} />
          </button>
          <button
            type="button"
            className="px-2 hover:bg-gray-100 border-t border-gray-300 cursor-pointer"
            aria-label="Decrease quantity"
          >
            <ChevronDown size={14} />
          </button>
        </div>
      </div>

      <button
        type="button"
        className="flex-1 flex items-center justify-center gap-2 bg-[#98022e] hover:bg-[#7a0225] text-white font-bold uppercase tracking-wide text-xs sm:text-sm px-3 sm:px-5 py-2.5 transition-colors cursor-pointer"
      >
        <ShoppingBag size={16} />
        Add to Cart
      </button>

      <button
        type="button"
        aria-label="Add to wishlist"
        className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-black text-white hover:bg-[#98022e] transition-colors cursor-pointer"
      >
        <Heart size={16} />
      </button>

      <button
        type="button"
        aria-label="Compare this product"
        className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-black text-white hover:bg-[#98022e] transition-colors cursor-pointer"
      >
        <Repeat size={16} />
      </button>
    </div>
  );
};

// -----------------------------------------------------------------
// LIST VIEW ROW (image left, info right)
// -----------------------------------------------------------------
const ProductListRow = ({ product }) => {
  const productLink = `/${product.seo_url || product.product_id}/`;
  const brandName = product.brand || "Premium Brand";
  const description = product.description || product.name;
  const imageUrl = product.image
    ? `https://www.dcwineandspirits.com/image/${product.image}`
    : "/prosecco-gift-800x800.webp";
  const displayPrice = product.special_price || product.price;

  return (
    <div className="flex flex-col sm:flex-row gap-4 py-6 border-b border-gray-200">
      <Link
        href={productLink}
        className="relative w-full aspect-square sm:w-[220px] sm:h-[220px] sm:aspect-auto flex-shrink-0 bg-white flex items-center justify-center group"
      >
        <img
          src={imageUrl}
          alt={decodeHtml(product.name)}
          loading="lazy"
          className="max-w-full max-h-full object-contain"
        />
        <span className="absolute bottom-3 left-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-black/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <Search size={16} />
        </span>
      </Link>

      <div className={`flex-1 flex flex-col justify-center ${hindMadurai.className}`}>
        <p className="text-sm text-gray-700">
          Brand:{" "}
          <Link
            href={`/${brandName.toLowerCase().replace(/\s+/g, "-")}/`}
            className="text-[#98022e] font-semibold hover:underline"
          >
            {decodeHtml(brandName)}
          </Link>
        </p>

        <Link href={productLink}>
          <h2 className="mt-1 text-xl sm:text-2xl text-[#333333] hover:text-[#98022e] transition-colors">
            {decodeHtml(product.name)}
          </h2>
        </Link>

        <p className="mt-2 text-[15px] leading-relaxed text-gray-500 line-clamp-2 sm:line-clamp-3 max-w-2xl">
          {decodeHtml(description)}
        </p>

        <p className={`${sumana.className} mt-3 text-2xl font-bold text-black`}>
          ${Number(displayPrice || 0).toFixed(2)}
        </p>

        <ProductListActions />
      </div>
    </div>
  );
};

// -----------------------------------------------------------------
// GRID VIEW CARD
// -----------------------------------------------------------------
const ProductGridCard = ({ product }) => {
  const productLink = `/${product.seo_url || product.custom_url}/`;
  const imageUrl = product.image
    ? `https://www.dcwineandspirits.com/image/${product.image}`
    : "/prosecco-gift-800x800.webp";
  const displayPrice = product.special_price || product.price;

  return (
    // 1. h-full -> card apni grid cell ka pura height le, taaki row ke saare cards match karein
    <div className="h-full flex flex-col items-center text-center bg-white border border-gray-200 p-5">
      
      {/* 2. Image ko fixed-height box do (aspect-square ki jagah), taaki alag
             products ke alag intrinsic image sizes ho tab bhi sab ek jaisa
             dikhein - box aur bottle dono same box mein center hoke fit honge */}
      <Link
        href={productLink}
        className="w-full h-[200px] flex items-center justify-center flex-shrink-0"
      >
        <img
          src={imageUrl}
          alt={decodeHtml(product.name)}
          loading="lazy"
          className="max-w-full max-h-full object-contain"
        />
      </Link>

      {/* 3. Title ke liye 2 lines ki fixed height reserve - 1 line wale aur
             2 line wale titles ke baad bhi price/button ki position same rahegi */}
      <Link href={productLink} className={`${hindMadurai.className} w-full`}>
        <h2 className="mt-4 text-[16px] text-[#1c2b4b] hover:text-[#98022e] transition-colors leading-snug line-clamp-2 min-h-[3.2em] flex items-center justify-center font-hind-madurai">
          {decodeHtml(product.name)}
        </h2>
      </Link>

      <p className={`${hindMadurai.className} mt-2 text-base text-gray-400`}>
        ${Number(displayPrice || 0).toFixed(2)}
      </p>

      {/* 4. mt-auto ab reliably bottom pe hi button rakhega, kyunki upar ki
             cheezein (image, title) fixed height le chuki hain */}
      <button
        type="button"
        className={`${hindMadurai.className} mt-auto w-full bg-black hover:bg-gray-800 text-white font-bold uppercase tracking-wide text-sm py-3 transition-colors cursor-pointer hover:rounded-xl`}
      >
        Add to Cart
      </button>
    </div>
  );
};

// -----------------------------------------------------------------
// MAIN COMPONENT (Connected to dynamic props from client)
// -----------------------------------------------------------------
const ProductsMain = ({
  products = [],
  isLoading = false,
  isError = false,
  layout,
  setLayout,
  sortOption,
  setSortOption,
  showNum,
  setShowNum,
}) => {
   
  // 1. Sort the products based on the dropdown selection
  const sortedProducts = useMemo(() => {
    if (!products || products.length === 0) return [];
    
    // Create a copy so we don't mutate the original array
    const sorted = [...products]; 

    switch (sortOption) {
      case "name_asc":
        return sorted.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
      case "name_desc":
        return sorted.sort((a, b) => (b.name || "").localeCompare(a.name || ""));
      case "price_asc":
        return sorted.sort((a, b) => 
          (parseFloat(a.special_price || a.price) || 0) - (parseFloat(b.special_price || b.price) || 0)
        );
      case "price_desc":
        return sorted.sort((a, b) => 
          (parseFloat(b.special_price || b.price) || 0) - (parseFloat(a.special_price || a.price) || 0)
        );
      default:
        return sorted; // Default order
    }
  }, [products, sortOption]);

  return (
    <section className="w-full bg-white px-3 2xl:px-32">
      {/* --- Toolbar: grid/list toggle + Sort By + Show --- */}
      <div className="w-full py-4 flex justify-between items-center bg-[#f2f2f2] mt-2 px-2 border-gray-200">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setLayout("grid")}
            aria-label="Grid view"
            className={`cursor-pointer transition-colors ${
              layout === "grid" ? "text-[#98022e]" : "text-black hover:text-[#98022e]"
            }`}
          >
            <RiGridFill size={20} />
          </button>
          <button
            type="button"
            onClick={() => setLayout("list")}
            aria-label="List view"
            className={`cursor-pointer transition-colors ${
              layout === "list" ? "text-[#98022e]" : "text-black hover:text-[#98022e]"
            }`}
          >
            <Logs size={20} />
          </button>
        </div>

        <div className="flex items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-2">
            <label className="text-gray-600 text-sm hidden sm:inline-block">
              Sort By:
            </label>
            <select
              value={sortOption}
              onChange={(e) => {
                setSortOption(e.target.value);
              }}
              className="border border-zinc-300 bg-white px-3 py-1 text-[12px] outline-none hover:cursor-pointer"
            >
              {SortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 hidden sm:inline-block">
              Show:
            </label>
            <select
              value={showNum}
              onChange={(e) => {
                setShowNum(Number(e.target.value));
              }}
              className="border border-zinc-300 bg-white px-2 py-1 text-[12px] outline-none hover:cursor-pointer"
            >
              {ShowOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* --- Product Listing / States --- */}
      {isLoading ? (
        <div className="w-full py-20 text-center text-gray-500 font-bold text-lg">
          Loading products...
        </div>
      ) : isError ? (
        <div className="w-full py-20 text-center text-[#98022e] font-bold text-lg">
          Failed to load products. Please try again.
        </div>
      ) : products.length === 0 ? (
        <div className="w-full py-20 text-center text-gray-400 font-semibold text-lg">
          No products found.
        </div>
      ) : (
        <>
          {layout === "list" ? (
            <div>
              {sortedProducts.map((product, index) => (
                <ProductListRow key={product.product_id || index} product={product} />
              ))}
            </div>
          ) : (
            // 5. items-stretch added so every card in a row matches the tallest one
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-6 items-stretch">
              {sortedProducts.map((product, index) => (
                <ProductGridCard key={product.product_id || index} product={product} />
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default ProductsMain;