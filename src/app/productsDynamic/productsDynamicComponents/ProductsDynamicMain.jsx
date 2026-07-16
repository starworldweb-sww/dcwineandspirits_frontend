//@ts-nocheck
"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Search,
  ChevronUp,
  ChevronDown,
  Heart,
  Repeat,
  ShoppingBag,
  ChevronRight,
  ChevronsRight,
} from "lucide-react";
import { Logs } from "lucide-react";
import { RiGridFill } from "react-icons/ri";
import { Sumana, Hind_Madurai } from "next/font/google";

// -----------------------------------------------------------------
// FONTS
// Sumana -> price (matches DC Wine & Spirits convention)
// Hind Madurai -> baaki poora text (brand, name, description)
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
// STEP 1: STATIC DROPDOWN OPTIONS (same convention as MainSection.jsx)
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
// STEP 2: STATIC MOCK PRODUCT DATA
// Jab API integrate karni ho, isko useProducts() jaisi API call se
// replace kar dena - baaki UI/JSX bilkul same rahega.
// -----------------------------------------------------------------
const staticProducts = [
  {
    id: 1,
    brand: "Caymus",
    name: "Caymus Cabernet Sauvignon Housewarming Gift Box",
    description:
      "Caymus Cabernet Sauvignon Housewarming Wine Gift Box Welcome them home with a gift that speaks pure elegance. This premium Black Housewarming Gift Box, designed in a sleek matte-black finish and tied with a striking yellow bow, makes an unforgettable first impression. Inside, the celebrated Caymus ..",
    price: "159.00",
    image: "/prosecco-gift-800x800.webp",
  },
  {
    id: 2,
    brand: "Veuve Clicquot",
    name: "Spring-Themed Veuve Clicquot Gift Set",
    description:
      "Celebrate the season with this beautifully curated Spring-Themed Veuve Clicquot Gift Set, featuring the iconic yellow label champagne paired with seasonal floral accents for a fresh, elegant presentation.",
    price: "129.00",
    image: "/prosecco-gift-800x800.webp",
  },
];

// -----------------------------------------------------------------
// STEP 3: STATIC MOCK PAGINATION DATA
// Ye sirf UI dikhane ke liye hai - jab backend se products aayenge,
// tab totalItems / totalPages / currentPage backend response se aayenge
// (jaise "Showing 1 to 24 of 1273 (54 Pages)" wala data).
// -----------------------------------------------------------------
const paginationData = {
  totalItems: 1273,
  totalPages: 54,
  itemsPerPage: 24,
};

// -----------------------------------------------------------------
// STEP 4: LIST VIEW ACTIONS (quantity + add to cart + wishlist + compare)
// -----------------------------------------------------------------
const ProductListActions = () => {
  return (
    <div className="mt-4 flex items-center gap-2 sm:gap-3 w-full">
      {/* Quantity selector */}
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

      {/* Add to Cart - flex-1 so it stretches in list view */}
      <button
        type="button"
        className="flex-1 flex items-center justify-center gap-2 bg-[#98022e] hover:bg-[#7a0225] text-white font-bold uppercase tracking-wide text-xs sm:text-sm px-3 sm:px-5 py-2.5 transition-colors cursor-pointer"
      >
        <ShoppingBag size={16} />
        Add to Cart
      </button>

      {/* Wishlist */}
      <button
        type="button"
        aria-label="Add to wishlist"
        className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-black text-white hover:bg-[#98022e] transition-colors cursor-pointer"
      >
        <Heart size={16} />
      </button>

      {/* Compare */}
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
// STEP 5: LIST VIEW ROW (image left, info right)
// -----------------------------------------------------------------
const ProductListRow = ({ product }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 py-6 border-b border-gray-200">
      {/* --- Product image with zoom icon overlay ---
          Mobile pe: full width, aspect-square (properly bada dikhega)
          sm aur upar: fixed 220x220 box, image ke saath side-by-side */}
      <Link
        href={`/${product.id}/`}
        className="relative w-full aspect-square sm:w-[220px] sm:h-[220px] sm:aspect-auto flex-shrink-0 bg-white flex items-center justify-center group"
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="max-w-full max-h-full object-contain"
        />
        <span className="absolute bottom-3 left-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-black/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <Search size={16} />
        </span>
      </Link>

      {/* --- Product info --- */}
      <div className={`flex-1 flex flex-col justify-center ${hindMadurai.className}`}>
        {/* Brand */}
        <p className="text-sm text-gray-700">
          Brand:{" "}
          <Link
            href={`/${product.brand.toLowerCase().replace(/\s+/g, "-")}/`}
            className="text-[#98022e] font-semibold hover:underline"
          >
            {product.brand}
          </Link>
        </p>

        {/* Name */}
        <Link href={`/${product.id}/`}>
          <h2 className="mt-1 text-xl sm:text-2xl text-[#333333] hover:text-[#98022e] transition-colors">
            {product.name}
          </h2>
        </Link>

        {/* Description - mobile pe 2 lines, desktop pe 3 lines */}
        <p className="mt-2 text-[15px] leading-relaxed text-gray-500 line-clamp-2 sm:line-clamp-3 max-w-2xl">
          {product.description}
        </p>

        {/* Price */}
        <p className={`${sumana.className} mt-3 text-2xl font-bold text-black`}>
          ${Number(product.price).toFixed(2)}
        </p>

        {/* Quantity + Add to Cart + Wishlist + Compare */}
        <ProductListActions />
      </div>
    </div>
  );
};

// -----------------------------------------------------------------
// STEP 6: GRID VIEW CARD
// Matches the reference screenshot: bordered card, big image, name
// centered (can wrap to 2 lines), gray price, plain black full-width
// "ADD TO CART" button - no quantity/wishlist/compare here.
// -----------------------------------------------------------------
const ProductGridCard = ({ product }) => {
  return (
    <div className="flex flex-col items-center text-center bg-white border border-gray-200 p-5">
      <Link
        href={`/${product.id}/`}
        className="w-full aspect-square flex items-center justify-center"
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="max-w-full max-h-full object-contain"
        />
      </Link>

      <Link href={`/${product.id}/`} className={hindMadurai.className}>
        <h2 className="mt-4 text-lg text-[#1c2b4b] hover:text-[#98022e] transition-colors leading-snug">
          {product.name}
        </h2>
      </Link>

      <p className={`${hindMadurai.className} mt-2 text-base text-gray-400`}>
        ${Number(product.price).toFixed(2)}
      </p>

      <button
        type="button"
        className={`${hindMadurai.className} mt-4 w-full bg-black hover:bg-gray-800 text-white font-bold uppercase tracking-wide text-sm py-3 transition-colors cursor-pointer hover:rounded-xl`}
      >
        Add to Cart
      </button>
    </div>
  );
};

// -----------------------------------------------------------------
// STEP 7: PAGINATION COMPONENT
// Screenshot jaisa: numbered maroon boxes, active page dark/black box,
// next (>) aur last (>|) chevron buttons, aur right side "Showing X to Y
// of Z (N Pages)" text in serif (sumana) font.
// currentPage, totalPages, onPageChange props se controlled hai taaki
// baad me API/URL pagination se easily connect ho sake.
// -----------------------------------------------------------------
const Pagination = ({ currentPage, totalPages, totalItems, itemsPerPage, onPageChange }) => {
  // 7a. Kitne page numbers dikhane hai ek time pe (screenshot me 9 dikhe the)
  const MAX_VISIBLE_PAGES = 9;

  // 7b. Visible page numbers ka array banate hai (1 se start karke)
  const getVisiblePages = () => {
    const start = Math.max(1, currentPage - Math.floor(MAX_VISIBLE_PAGES / 2));
    const end = Math.min(totalPages, start + MAX_VISIBLE_PAGES - 1);
    const adjustedStart = Math.max(1, end - MAX_VISIBLE_PAGES + 1);

    const pages = [];
    for (let page = adjustedStart; page <= end; page++) {
      pages.push(page);
    }
    return pages;
  };

  const visiblePages = getVisiblePages();

  // 7c. "Showing X to Y of Z" ke liye start/end item number nikaalte hai
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="w-full py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
      {/* --- Left side: page number boxes + next/last buttons --- */}
      <div className="flex items-center gap-1 flex-wrap">
        {visiblePages.map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            aria-label={`Go to page ${page}`}
            aria-current={page === currentPage ? "page" : undefined}
            className={`w-9 h-9 flex items-center justify-center text-sm font-semibold text-white transition-colors cursor-pointer ${
              page === currentPage
                ? "bg-[#303841]"
                : "bg-[#98022e] hover:bg-[#7a0225]"
            }`}
          >
            {page}
          </button>
        ))}

        {/* Next page button */}
        <button
          type="button"
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          aria-label="Next page"
          className="w-9 h-9 flex items-center justify-center bg-[#98022e] hover:bg-[#7a0225] text-white transition-colors cursor-pointer"
        >
          <ChevronRight size={16} />
        </button>

        {/* Last page button */}
        <button
          type="button"
          onClick={() => onPageChange(totalPages)}
          aria-label="Last page"
          className="w-9 h-9 flex items-center justify-center bg-[#98022e] hover:bg-[#7a0225] text-white transition-colors cursor-pointer"
        >
          <ChevronsRight size={16} />
        </button>
      </div>

      {/* --- Right side: "Showing X to Y of Z (N Pages)" text --- */}
      <p className={`${sumana.className} text-[#303841] text-base`}>
        Showing {startItem} to {endItem} of {totalItems} ({totalPages} Pages)
      </p>
    </div>
  );
};

// -----------------------------------------------------------------
// STEP 8: MAIN STATIC COMPONENT
// Toolbar (grid/list toggle + Sort By + Show) + product listing +
// pagination niche.
// Sirf view/sort/show/currentPage ka UI-state hai, koi API/business
// logic nahi - data hamesha staticProducts/paginationData se hi aata hai.
// -----------------------------------------------------------------
const ProductsDynamicMain = () => {
  const [layout, setLayout] = useState("list"); // "list" | "grid"
  const [sortOption, setSortOption] = useState("");
  const [showNum, setShowNum] = useState(ShowOptions[0].value);
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <section className="w-full bg-white">
      {/* --- Toolbar: grid/list toggle + Sort By + Show --- */}
      <div className="w-full py-4 flex justify-between items-center bg-[#f2f2f2] mt-2 px-2 border-gray-200">
        {/* View toggle icons */}
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
          {/* Sort By dropdown */}
          <div className="flex items-center gap-2">
            <label className="text-gray-600 text-sm hidden sm:inline-block">
              Sort By:
            </label>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="border border-zinc-300 bg-white px-3 py-1 text-[12px] outline-none hover:cursor-pointer"
            >
              {SortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Show dropdown */}
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 hidden sm:inline-block">
              Show:
            </label>
            <select
              value={showNum}
              onChange={(e) => setShowNum(Number(e.target.value))}
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

      {/* --- Product listing: list view or grid view --- */}
      {layout === "list" ? (
        <div>
          {staticProducts.map((product) => (
            <ProductListRow key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-6">
          {staticProducts.map((product) => (
            <ProductGridCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* --- Pagination: page numbers + "Showing X to Y of Z" --- */}
      <Pagination
        currentPage={currentPage}
        totalPages={paginationData.totalPages}
        totalItems={paginationData.totalItems}
        itemsPerPage={paginationData.itemsPerPage}
        onPageChange={setCurrentPage}
      />
    </section>
  );
};

export default ProductsDynamicMain;