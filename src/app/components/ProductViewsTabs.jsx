"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Sarabun, Hind_Madurai, Sumana } from "next/font/google";
import { ShoppingCart, Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { useAddtoCart } from "@/app/api/hooks/cart/useAddtoCart";
import { useAddToWishlist } from "@/app/api/hooks/wishlist/useAddToWishlist";
import { useCheckWishlist } from "@/app/api/hooks/wishlist/useCheckWishlist";
import AddToWishlistPopup from "@/app/components/popups/AddToWishlistPopUp";
import AddToCartPopup from "./popups/AddToCartPopUp";
import { useMostViewedProducts } from "../api/hooks/useMostViewedProducts";
import { getRecentProducts } from "@/libs/recentProducts";
import { decodeHtml } from "@/libs/decodeHtml";

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

// 2. Small helper - checks if a product has a discounted price
const hasDiscount = (special_price) =>
  special_price !== null && special_price !== undefined && special_price !== "";

// 2a. Normalizes the most-viewed API shape (product_id, image path
// without leading slash) to the same shape ProductCard already expects.
const IMAGE_BASE_URL =
  process.env.NEXT_PUBLIC_PRODUCTION_IMAGE_URL ||
  process.env.NEXT_PUBLIC_LOCAL_IMAGE_URL ||
  "";

const resolveImage = (image) =>
  !image ? "" : image.startsWith("http") ? image : `${IMAGE_BASE_URL}${image}`;

const mapMostViewedProduct = (product) => ({
  id: product.product_id,
  slug: product.slug,
  seo_url: product.seo_url,
  name: product.name,
  image: resolveImage(product.image),
  price: product.original_price ?? product.price,
  special_price: product.special_price,
});

// 2b. Normalizes whatever shape addRecentProduct() saved in localStorage
// into the same shape ProductCard expects.
const mapRecentProduct = (product) => ({
  id: product.product_id,
  slug: product.slug,
  seo_url: product.seo_url,
  name: product.name,
  image: resolveImage(product.image),
  price: product.original_price ?? product.price,
  special_price: product.special_price,
});

// 3. Single product card - shows image, name, price, cart + wishlist buttons.
// Wrapped in a Link (href = product slug) so it's crawlable and navigable.
//
// FIX: dropped the `md:max-w-[327px]` cap that used to hard-limit the card
// width. On the non-slider (<=4 items) grid row, the grid columns now
// stretch to fill the available width via `auto-fit + minmax`, but the
// card itself was still capping out at 327px - leaving a big empty block
// on wide screens. `md:max-w-none` lets the card grow to fill its column.
function ProductCard({ product }) {
  const isDiscounted = hasDiscount(product.special_price);

  const [showWishlistPopup, setShowWishlistPopup] = useState(false);
  const [showCartPopup, setShowCartPopup] = useState(false);

  const addToCartMut = useAddtoCart();
  const isAddingToCart = addToCartMut.isPending;

  const addToWishlistMut = useAddToWishlist();
  const isAddingToWishlist = addToWishlistMut.isPending;

  const { data: wishlistCheckData } = useCheckWishlist(product.id);
  const isInWishlist = Boolean(
    wishlistCheckData?.data?.isInWishlist ?? wishlistCheckData?.isInWishlist,
  );

  const handleAddToCartClick = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (!product.id || isAddingToCart) return;

    try {
      const res = await addToCartMut.mutateAsync({
        product_id: product.id,
        quantity: 1,
      });
      if (res?.success) {
        setShowCartPopup(true);
      }
    } catch (err) {}
  };

  const handleAddToWishlistClick = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (!product.id || isAddingToWishlist || isInWishlist) return;

    try {
      await addToWishlistMut.mutateAsync(product.id);
      setShowWishlistPopup(true);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to add to wishlist");
    }
  };

  return (
    <>
      <AddToWishlistPopup
        isOpen={showWishlistPopup}
        onClose={() => setShowWishlistPopup(false)}
        product={product}
      />

      <AddToCartPopup
        isOpen={showCartPopup}
        onClose={() => setShowCartPopup(false)}
        product={product}
      />

      <Link
        href={`/${product.seo_url || product.slug}`}
        className="flex h-[93px] w-[280px] flex-shrink-0 cursor-pointer items-center gap-3 overflow-hidden border border-gray-100 bg-white p-2 shadow-sm transition hover:shadow-md snap-center md:w-full md:max-w-[400px]"
      >
        <div className="relative flex h-[78px] w-[78px] flex-shrink-0 items-center justify-center overflow-hidden">
          <Image
            src={product.image}
            alt={decodeHtml(product.name)}
            fill
            sizes="78px"
            className="object-contain"
          />
        </div>

        <div className="min-w-0 flex-1">
          <h3
            title={decodeHtml(product.name)}
            className="truncate text-[13px] font-semibold leading-tight text-[#1A202C]"
            style={{ fontFamily: "var(--font-sarabun)" }}
          >
            {decodeHtml(product.name)}
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
            <button
              type="button"
              onClick={handleAddToCartClick}
              disabled={isAddingToCart}
              className="transition disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
            >
              <ShoppingCart size={17} />
            </button>

            <button
              type="button"
              onClick={handleAddToWishlistClick}
              disabled={isAddingToWishlist || isInWishlist}
              className="transition disabled:cursor-not-allowed"
            >
              <Heart
                size={17}
                className={isInWishlist ? "fill-[#98022e] text-[#98022e]" : ""}
              />
            </button>
          </div>
        </div>
      </Link>
    </>
  );
}

// 4. Main section - tabs + horizontal scrollable product row.
// Slider (scroll + arrows) only kicks in when there are more than
// VISIBLE_COUNT products; otherwise it's a plain, non-scrolling row
// with no extra padding, matching the original design.
const VISIBLE_COUNT = 4;

export default function ProductViewTabs() {
  const [activeTab, setActiveTab] = useState("recently");

  // Recently viewed comes from localStorage now
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  useEffect(() => {
    const stored = getRecentProducts() || [];
    setRecentlyViewed(stored.map(mapRecentProduct));
  }, []);

  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const {
    data: mostViewedData,
    isLoading: isMostViewedLoading,
    isError: isMostViewedError,
  } = useMostViewedProducts({ limit: 12 });

  const mostViewedProducts = (mostViewedData ?? []).map(mapMostViewedProduct);

  const currentData = activeTab === "recently" ? recentlyViewed : mostViewedProducts;
  const isSlider = currentData.length > VISIBLE_COUNT;

  // 4a. Recompute whether the arrows should be visible based on actual
  // scrollable overflow (not just item count) - handles resize too.
  const updateScrollButtons = useCallback(() => {
    const el = scrollRef.current;
    if (!el) {
      setCanScrollLeft(false);
      setCanScrollRight(false);
      return;
    }
    const maxScrollLeft = el.scrollWidth - el.clientWidth;
    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(el.scrollLeft < maxScrollLeft - 2);
  }, []);

  useEffect(() => {
    // Reset scroll position when switching tabs / data changes, then recheck
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ left: 0 });
    }
    // Wait a tick so layout has updated with the new items before measuring
    const id = requestAnimationFrame(updateScrollButtons);
    return () => cancelAnimationFrame(id);
  }, [activeTab, currentData.length, updateScrollButtons]);

  // 3. FIX: jab canScrollLeft/canScrollRight badalta hai, container ko
  //    pl-10/pr-10 padding milti/hatati hai — jo khud scrollWidth badal deta
  //    hai. Ye extra pass us padding-shift ke baad ek aur measurement leta
  //    hai taaki left arrow turant sahi state mein aaye, sirf agle scroll
  //    event ka wait na kare.
  useEffect(() => {
    const id = requestAnimationFrame(updateScrollButtons);
    return () => cancelAnimationFrame(id);
  }, [canScrollLeft, canScrollRight, updateScrollButtons]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    el.addEventListener("scroll", updateScrollButtons);
    window.addEventListener("resize", updateScrollButtons);
    return () => {
      el.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, [updateScrollButtons]);

  // 4b. Scrolls by exactly one "page" (visible width) worth of cards
  const scrollByAmount = (direction) => {
    const el = scrollRef.current;
    if (!el) return;
    const pageWidth = el.clientWidth;
    el.scrollBy({
      left: direction === "left" ? -pageWidth : pageWidth,
      behavior: "smooth",
    });
  };

  return (
    <section className={`bg-black px-3 2xl:px-32 py-10 ${sarabun.variable} ${hindMadurai.variable} ${sumana.variable}`}>
      {/* FIX: added max-w + mx-auto so the whole block stays readable and
          centered instead of stretching edge-to-edge on ultra-wide
          screens. Adjust the max-w value if you want it wider/narrower. */}
      <div className="max-w-[2000px]">
        {/* Tabs */}
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

        {/* Product row with left/right scroll arrows (only when > 4 items) */}
        <div className="relative">
          {isSlider && canScrollLeft && (
            <button
              type="button"
              onClick={() => scrollByAmount("left")}
              className="absolute left-2 top-1/2 z-10 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-[#334155] text-white shadow-md transition hover:bg-[#1e293b]"
            >
              <ChevronLeft size={16} />
            </button>
          )}

          {activeTab === "most" && isMostViewedLoading ? (
            <p className="px-10 py-6 text-center text-gray-400">Loading...</p>
          ) : activeTab === "most" && isMostViewedError ? (
            <p className="px-10 py-6 text-center text-gray-400">
              Couldn't load most viewed products.
            </p>
          ) : activeTab === "recently" && currentData.length === 0 ? (
            <p className="px-10 py-6 text-center text-gray-400">
              No recently viewed products yet.
            </p>
          ) : (
            <div
              ref={scrollRef}
              className={
                isSlider
                  ? `flex gap-4 overflow-x-auto scroll-smooth pb-2 snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${
                      canScrollLeft ? "pl-10" : "pl-0"
                    } ${canScrollRight ? "pr-10" : "pr-0"}`
                  : // FIX: replaced the fixed `md:grid-cols-4` with an
                    // auto-fit grid. Columns now stretch to fill the
                    // available width evenly (min 260px each) instead of
                    // staying capped at 4 narrow columns that leave a big
                    // empty gap on wide screens.
                    "flex gap-4 overflow-x-auto scroll-smooth pb-2 snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden md:overflow-visible md:px-0 md:grid md:[grid-template-columns:repeat(auto-fit,minmax(260px,1fr))]"
              }
            >
              {currentData.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {isSlider && canScrollRight && (
            <button
              type="button"
              onClick={() => scrollByAmount("right")}
              className="absolute right-2 top-1/2 z-10 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-[#334155] text-white shadow-md transition hover:bg-[#1e293b]"
            >
              <ChevronRight size={16} />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}