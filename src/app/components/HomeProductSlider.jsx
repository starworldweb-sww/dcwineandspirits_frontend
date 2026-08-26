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
} from "lucide-react";
import { useAddtoCart } from "@/app/api/hooks/cart/useAddtoCart";
import { toast } from "sonner";
import { decodeHtml } from "@/libs/decodeHtml";
import { useHomePageProducts } from "../api/hooks/category/useHomePageProducts";
import AddToCartPopup from "./popups/AddToCartPopUp";

const IMAGE_BASE_URL =
  process.env.NEXT_PUBLIC_PRODUCTION_IMAGE_URL ||
  "https://www.admin.dcwineandspirits.com/image/";

const TAB_ICONS = {
  Bestsellers: Award,
  "New Arrivals": ShoppingCart,
  "Special Deals": Percent,
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

  // ============================================================
  // NEW: AddToCartPopup ke liye state — kaunsa product abhi add
  // hua hai wo store karte hain, taaki popup usi ka image/name/price
  // dikha sake.
  // ============================================================
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupProduct, setPopupProduct] = useState(null);

  // API se items (tabs) nikalna: data.sections[0].items[]
  const items = data?.sections?.[0]?.items || [];

  const [activeTab, setActiveTab] = useState(null);

  // Jab data aa jaye, pehla tab default active kar do
  const currentTab = activeTab || items[0]?.title || null;

  const activeItem = useMemo(
    () => items.find((item) => item.title === currentTab),
    [items, currentTab],
  );

  const products = activeItem?.products || [];

  // SCROLL HANDLERS
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
        // NEW: toast ki jagah / saath AddToCartPopup dikhao
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
      <div className="w-full mb-6 md:mb-8">
        <div className="flex justify-start sm:justify-center px-3 md:px-12 lg:px-16 2xl:px-32">
          <div className="flex gap-6 md:gap-14 items-center overflow-x-auto no-scrollbar w-full sm:w-auto sm:min-w-max border-b-1 border-gray-200">
            {items.map((item) => {
              const isActive = currentTab === item.title;
              const Icon = TAB_ICONS[item.title] || Award;
              return (
                <button
                  key={item.title}
                  onClick={() => setActiveTab(item.title)}
                  className={`relative flex items-center gap-2 pb-3 shrink-0 whitespace-nowrap transition-colors duration-200 cursor-pointer rounded-none ${
                    isActive
                      ? "text-[#98022e]"
                      : "text-black hover:text-[#98022e]"
                  }`}
                  style={{
                    fontFamily: "'Sumana', serif",
                    fontSize: "16px",
                    fontWeight: 700,
                  }}
                >
                  <Icon size={18} strokeWidth={2.5} className="md:w-5 md:h-5" />
                  <span className="md:text-[20px] uppercase">{item.title}</span>

                  {isActive && (
                    <div className="absolute -bottom-[1px] left-0 w-full h-[2px] bg-[#98022e]" />
                  )}
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
              // isi product ke liye add-to-cart abhi pending hai ya nahi —
              // dono buttons (mobile "+" aur desktop text button) isi ek
              // check ko share karte hain
              const productId = item?.product_id || item?.id;
              const isAddingThis =
                addToCartMut.isPending && addingProductId === productId;

              // ============================================================
              // NEW: stock aur discount badges ke liye checks
              // - out of stock: item.quantity <= 0 (agar tumhare data mein
              //   field ka naam alag hai jaise item.stock/item.in_stock,
              //   yahan replace kar dena)
              // - discount %: sirf tab dikhega jab special_price ho aur
              //   original price se kam ho
              // ============================================================
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

              return (
                <Link
                  key={item.id}
                  href={`/${item.seo_url}`}
                  className="w-[calc(50%-8px)] sm:w-[243px] flex-shrink-0 flex flex-col bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer snap-start relative rounded-none"
                >
                  {/* IMAGE */}
                  <div className="w-full sm:w-[243px] h-[190px] sm:h-[240px] flex items-center justify-center p-4 relative bg-[#f9f9f9]">
                    {/* ============================================================
                        NEW: Badges — hamesha visible, hover ki zaroorat nahi.
                        - top-left: OUT OF STOCK (agar stock nahi hai)
                        - top-right: discount % (agar special price hai)
                    ============================================================ */}
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

                    <img
                      src={`${IMAGE_BASE_URL}${item.image}`}
                      alt={decodeHtml(item.name)}
                      loading="lazy"
                      className={`max-h-full max-w-full object-contain mix-blend-multiply ${
                        isOutOfStock ? "opacity-50" : ""
                      }`}
                    />

                    {/* ============================================================
                        Phone/Tablet ke liye "+" add-to-cart button, image ke
                        right-bottom corner pe. "lg:hidden" isliye ki desktop
                        (lg aur upar) pe yeh chhup jaye aur neeche wala text
                        button dikhe. Out of stock hone par disable.
                    ============================================================ */}
                    {/* <button
                      onClick={(e) => handleAddToCart(e, item)}
                      disabled={isAddingThis || isOutOfStock}
                      aria-label="Add to cart"
                      className="lg:hidden absolute bottom-2 right-2 w-10 h-10 rounded-full bg-black text-white flex items-center justify-center shadow-md active:scale-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isAddingThis ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <ShoppingCartIcon size={18} strokeWidth={2.5} />
                      )}
                    </button> */}
                  </div>

                  {/* PRODUCT INFO */}
                  <div className="w-full sm:w-[243px] flex flex-col items-center justify-between p-3 sm:p-5 text-center lg:min-h-[151px]">
                    <div className="flex flex-col gap-2 w-full items-center">
                      {/* NAME */}
                      <h3 className="text-[#333] text-[14px] font-medium leading-snug line-clamp-2 min-h-[40px]">
                        {decodeHtml(item.name)}
                      </h3>

                      {/* PRICE */}
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

                    {/* ============================================================
                        ADD TO CART BUTTON — ab sirf desktop (lg aur upar) pe
                        dikhega. Phone/tablet pe iski jagah image ke upar wala
                        "+" button use hota hai. Out of stock hone par disable.
                    ============================================================ */}
                    <button
                      onClick={(e) => handleAddToCart(e, item)}
                      disabled={isAddingThis || isOutOfStock}
                      className="block w-4/5 mt-4 bg-black text-white py-2  lg:py-2.5  text-[12px] lg:text-[13px] font-[Cambria,Georgia,serif] font-bold tracking-widest uppercase hover:bg-gray-800 transition-colors rounded-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isOutOfStock
                        ? "OUT OF STOCK"
                        : isAddingThis
                          ? "ADDING..."
                          : "ADD TO CART"}
                    </button>
                  </div>
                </Link>
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

      {/* ============================================================
          NEW: Add to Cart success popup — top-right corner mein
          2.5 second ke liye dikhta hai, phir auto-close ho jaata hai.
      ============================================================ */}
      <AddToCartPopup
        isOpen={popupOpen}
        onClose={() => setPopupOpen(false)}
        product={popupProduct}
      />
    </div>
  );
};

export default HomeProductSlider;
