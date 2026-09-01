"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import React, { useRef, useState, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Award,
  ShoppingCart,
  Percent,
  Loader2,
  Plus,
  ShoppingCartIcon,
  Heart,
} from "lucide-react";
import { useAddtoCart } from "@/app/api/hooks/cart/useAddtoCart";
import { toast } from "sonner";
import { decodeHtml } from "@/libs/decodeHtml";
import { useHomePageProducts } from "../api/hooks/category/useHomePageProducts";
import AddToCartPopup from "./popups/AddToCartPopUp";
import AddToWishlistPopup from "./popups/AddToWishlistPopUp";
import { useAddToWishlist } from "@/app/api/hooks/wishlist/useAddToWishlist";
import { useCheckWishlist } from "@/app/api/hooks/wishlist/useCheckWishlist";

const IMAGE_BASE_URL =
  process.env.NEXT_PUBLIC_PRODUCTION_IMAGE_URL ||
  "https://www.admin.dcwineandspirits.com/image/";

const TAB_ICONS = {
  Bestsellers: Award,
  "New Arrivals": ShoppingCart,
  "Special Deals": Percent,
};

// ---------------------------------------------------------------------------
// SLIDER PRODUCT CARD
// - Alag component banaya hai kyunki har product ka apna wishlist
//   check/add hook chahiye (useCheckWishlist / useAddToWishlist) — aur
//   .map() ke andar seedha hook call karna React rules ke against hai.
// - Baaki sab (image, badges, price, add to cart button) parent se
//   bilkul same copy kiya hai, kuch bhi visually/behaviorally badla nahi.
// ---------------------------------------------------------------------------
const SliderProductCard = ({ item, isAddingThis, onAddToCart }) => {
  const [showWishlistPopup, setShowWishlistPopup] = useState(false);
  const wishlistMut = useAddToWishlist();

  const productId = item?.product_id || item?.id;

  const { data: wishlistCheckData } = useCheckWishlist(productId);
  const isInWishlist = Boolean(
    wishlistCheckData?.data?.inWishlist ?? wishlistCheckData?.inWishlist,
  );

  const isOutOfStock = Number(item.quantity) <= 0;
  const hasSpecialPrice =
    item.special_price !== null &&
    item.special_price !== undefined &&
    item.special_price !== "" &&
    Number(item.special_price) < Number(item.price);
  const discountPercent = hasSpecialPrice
    ? Math.round(
        ((Number(item.price) - Number(item.special_price)) /
          Number(item.price)) *
          100,
      )
    : 0;

  const handleAddToWishlist = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (!productId || wishlistMut.isPending || isInWishlist) return;
    try {
      await wishlistMut.mutateAsync(productId);
      setShowWishlistPopup(true);
    } catch (err) {
      toast.error("Couldn't update wishlist — please try again");
    }
  };

  return (
    <>
      <AddToWishlistPopup
        isOpen={showWishlistPopup}
        onClose={() => setShowWishlistPopup(false)}
        product={{ ...item, image: `${IMAGE_BASE_URL}${item.image}` }}
      />

      <Link
        href={`/${item.seo_url}`}
        className="w-[calc(50%-8px)] sm:w-[243px] flex-shrink-0 flex flex-col bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer snap-start relative rounded-none"
      >
        {/* IMAGE */}
        <div className="w-full sm:w-[243px] h-[190px] sm:h-[240px] flex items-center justify-center p-4 relative bg-[#f9f9f9]">
          {isOutOfStock && (
            <span className="absolute top-2 left-2 z-10 bg-gray-800 text-white text-[10px] sm:text-[11px] font-bold uppercase tracking-wide px-2 py-1 rounded-sm shadow-sm">
              Out of Stock
            </span>
          )}

          {discountPercent > 0 && (
            <span className="absolute top-2 right-2 z-10 bg-[#98022e] text-white text-[11px] sm:text-[12px] font-bold px-2 py-1 rounded-sm shadow-sm">
              {discountPercent}% OFF
            </span>
          )}

          {/* Wishlist heart — mobile/tablet: floating badge on image corner */}
          <button
            type="button"
            onClick={handleAddToWishlist}
            disabled={wishlistMut.isPending || isInWishlist}
            aria-label={isInWishlist ? "Added to wishlist" : "Add to wishlist"}
            aria-pressed={isInWishlist}
            title={isInWishlist ? "Added to wishlist" : "Add to wishlist"}
            className={`lg:hidden absolute bottom-2 right-2 z-10 w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all duration-200 disabled:opacity-90 disabled:cursor-not-allowed cursor-pointer ${
              isInWishlist
                ? "bg-[#98022e] text-white"
                : "bg-white/90 text-gray-500 hover:text-[#98022e]"
            }`}
          >
            {wishlistMut.isPending ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <Heart
                size={13}
                fill={isInWishlist ? "currentColor" : "none"}
                className="transition-transform duration-200"
              />
            )}
          </button>

          <img
            src={`${IMAGE_BASE_URL}${item.image}`}
            alt={decodeHtml(item.name)}
            loading="lazy"
            className={`max-h-full max-w-full object-contain mix-blend-multiply ${
              isOutOfStock ? "opacity-50" : ""
            }`}
          />
        </div>

        {/* PRODUCT INFO */}
        <div className="w-full sm:w-[243px] flex flex-col items-center justify-between p-3 sm:p-5 text-center lg:min-h-[151px]">
          <div className="flex flex-col gap-2 w-full items-center">
            <h3 className="text-[#333] text-[14px] font-medium leading-snug line-clamp-2 min-h-[40px]">
              {decodeHtml(item.name)}
            </h3>

            <div className="flex items-center justify-center gap-2 mt-1 ">
              {hasSpecialPrice ? (
                <>
                  <span className="text-[#98022e] text-[15px] font-semibold">
                    ${Number(item.special_price).toFixed(2)}
                  </span>
                  <span className="text-gray-500 line-through text-[13px]">
                    ${Number(item.price).toFixed(2)}
                  </span>
                </>
              ) : (
                <span className="text-gray-700 text-[15px] font-semibold">
                  ${Number(item.price).toFixed(2)}
                </span>
              )}
            </div>
          </div>

          <div className="mt-4 w-4/5 flex items-center gap-2">
            <button
              onClick={(e) => onAddToCart(e, item)}
              disabled={isAddingThis || isOutOfStock}
              className="flex-1 bg-black text-white py-2 lg:py-2.5 text-[12px] lg:text-[13px] font-[Cambria,Georgia,serif] font-bold tracking-widest uppercase hover:bg-gray-800 transition-colors rounded-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isOutOfStock
                ? "OUT OF STOCK"
                : isAddingThis
                  ? "ADDING..."
                  : "ADD TO CART"}
            </button>

            {/* Wishlist heart — desktop only, square button next to Add to Cart */}
            <button
              type="button"
              onClick={handleAddToWishlist}
              disabled={wishlistMut.isPending || isInWishlist}
              aria-label={isInWishlist ? "Added to wishlist" : "Add to wishlist"}
              aria-pressed={isInWishlist}
              title={isInWishlist ? "Added to wishlist" : "Add to wishlist"}
              className={`hidden lg:flex w-9 h-9 flex-shrink-0 items-center justify-center border transition-all duration-200 cursor-pointer disabled:cursor-not-allowed ${
                isInWishlist
                  ? "bg-[#98022e] border-[#98022e] text-white"
                  : "bg-white border-black text-black hover:border-[#98022e] hover:text-[#98022e]"
              }`}
            >
              {wishlistMut.isPending ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Heart
                  size={14}
                  fill={isInWishlist ? "currentColor" : "none"}
                  className="transition-transform duration-200"
                />
              )}
            </button>
          </div>
        </div>
      </Link>
    </>
  );
};

// ---------------------------------------------------------------------------
// COMPONENT
// ---------------------------------------------------------------------------
const HomeProductSlider = ({
  data: propData,
  isLoading: propLoading,
  isError: propError,
}) => {
  const router = useRouter();
  const scrollRef = useRef(null);
  const addToCartMut = useAddtoCart();
  const [addingProductId, setAddingProductId] = useState(null);
  const hookResult = useHomePageProducts({
    enabled: propData === undefined && propLoading === undefined,
  });
  const data = propData !== undefined ? propData : hookResult.data;
  const isLoading =
    propLoading !== undefined ? propLoading : hookResult.isLoading;
  const isError = propError !== undefined ? propError : hookResult.isError;

  const [popupOpen, setPopupOpen] = useState(false);
  const [popupProduct, setPopupProduct] = useState(null);

  const items = data?.sections?.[0]?.items || [];

  const [activeTab, setActiveTab] = useState(null);

  const currentTab = activeTab || items[0]?.title || null;

  const activeItem = useMemo(
    () => items.find((item) => item.title === currentTab),
    [items, currentTab],
  );

  const products = activeItem?.products || [];

  const scrollByAmount = (amount) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
    }
  };

  const handleAddToCart = async (e, product) => {
    e.stopPropagation();
    e.preventDefault();

    const productId = product?.product_id || product?.id;

    if (!productId || addToCartMut.isPending) return;

    try {
      setAddingProductId(productId);

      const res = await addToCartMut.mutateAsync({
        product_id: productId,
        quantity: 1,
      });

      if (res?.success) {
        setPopupProduct(product);
        setPopupOpen(true);
      }
    } catch (error) {
      toast.error("Failed to add product to cart");
    } finally {
      setAddingProductId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full bg-[#fcfcfc] py-16 flex justify-center">
        <Loader2 className="animate-spin text-[#98022e]" size={28} />
      </div>
    );
  }

  if (isError || items.length === 0) {
    return null;
  }

  return (
    <div className="w-full bg-[#fcfcfc] py-8 md:py-10 font-sans">
      {/* ============================================================
          TAB SWITCHER:
          - Mobile (< sm): underline + text colour
          - Tablet+ (sm and up): pill with border & background tint
          Icons visible on all screens.
      ============================================================ */}
      <div className="w-full mb-6 md:mb-8">
        <div className="flex justify-start sm:justify-center px-3 md:px-12 lg:px-16 2xl:px-32">
          <div className="flex flex-nowrap gap-2 sm:gap-3 items-center overflow-x-auto overflow-y-hidden no-scrollbar w-full sm:w-auto py-2">
            {items.map((item) => {
              const isActive = currentTab === item.title;
              const Icon = TAB_ICONS[item.title] || Award;
              return (
                <button
                  key={item.title}
                  onClick={() => setActiveTab(item.title)}
                  className={`
                    flex items-center gap-0 sm:gap-1.5 shrink-0 whitespace-nowrap px-3 py-2 font-semibold transition-colors font-sumana duration-200 cursor-pointer
                    border-t-2 border-r-2 border-l-2 border-b-2 border-t-transparent border-r-transparent border-l-transparent
                    ${
                      isActive
                        ? "border-b-[#98022e] text-[#98022e]"
                        : "border-b-transparent text-gray-500 hover:text-gray-700"
                    }
                    sm:px-5 sm:py-2 sm:font-bold sm:rounded-full
                    ${
                      isActive
                        ? "sm:border-t-[#98022e] sm:border-r-[#98022e] sm:border-l-[#98022e] sm:border-b-[#98022e] sm:bg-[#98022e]/10"
                        : "sm:border-t-gray-200 sm:border-r-gray-200 sm:border-l-gray-200 sm:border-b-gray-200 sm:bg-white sm:hover:border-t-gray-300 sm:hover:border-r-gray-300 sm:hover:border-l-gray-300 sm:hover:border-b-gray-300"
                    }
                  `}
                  
                >
                  <span className="inline-flex items-center mr-1.5">
                    <Icon size={18} strokeWidth={2.5} />
                  </span>
                  <span className="text-[12px] normal-case sm:text-[16px] sm:uppercase">
                    {item.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-3 md:px-12 lg:px-16 2xl:px-32 relative group">
        <button
          onClick={() => scrollByAmount(-300)}
          className="hidden md:flex absolute left-2 lg:left-4 2xl:left-16 top-1/2 -translate-y-1/2 w-9 h-10 bg-[#343a40] text-white items-center justify-center z-10 cursor-pointer shadow-md rounded-none hover:bg-black transition-colors"
          aria-label="Scroll left"
        >
          <ChevronLeft size={24} />
        </button>

        {/* SCROLL CONTAINER */}
        <div
          ref={scrollRef}
          className="flex flex-nowrap gap-4 md:gap-6 overflow-x-auto pb-6 no-scrollbar snap-x snap-mandatory md:snap-none"
        >
          {products.length > 0 ? (
            products.map((item) => {
              const productId = item?.product_id || item?.id;
              const isAddingThis =
                addToCartMut.isPending && addingProductId === productId;

              return (
                <SliderProductCard
                  key={item.id}
                  item={item}
                  isAddingThis={isAddingThis}
                  onAddToCart={handleAddToCart}
                />
              );
            })
          ) : (
            <div className="w-full text-center py-20 text-gray-400 font-sans">
              No products found in this category.
            </div>
          )}
        </div>

        {/* RIGHT ARROW */}
        <button
          onClick={() => scrollByAmount(300)}
          className="hidden md:flex absolute right-2 lg:right-4 2xl:right-16 top-1/2 -translate-y-1/2 w-9 h-10 bg-[#343a40] text-white items-center justify-center z-10 cursor-pointer shadow-md rounded-none hover:bg-black transition-colors"
          aria-label="Scroll right"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      <AddToCartPopup
        isOpen={popupOpen}
        onClose={() => setPopupOpen(false)}
        product={popupProduct}
      />
    </div>
  );
};

export default HomeProductSlider;