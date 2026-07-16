"use client";

import React, { useRef, useState } from "react";
import { Sarabun, Hind_Madurai, Sumana } from "next/font/google";
import { ShoppingCart, Heart, ChevronLeft, ChevronRight } from "lucide-react";

// 1. Fonts - product name uses Sarabun, price uses Hind Madurai
const sarabun = Sarabun({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-sarabun",
});

const hindMadurai = Hind_Madurai({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-hind-madurai",
});

// Tab labels (Recently Viewed / Most Viewed) use Sumana
const sumana = Sumana({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-sumana",
});

// 2. Mock data - swap this out for your API data later.
// recently_viewed and most_viewed are just two separate arrays
// so the tabs have something different to show.
const MOCK_RECENTLY_VIEWED = [
  {
    id: 1,
    slug: "veuve-clicquot-champagne-flutes-gift-set",
    name: "Veuve Clicquot Champagne and Flutes Gift Set",
    image: "/images/products/veuve-clicquot-gift-set.jpg",
    price: "159.00",
    special_price: "139.00",
  },
  {
    id: 2,
    slug: "birthday-special-hand-painted-la-marca-prosecco",
    name: "Birthday Special Hand-Painted La Marca Prosecco",
    image: "/images/products/la-marca-prosecco.jpg",
    price: "119.00",
    special_price: "99.00",
  },
  {
    id: 3,
    slug: "maschio-prosecco-brut-doc-nu",
    name: "Maschio Prosecco Brut DOC NU",
    image: "/images/products/maschio-prosecco.jpg",
    price: "39.00",
    special_price: null,
  },
  {
    id: 4,
    slug: "veuve-clicquot-champagne-flutes-gift-set-2",
    name: "Veuve Clicquot Champagne and Flutes Gift Set",
    image: "/images/products/veuve-clicquot-gift-set.jpg",
    price: "159.00",
    special_price: "139.00",
  },
];

const MOCK_MOST_VIEWED = [
  {
    id: 5,
    slug: "moet-chandon-imperial-brut",
    name: "Moët & Chandon Impérial Brut",
    image: "/images/products/moet-chandon.jpg",
    price: "59.00",
    special_price: null,
  },
  {
    id: 6,
    slug: "dom-perignon-vintage",
    name: "Dom Pérignon Vintage Champagne",
    image: "/images/products/dom-perignon.jpg",
    price: "229.00",
    special_price: "199.00",
  },
  {
    id: 7,
    slug: "gusbourne-brut-reserve",
    name: "Gusbourne Brut Reserve",
    image: "/images/products/gusbourne-brut.jpg",
    price: "69.00",
    special_price: null,
  },
  {
    id: 8,
    slug: "henriot-brut-souverain",
    name: "Henriot Brut Souverain",
    image: "/images/products/henriot-brut.jpg",
    price: "49.00",
    special_price: "44.00",
  },
];

// 3. Small helper - checks if a product has a discounted price
const hasDiscount = (special_price) =>
  special_price !== null && special_price !== undefined && special_price !== "";

// 4. Single product card - shows image, name, price, cart + wishlist buttons
function ProductCard({ product, onAddToCart, onAddToWishlist }) {
  const isDiscounted = hasDiscount(product.special_price);

  return (
    <article
      className="flex h-[93px] w-[280px] flex-shrink-0 cursor-pointer items-center gap-3 overflow-hidden border border-gray-100 bg-white p-2 shadow-sm transition hover:shadow-md snap-center md:w-full md:max-w-[327px]"
    >
      {/* 4a. Product image */}
      <div className="flex h-[78px] w-[78px] flex-shrink-0 items-center justify-center overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="max-h-full max-w-full object-contain"
        />
      </div>

      {/* 4b. Name + price + action buttons */}
      <div className="min-w-0 flex-1">
        <h3
          title={product.name}
          className="truncate text-[13px] font-semibold leading-tight text-[#1A202C]"
          style={{ fontFamily: "var(--font-sarabun)" }}
        >
          {product.name}
        </h3>

        <div
          className="mt-1 flex items-center gap-2"
          style={{ fontFamily: "var(--font-hind-madurai)" }}
        >
          {isDiscounted ? (
            <>
              <p className="font-semibold text-red-600">
                ${Number(product.special_price).toFixed(2)}
              </p>
              <p className="text-sm font-light text-gray-400 line-through">
                ${Number(product.price).toFixed(2)}
              </p>
            </>
          ) : (
            <p className="font-semibold text-gray-600">
              ${Number(product.price).toFixed(2)}
            </p>
          )}
        </div>

        <div className="mt-2 flex items-center justify-start gap-5">
          {/* Cart button - stopPropagation so clicking it doesn't open the product */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            className="transition"
          >
            <ShoppingCart size={17} />
          </button>

          {/* Wishlist button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onAddToWishlist(product);
            }}
            className="transition"
          >
            <Heart size={17} />
          </button>
        </div>
      </div>
    </article>
  );
}

// 5. Main section - tabs + horizontal scrollable product row
export default function ProductViewTabs() {
  // 5a. Which tab is active
  const [activeTab, setActiveTab] = useState("recently");

  // 5b. Ref on the scrollable row so the arrow buttons can scroll it
  const scrollRef = useRef(null);

  // 5c. Pick which array of products to show based on the active tab
  const currentData = activeTab === "recently" ? MOCK_RECENTLY_VIEWED : MOCK_MOST_VIEWED;

  // 5d. Scrolls the row left or right when an arrow is clicked
  const scrollByAmount = (direction) => {
    if (!scrollRef.current) return;
    const amount = 300; // pixels to scroll per click, tweak as needed
    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  // 5e. Fake add-to-cart / add-to-wishlist handlers - replace with your real hooks
  const handleAddToCart = (product) => {
    console.log("Add to cart:", product.name);
  };

  const handleAddToWishlist = (product) => {
    console.log("Add to wishlist:", product.name);
  };

  return (
    <section className={`bg-black px-3 2xl:px-32 py-10 ${sarabun.variable} ${hindMadurai.variable} ${sumana.variable}`}>
      <div className="mx-auto max-w-[1366px]">
        {/* 6. Tabs - font is Sumana here */}
        <div
          className="mb-6 flex gap-8 border-b border-gray-700"
          style={{ fontFamily: "var(--font-sumana)" }}
        >
          <button
            onClick={() => setActiveTab("recently")}
            className={`pb-2 uppercase font-bold tracking-wide cursor-pointer ${
              activeTab === "recently"
                ? "border-b-2 border-[#B08D3E] text-white"
                : "text-gray-400"
            }`}
          >
            Recently Viewed
          </button>
          <button
            onClick={() => setActiveTab("most")}
            className={`pb-2 uppercase font-bold tracking-wide cursor-pointer ${
              activeTab === "most"
                ? "border-b-2 border-[#B08D3E] text-white"
                : "text-gray-400"
            }`}
          >
            Most Viewed
          </button>
        </div>

        {/* 7. Product row with left/right scroll arrows */}
        <div className="relative">
          {/* 7a. Left arrow - sits flush against the row, half-overlapping the first card */}
          <button
            type="button"
            onClick={() => scrollByAmount("left")}
            className="absolute left-0 top-1/2 z-10 -translate-y-1/2 bg-[#334155] hover:bg-[#1e293b] text-white py-6 px-2"
          >
            <ChevronLeft size={22} />
          </button>

          {/* 7b. Scrollable row of product cards */}
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scroll-smooth px-10 pb-2 snap-x snap-mandatory md:grid md:grid-cols-4 md:overflow-visible md:px-0"
          >
            {currentData.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                onAddToWishlist={handleAddToWishlist}
              />
            ))}
          </div>

          {/* 7c. Right arrow - same tall rectangle style, mirrored on the right edge */}
          <button
            type="button"
            onClick={() => scrollByAmount("right")}
            className="absolute right-0 top-1/2 z-10 -translate-y-1/2 bg-[#334155] hover:bg-[#1e293b] text-white py-6 px-2"
          >
            <ChevronRight size={22} />
          </button>
        </div>
      </div>
    </section>
  );
}