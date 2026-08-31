"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  ChevronUp,
  ChevronDown,
  Heart,
  Bookmark,
  Repeat,
  ShoppingBag,
  Loader2,
  Plus,
  ShoppingCart,
  HeartIcon,
} from "lucide-react";
import { Logs } from "lucide-react";
import { RiGridFill } from "react-icons/ri";
import { Sumana, Hind_Madurai } from "next/font/google";
import { useAddtoCart } from "@/app/api/hooks/cart/useAddtoCart";
// Replace this with your actua

import { toast } from "sonner";
import { decodeHtml } from "@/libs/decodeHtml";
import SmallDescAndSubcategory from "./SmallDescAndSubcategory";
import AddToCartPopup from "@/app/components/popups/AddToCartPopUp";
import { useAddToWishlist } from "@/app/api/hooks/wishlist/useAddToWishlist";
import { useCheckWishlist } from "@/app/api/hooks/wishlist/useCheckWishlist";

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

const ProductListRow = ({ product }) => {
  const addToCartMut = useAddtoCart();
  const wishlistMut = useAddToWishlist();
  const [qty, setQty] = useState(1);
  const [showPopup, setShowPopup] = useState(false);
  const productId = product?.product_id || product?.id;

  const isPending = addToCartMut.isPending;

  const { data: wishlistCheckData } = useCheckWishlist(productId);
  const isInWishlist = Boolean(
    wishlistCheckData?.data?.inWishlist ?? wishlistCheckData?.inWishlist,
  );

  const productLink = product.seo_url
    ? `/${product.seo_url}`
    : `/${product.product_id}`;
  const productImage = product.image
    ? `https://www.dcwineandspirits.com/image/${product.image}`
    : "/prosecco-gift-800x800.webp";
  const brandName = product.manufacturer?.name || "";
  const displayPrice = product.special_price || product.price;
  const hasDiscount =
    product.special_price &&
    Number(product.special_price) < Number(product.price);
  const discountPercent = hasDiscount
    ? Math.round(
        ((Number(product.price) - Number(product.special_price)) /
          Number(product.price)) *
          100,
      )
    : 0;
  const isOutOfStock = product.in_stock === false;

  const handleAddToCart = async (e) => {
    e?.stopPropagation?.();
    if (!productId || isPending || isOutOfStock) return;
    try {
      const res = await addToCartMut.mutateAsync({
        product_id: productId,
        quantity: Math.max(1, Number(qty) || 1),
      });
      if (res?.success) {
        setShowPopup(true);
      }
    } catch (e) {}
  };

  const handleAddToWishlist = async (e) => {
    e?.stopPropagation?.();
    if (!productId || wishlistMut.isPending || isInWishlist) return;
    try {
      await wishlistMut.mutateAsync(productId); // 👈 object hata diya
      toast.success("Added to wishlist");
    } catch (e) {
      toast.error("Couldn't update wishlist — please try again");
    }
  };

  return (
    <div className="group flex flex-col sm:flex-row gap-4 py-6 border-b border-gray-200 relative">
      <AddToCartPopup
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
        product={product}
      />

      <Link
        href={productLink}
        className="relative w-full aspect-square sm:w-[220px] sm:h-[220px] sm:aspect-auto flex-shrink-0 bg-white flex items-center justify-center group/img"
      >
        <img
          src={productImage}
          alt={product.name}
          loading="lazy"
          className={`max-w-full max-h-full object-contain ${isOutOfStock ? "opacity-50" : ""}`}
        />

        {isOutOfStock && (
          <div className="absolute top-0 left-0 w-24 h-24 overflow-hidden z-10 pointer-events-none">
            <span className="absolute top-[18px] left-[-38px] w-[150px] text-center bg-gradient-to-r from-gray-900 to-gray-700 text-white text-[11px] font-bold uppercase tracking-wider py-1 shadow-md -rotate-45">
              Out of Stock
            </span>
          </div>
        )}

        {hasDiscount && !isOutOfStock && (
          <span className="absolute top-2 left-2 bg-[#98022e] text-white text-xs font-bold px-2 py-1 rounded-full opacity-100 ">
            -{discountPercent}%
          </span>
        )}

        <span className="absolute bottom-3 left-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-black/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <Search size={16} />
        </span>
      </Link>

      <div
        className={`flex-1 flex flex-col justify-center ${hindMadurai.className} px-2 lg:px-0`}
      >
        {brandName && (
          <p className="text-sm text-gray-700">
            Brand:{" "}
            <Link
              href={`/${brandName.toLowerCase().replace(/\s+/g, "-")}`}
              className="text-[#98022e] font-semibold hover:underline"
            >
              {decodeHtml(brandName)}
            </Link>
          </p>
        )}

        <Link href={productLink}>
          <h2
            title={decodeHtml(product.name)}
            className="mt-1 text-xl sm:text-2xl text-[#333333] hover:text-[#98022e] transition-colors line-clamp-2 cursor-pointer"
          >
            {decodeHtml(product.name)}
          </h2>
        </Link>

        <div className="mt-3 flex items-center gap-2">
          <p className={`${sumana.className} text-2xl font-bold text-black`}>
            ${Number(displayPrice).toFixed(2)}
          </p>
          {hasDiscount && (
            <p
              className={`${sumana.className} text-base text-gray-400 line-through`}
            >
              ${Number(product.price).toFixed(2)}
            </p>
          )}
        </div>

        <div className="mt-4 flex items-center gap-2 sm:gap-3 w-full">
          <div className="flex items-center border border-gray-300 bg-white flex-shrink-0">
            <input
              type="number"
              min={1}
              value={qty}
              onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
              className="w-12 sm:w-14 text-center outline-none py-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <div className="flex flex-col border-l border-gray-300">
              <button
                type="button"
                onClick={() => setQty((q) => q + 1)}
                className="px-2 hover:bg-gray-100 cursor-pointer"
                aria-label="Increase quantity"
              >
                <ChevronUp size={14} />
              </button>
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="px-2 hover:bg-gray-100 border-t border-gray-300 cursor-pointer"
                aria-label="Decrease quantity"
              >
                <ChevronDown size={14} />
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isPending || !productId || isOutOfStock}
            className="flex-1 flex items-center justify-center gap-2 bg-[#98022e] hover:bg-[#7a0225] text-white font-bold uppercase tracking-wide text-xs sm:text-sm px-3 sm:px-5 py-2.5 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingBag size={16} />
            {isOutOfStock
              ? "Out of Stock"
              : isPending
                ? "Adding..."
                : "Add to Cart"}
          </button>

          <button
            type="button"
            onClick={handleAddToWishlist}
            disabled={wishlistMut.isPending || !productId || isInWishlist}
            aria-label={isInWishlist ? "Added to wishlist" : "Add to wishlist"}
            aria-pressed={isInWishlist}
            title={isInWishlist ? "Added to wishlist" : "Add to wishlist"}
            className={`group w-10 h-10 flex-shrink-0 flex items-center justify-center border transition-all duration-200 cursor-pointer  disabled:cursor-not-allowed ${
              isInWishlist
                ? "bg-[#98022e] border-[#98022e] text-white"
                : "bg-white border-gray-300 text-gray-600 hover:border-[#98022e] hover:text-[#98022e]"
            }`}
          >
            {wishlistMut.isPending ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Heart
                size={16}
                fill={isInWishlist ? "currentColor" : "none"}
                className={`transition-transform duration-200 ${
                  isInWishlist ? "scale-110" : "group-hover:scale-110"
                }`}
              />
            )}
          </button>

          <button
            type="button"
            aria-label="Compare"
            className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-black text-white hover:bg-[#98022e] transition-colors cursor-pointer"
          >
            <Repeat size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
const ProductGridCard = ({ product }) => {
  const { mutate: addtoCart, isPending } = useAddtoCart();
  const wishlistMut = useAddToWishlist();
  const [showPopup, setShowPopup] = useState(false);
  const productLink = product.seo_url
    ? `/${product.seo_url}`
    : `/${product.product_id}`;
  const productImage = product.image
    ? `https://www.dcwineandspirits.com/image/${product.image}`
    : "/prosecco-gift-800x800.webp";
  const displayPrice = product.special_price || product.price;
  const hasDiscount =
    product.special_price &&
    Number(product.special_price) < Number(product.price);
  const discountPercent = hasDiscount
    ? Math.round(
        ((Number(product.price) - Number(product.special_price)) /
          Number(product.price)) *
          100,
      )
    : 0;
  const isOutOfStock = product.in_stock === false;

  const { data: wishlistCheckData } = useCheckWishlist(product?.product_id);
  const isInWishlist = Boolean(
    wishlistCheckData?.data?.inWishlist ?? wishlistCheckData?.inWishlist,
  );

  const handleAddtoCart = (e, product_id) => {
    e?.stopPropagation?.();
    e?.preventDefault?.();
    if (isOutOfStock) return;
    addtoCart(product_id, {
      onSuccess: (data) => {
        setShowPopup(true);
      },
    });
  };

  const handleAddToWishlist = async (e) => {
    e?.stopPropagation?.();
    e?.preventDefault?.();
    if (!product?.product_id || wishlistMut.isPending || isInWishlist) return;
    try {
      await wishlistMut.mutateAsync(product.product_id);
      toast.success("Added to wishlist");
    } catch (e) {
      toast.error("Couldn't update wishlist — please try again");
    }
  };

  return (
    <div className="group h-full flex flex-col items-center text-center bg-white border border-gray-200 p-5 relative">
      <AddToCartPopup
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
        product={product}
      />


      {isOutOfStock && (
          <div className="absolute top-0 left-0 w-24 h-24 overflow-hidden z-10 pointer-events-none">
            <span className="absolute top-[18px] left-[-38px] w-[150px] text-center bg-gradient-to-r from-gray-900 to-gray-700 text-white text-[11px] font-bold uppercase tracking-wider py-1 shadow-md -rotate-45">
              Out of Stock
            </span>
          </div>
        )}


        {hasDiscount && !isOutOfStock && (
          <span className="absolute top-2 left-3 z-10 bg-[#98022e] text-white text-[10px] font-semibold px-2 py-1 rounded-xl">
            -{discountPercent}%
          </span>
        )}

      <Link
        href={productLink}
        className="relative w-full h-[200px] flex items-center justify-center flex-shrink-0"
      >
        <img
          src={productImage}
          alt={decodeHtml(product.name)}
          loading="lazy"
          className={`max-w-full max-h-full object-contain ${isOutOfStock ? "opacity-50" : ""}`}
        />

        

        

        {/* Wishlist — bottom-right corner badge, mobile & tablet only */}
        <button
          type="button"
          onClick={handleAddToWishlist}
          disabled={wishlistMut.isPending || isInWishlist}
          aria-label={isInWishlist ? "Added to wishlist" : "Add to wishlist"}
          aria-pressed={isInWishlist}
          title={isInWishlist ? "Added to wishlist" : "Add to wishlist"}
          className={`group/heart lg:hidden absolute bottom-2 right-2 z-10 w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-all duration-200 disabled:opacity-90 disabled:cursor-not-allowed cursor-pointer ${
            isInWishlist
              ? "bg-[#98022e] text-white"
              : "bg-white/90 text-gray-500 hover:text-[#98022e]"
          }`}
        >
          {wishlistMut.isPending ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Heart
              size={14}
              fill={isInWishlist ? "currentColor" : "none"}
              className={`transition-transform duration-200 ${
                isInWishlist ? "scale-110" : "group-hover/heart:scale-110"
              }`}
            />
          )}
        </button>
      </Link>

      <Link href={productLink} className={`${hindMadurai.className} w-full`}>
        <h2
          title={decodeHtml(product.name)}
          className="mt-4 text-[16px] leading-[1.4] text-[#1c2b4b] hover:text-[#98022e] transition-colors line-clamp-2 overflow-hidden h-[2.8em] mb-1 cursor-pointer"
        >
          {decodeHtml(product.name)}
        </h2>
      </Link>

      <div
        className={`${hindMadurai.className} mt-2 flex items-center justify-center gap-2 font-sarabun`}
      >
        <p className="text-base text-gray-700 font-semibold">
          ${Number(displayPrice).toFixed(2)}
        </p>
        {hasDiscount && (
          <p className="text-sm text-gray-400 line-through">
            ${Number(product.price).toFixed(2)}
          </p>
        )}
      </div>

      {/* Button row — desktop shows Add to Cart + Wishlist side by side */}
      <div className="mt-2 w-[90%] flex items-center gap-2">
        <button
          type="button"
          onClick={() => handleAddtoCart(null, product?.product_id)}
          disabled={isOutOfStock}
          className={`${hindMadurai.className} flex-1 bg-black hover:bg-gray-800 text-white font-bold uppercase tracking-wide text-sm py-1.5 lg:py-2 transition-all cursor-pointer hover:rounded-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:rounded-none`}
        >
          <span className="text-[12px]">
            {isOutOfStock ? "Out of Stock" : "Add to Cart"}
          </span>
        </button>

        {/* Wishlist — desktop only, next to Add to Cart */}
        <button
          type="button"
          onClick={handleAddToWishlist}
          disabled={wishlistMut.isPending || isInWishlist}
          aria-label={isInWishlist ? "Added to wishlist" : "Add to wishlist"}
          aria-pressed={isInWishlist}
          title={isInWishlist ? "Added to wishlist" : "Add to wishlist"}
          className={`group hidden lg:flex w-9 h-9 flex-shrink-0 items-center justify-center border transition-all duration-200 cursor-pointer disabled:cursor-not-allowed ${
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
              className={`transition-transform duration-200 ${
                isInWishlist ? "scale-110" : "group-hover:scale-110"
              }`}
            />
          )}
        </button>
      </div>
    </div>
  );
};
const ProductsDynamicMain = ({
  data,
  sort,
  onSortChange,
  limit,
  onLimitChange,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
}) => {
  const [layout, setLayout] = useState("grid");
  const sentinelRef = useRef(null);

  const products = data.products?.items || [];

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: "400px" },
    );
  }, []);

  return (
    <section className="w-full min-w-0 bg-white flex-1">
      <SmallDescAndSubcategory
        smalldesc={data.smalldesc}
        subCategories={data.subCategories}
      />

      <div className="w-full py-4 flex justify-between items-center bg-[#f2f2f2] mt-2 px-2 border-gray-200">
        <div className="flex items-center gap-3">
          <button
            title="Grid View"
            type="button"
            onClick={() => setLayout("grid")}
            aria-label="Grid view"
            className={`cursor-pointer transition-colors ${
              layout === "grid"
                ? "text-[#98022e]"
                : "text-black hover:text-[#98022e]"
            }`}
          >
            <RiGridFill size={20} />
          </button>
          <button
            title="List View"
            type="button"
            onClick={() => setLayout("list")}
            aria-label="List view"
            className={`cursor-pointer transition-colors ${
              layout === "list"
                ? "text-[#98022e]"
                : "text-black hover:text-[#98022e]"
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
              value={sort}
              onChange={(e) => onSortChange(e.target.value)}
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
              value={limit}
              onChange={(e) => onLimitChange(Number(e.target.value))}
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

      {products.length === 0 ? (
        <div className="w-full py-20 text-center text-gray-400 font-semibold text-lg">
          No products found.
        </div>
      ) : (
        <>
          {layout === "list" ? (
            <div>
              {products.map((product, i) => (
                <ProductListRow
                  key={product.product_id ?? i}
                  product={product}
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-6 items-stretch">
              {products.map((product, i) => (
                <ProductGridCard
                  key={product.product_id ?? i}
                  product={product}
                />
              ))}
            </div>
          )}

          <div ref={sentinelRef} className="h-1 w-full" />

          {!hasNextPage && products.length > 0 && (
            <div className="w-full py-8 text-center text-gray-400 text-sm">
              You've reached the end.
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default ProductsDynamicMain;
