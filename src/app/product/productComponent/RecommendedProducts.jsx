"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ShoppingBag } from "lucide-react";
import { Sumana } from "next/font/google";
import { useAddtoCart } from "@/app/api/hooks/cart/useAddtoCart";
import { toast } from "sonner";

const sumana = Sumana({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
});

const IMAGE_BASE = "https://www.dcwineandspirits.com/image/";

const decodeHtml = (str) => {
  if (!str) return "";
  if (typeof window === "undefined") {
    return String(str)
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'")
      .replace(/&#39;/g, "'");
  }
  const txt = document.createElement("textarea");
  txt.innerHTML = String(str);
  return txt.value;
};

const getImageUrl = (path) => {
  if (!path) return "/prosecco-gift-800x800.webp";
  if (path.startsWith("http")) return path;
  const cleanBase = (IMAGE_BASE || "").replace(/\/$/, "");
  const cleanPath = path.replace(/^\//, "");
  return `${cleanBase}/${cleanPath}`;
};

const normalizeProduct = (p) => {
  if (!p) return null;
  const price = Number(p.price ?? 0);
  const specialPrice =
    p.special_price != null && p.special_price !== "" ? Number(p.special_price) : null;
  const hasDiscount = specialPrice != null && specialPrice < price;
  const discountPercent = hasDiscount
    ? Math.round(((price - specialPrice) / price) * 100)
    : 0;
  return {
    ...p,
    displayName: decodeHtml(p.name || p.title || ""),
    image: getImageUrl(typeof p.image === "string" ? p.image : p.image?.src),
    price,
    specialPrice,
    hasDiscount,
    discountPercent,
    seo_url: p.seo_url || p.slug || "",
    product_id: p.product_id || p.id || p.productId,
    in_stock: p.in_stock !== false,
  };
};

export default function RecommendedProducts({ product = {} }) {
  const [activeTab, setActiveTab] = useState("related");
  const sliderRef = useRef(null);
  const addToCartMut = useAddtoCart();

  const relatedRaw = Array.isArray(product.related_products)
    ? product.related_products
    : [];
  const LATEST_PRODUCTS = Array.isArray(product.latest_products)
    ? product.latest_products
    : [];
  const BEST_SELLER_PRODUCTS = Array.isArray(product.bestseller_products)
    ? product.bestseller_products
    : [];

  const relatedProducts = relatedRaw
    .map(normalizeProduct)
    .filter(Boolean);

  const latestProducts = LATEST_PRODUCTS.map(normalizeProduct).filter(Boolean);
  const bestSellerProducts = BEST_SELLER_PRODUCTS.map(normalizeProduct).filter(Boolean);

  const TABS = React.useMemo(() => {
    return [
      {
        key: "related",
        label: "Related Products",
        products: relatedProducts,
      },
      {
        key: "latest",
        label: "Latest",
        products: latestProducts,
      },
      {
        key: "bestsellers",
        label: "Best Sellers",
        products: bestSellerProducts,
      },
    ].filter((tab) => tab.products.length > 0);
  }, [relatedProducts, latestProducts, bestSellerProducts]);

  const activeProducts =
    TABS.find((tab) => tab.key === activeTab)?.products || [];

  useEffect(() => {
    if (TABS.length > 0 && !TABS.some((tab) => tab.key === activeTab)) {
      setActiveTab(TABS[0].key);
    }
  }, [activeTab, TABS]);
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

  const handleAddToCart = async (e, productCard) => {
    e.stopPropagation();
    const productId = productCard?.product_id;
    if (!productId || addToCartMut.isPending) return;
    try {
      const res = await addToCartMut.mutateAsync({
        product_id: productId,
        quantity: 1,
      });
      if (res?.success) toast.success(res.message || "Added to cart!");
    } catch (err) { }
  };

  return (
    <section className="w-full bg-[#f8f8f8] px-3 2xl:px-32 py-10">
      <div className="w-full mb-8">
        <div className="flex justify-start sm:justify-center overflow-x-auto no-scrollbar border-b border-gray-200 w-full">
          <div className="flex gap-6 sm:gap-14 items-center sm:w-auto sm:min-w-max">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`${sumana.className} relative flex items-center pb-3 shrink-0 whitespace-nowrap text-base sm:text-xl font-bold uppercase tracking-wide transition-colors cursor-pointer rounded-none ${isActive ? "text-[#98022e]" : "text-black hover:text-[#98022e]"
                    }`}
                >
                  {tab.label}
                  {isActive && (
                    <div className="absolute -bottom-[1px] left-0 w-full h-[2px] bg-[#98022e]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

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

        {activeProducts.length === 0 ? (
          <div className="py-16 text-center text-gray-500 text-sm">
            No products available in this section.
          </div>
        ) : (
          <div
            ref={sliderRef}
            className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth"
          >
            {activeProducts.map((p) => {
              const href = p.seo_url ? `/${p.seo_url}` : "#";
              const isHot =
                p.hasDiscount &&
                p.discountPercent >= 5 &&
                activeTab === "related";
              return (
                <div
                  key={p.product_id || p.id || p.displayName}
                  className="flex-shrink-0 w-[45%] xs:w-[42%] sm:w-[240px] lg:w-[260px] bg-white border border-gray-100"
                >
                  <Link href={href} className="block">
                    <div className="relative w-full aspect-square bg-white flex items-center justify-center overflow-hidden">
                      {p.hasDiscount && p.discountPercent > 0 && (
                        <span className="absolute top-2 right-2 z-10 bg-[#98022e] text-white text-xs font-bold px-2 py-1 rounded-full">
                          -{p.discountPercent}%
                        </span>
                      )}
                      {!p.in_stock && (
                        <span className="absolute top-2 left-2 z-10 bg-gray-700 text-white text-[11px] font-bold px-2 py-1 rounded-full">
                          OUT OF STOCK
                        </span>
                      )}
                      {isHot && (
                        <span className="absolute top-11 right-2 z-10 bg-[#f5c95d] text-black text-xs font-bold px-2 py-1 rounded-full">
                          HOT
                        </span>
                      )}
                      <Image
                        src={p.image}
                        alt={p.displayName}
                        fill
                        sizes="(max-width: 640px) 42vw, (max-width: 1024px) 240px, 260px"
                        className="!p-4 object-contain object-center"
                      />
                    </div>
                  </Link>

                  <div className="p-3 text-center">
                    <Link href={href} className="block">
                      <p className="text-sm text-black truncate hover:text-[#98022e] transition-colors">
                        {p.displayName}
                      </p>
                    </Link>
                    <div className="mt-1 flex items-center justify-center gap-2">
                      {p.hasDiscount ? (
                        <>
                          <span className="text-sm text-gray-400 line-through">
                            ${p.price.toFixed(2)}
                          </span>
                          <span className="text-sm font-bold text-[#98022e]">
                            ${p.specialPrice.toFixed(2)}
                          </span>
                        </>
                      ) : (
                        <span className="text-sm font-bold text-black">
                          ${p.price.toFixed(2)}
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={(e) => handleAddToCart(e, p)}
                      disabled={addToCartMut.isPending || !p.in_stock}
                      className="mt-3 w-full bg-black hover:bg-gray-800 text-white text-xs sm:text-sm font-bold uppercase tracking-wide py-2.5 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {addToCartMut.isPending ? "ADDING..." : "ADD TO CART"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
