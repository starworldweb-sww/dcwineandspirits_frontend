"use client";

import React, { useState, useRef } from "react";
import { ChevronLeft, ChevronRight, ShoppingBag } from "lucide-react";
import { Sumana } from "next/font/google";
import { useAddtoCart } from "@/app/api/hooks/cart/useAddtoCart";
import { toast } from "sonner";

// -----------------------------------------------------------------
// FONT
// -----------------------------------------------------------------
const sumana = Sumana({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
});

// -----------------------------------------------------------------
// STEP 1: MOCK PRODUCT DATA
// -----------------------------------------------------------------
const RELATED_PRODUCTS = [
  { id: 1, name: "Moet & Chandon Imperial Brut Champagne", price: "89.00", image: "/images/products/moet-chandon-imperial-brut.jpg" },
  { id: 2, name: "Veuve Clicquot Champagne Gift Basket", price: "129.00", image: "/images/products/veuve-clicquot-gift-basket-1.jpg" },
  { id: 3, name: "Veuve Clicquot Champagne and Glasses Set", price: "159.00", specialPrice: "139.00", badge: "-13%", isHot: true, image: "/images/products/veuve-clicquot-glasses-set.jpg" },
  { id: 4, name: "Moet & Chandon Imperial Brut Champagne", price: "89.00", image: "/images/products/moet-chandon-imperial-brut.jpg" },
  { id: 5, name: "Veuve Clicquot Champagne Gift Basket", price: "129.00", image: "/images/products/veuve-clicquot-gift-basket-2.jpg" },
  { id: 6, name: "Dom Perignon Vintage Champagne", price: "219.00", image: "/images/products/dom-perignon-vintage.jpg" },
];

const LATEST_PRODUCTS = [
  { id: 7, name: "Billecart-Salmon Rose Champagne", price: "99.00", image: "/images/products/billecart-salmon-rose.jpg" },
  { id: 8, name: "Silver Oak Cabernet Sauvignon", price: "79.00", image: "/images/products/silver-oak-cabernet.jpg" },
  { id: 9, name: "Ruinart Blanc de Blancs Champagne", price: "109.00", image: "/images/products/ruinart-blanc-de-blancs.jpg" },
  { id: 10, name: "Perrier-Jouet Grand Brut Champagne", price: "69.00", image: "/images/products/perrier-jouet-grand-brut.jpg" },
];

const BEST_SELLER_PRODUCTS = [
  { id: 11, name: "Veuve Clicquot Yellow Label Brut", price: "59.00", image: "/images/products/veuve-clicquot-yellow-label.jpg" },
  { id: 12, name: "Moet & Chandon Rose Imperial", price: "95.00", image: "/images/products/moet-chandon-rose-imperial.jpg" },
  { id: 13, name: "Dom Perignon Gift Box Set", price: "249.00", badge: "-10%", image: "/images/products/dom-perignon-gift-box.jpg" },
  { id: 14, name: "Billecart-Salmon Brut Reserve", price: "85.00", image: "/images/products/billecart-salmon-brut-reserve.jpg" },
];

// -----------------------------------------------------------------
// STEP 2: TABS CONFIG
// -----------------------------------------------------------------
const TABS = [
  { key: "related", label: "Related Products", products: RELATED_PRODUCTS },
  { key: "latest", label: "Latest", products: LATEST_PRODUCTS },
  { key: "bestsellers", label: "Best Sellers", products: BEST_SELLER_PRODUCTS },
];

export default function RecommendedProducts() {
  const [activeTab, setActiveTab] = useState("related");
  const sliderRef = useRef(null);
  const addToCartMut = useAddtoCart();

  const activeProducts =
    TABS.find((tab) => tab.key === activeTab)?.products || [];

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -280, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 280, behavior: "smooth" });
    }
  };

  const handleAddToCart = async (e, product) => {
    e.stopPropagation();
    const productId = product?.product_id || product?.id;
    if (!productId || addToCartMut.isPending) return;
    try {
      const res = await addToCartMut.mutateAsync({ product_id: productId, quantity: 1 });
      if (res?.success) toast.success(res.message || "Added to cart!");
    } catch (e) {}
  };

  return (
    <section className="w-full bg-[#f8f8f8] px-3 2xl:px-32 py-10">
      
      {/* ============================================================
          TABS ROW - Updated with absolute pink line overlapping
      ============================================================ */}
      <div className="w-full mb-8">
        <div className="flex justify-start sm:justify-center overflow-x-auto no-scrollbar border-b border-gray-200 w-full">
          <div className="flex gap-6 sm:gap-14 items-center sm:w-auto sm:min-w-max">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`${sumana.className} relative flex items-center pb-3 shrink-0 whitespace-nowrap text-base sm:text-xl font-bold uppercase tracking-wide transition-colors cursor-pointer rounded-none ${
                    isActive ? "text-[#98022e]" : "text-black hover:text-[#98022e]"
                  }`}
                >
                  {tab.label}

                  {/* Overlapping Pink Line Logic */}
                  {isActive && (
                    <div className="absolute -bottom-[1px] left-0 w-full h-[2px] bg-[#98022e]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ============================================================
          PRODUCT SLIDER (with left/right arrow buttons)
      ============================================================ */}
      <div className="relative">
        <button
          onClick={scrollLeft}
          aria-label="Scroll left"
          className="hidden sm:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10 items-center justify-center w-9 h-9 lg:w-10 lg:h-10 bg-[#1c1c26] hover:bg-black text-white transition-colors cursor-pointer"
        >
          <ChevronLeft size={20} />
        </button>

        <button
          onClick={scrollRight}
          aria-label="Scroll right"
          className="hidden sm:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 items-center justify-center w-9 h-9 lg:w-10 lg:h-10 bg-[#1c1c26] hover:bg-black text-white transition-colors cursor-pointer"
        >
          <ChevronRight size={20} />
        </button>

        <div
          ref={sliderRef}
          className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth"
        >
          {activeProducts.map((product) => (
            <div
              key={product.id}
              className="flex-shrink-0 w-[45%] xs:w-[42%] sm:w-[240px] lg:w-[260px] bg-white border border-gray-100"
            >
              <div className="relative w-full aspect-square bg-white flex items-center justify-center overflow-hidden">
                {product.badge && (
                  <span className="absolute top-2 right-2 z-10 bg-[#98022e] text-white text-xs font-bold px-2 py-1 rounded-full">
                    {product.badge}
                  </span>
                )}
                {product.isHot && (
                  <span className="absolute top-11 right-2 z-10 bg-[#f5c95d] text-black text-xs font-bold px-2 py-1 rounded-full">
                    HOT
                  </span>
                )}
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain object-center p-4"
                />
              </div>

              <div className="p-3 text-center">
                <p className="text-sm text-black truncate">
                  {product.name}
                </p>
                <div className="mt-1 flex items-center justify-center gap-2">
                  {product.specialPrice ? (
                    <>
                      <span className="text-sm text-gray-400 line-through">
                        ${product.price}
                      </span>
                      <span className="text-sm font-bold text-[#98022e]">
                        ${product.specialPrice}
                      </span>
                    </>
                  ) : (
                    <span className="text-sm font-bold text-black">
                      ${product.price}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={(e) => handleAddToCart(e, product)}
                  disabled={addToCartMut.isPending}
                  className="mt-3 w-full bg-black hover:bg-gray-800 text-white text-xs sm:text-sm font-bold uppercase tracking-wide py-2.5 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {addToCartMut.isPending ? "ADDING..." : "ADD TO CART"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}