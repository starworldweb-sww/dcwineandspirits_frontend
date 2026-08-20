"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  ChevronUp,
  ChevronDown,
  Heart,
  Repeat,
  ShoppingBag,
  Loader2,
} from "lucide-react";
import { Logs } from "lucide-react";
import { RiGridFill } from "react-icons/ri";
import { Sumana, Hind_Madurai } from "next/font/google";
import { useAddtoCart } from "@/app/api/hooks/cart/useAddtoCart";
import { toast } from "sonner";
import { decodeHtml } from "@/libs/decodeHtml";
import SmallDescAndSubcategory from "./SmallDescAndSubcategory";
import AddToCartPopup from "@/app/components/popups/AddToCartPopUp";

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

// NOTE: "name_desc" has no matching branch in the backend's getCategoryData
// sort switch (only price_asc/price_desc/name_asc are handled, anything else
// falls through to the unsorted default). Either add a name_desc branch on
// the backend, or drop this option until it does — leaving it in as-is means
// picking "Name (Z - A)" silently does nothing.
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
  const [qty, setQty] = useState(1);
  // 2. Popup ke liye local state — sirf isi row ke liye control karta hai
  const [showPopup, setShowPopup] = useState(false);
  const productId = product?.product_id || product?.id;
  const isPending = addToCartMut.isPending;

  const productLink = product.seo_url ? `/${product.seo_url}` : `/${product.product_id}`;
  const productImage = product.image
    ? `https://www.dcwineandspirits.com/image/${product.image}`
    : "/prosecco-gift-800x800.webp";
  const brandName = product.manufacturer?.name || "";
  const displayPrice = product.special_price || product.price;




  const handleAddToCart = async (e) => {
    e?.stopPropagation?.();
    if (!productId || isPending) return;
    try {
      const res = await addToCartMut.mutateAsync({
        product_id: productId,
        quantity: Math.max(1, Number(qty) || 1),
      });
      if (res?.success) {
        toast.success(res.message || "Added to cart!");
        // 3. Success hote hi popup dikhao
        setShowPopup(true);
      }
    } catch (e) { }
  };
  // Related products nikalne ka helper — same brand ke 2 products, current ko exclude karke

  return (
    <div className="flex flex-col sm:flex-row gap-4 py-6 border-b border-gray-200">
      {/* 4. Popup render — fixed positioned hai, layout pe asar nahi padega */}
      <AddToCartPopup
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
        product={product}


      />

      <Link
        href={productLink}
        className="relative w-full aspect-square sm:w-[220px] sm:h-[220px] sm:aspect-auto flex-shrink-0 bg-white flex items-center justify-center group"
      >
        <img
          src={productImage}
          alt={product.name}
          loading="lazy"
          className="max-w-full max-h-full object-contain"
        />
        <span className="absolute bottom-3 left-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-black/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <Search size={16} />
        </span>
      </Link>

      <div className={`flex-1 flex flex-col justify-center ${hindMadurai.className}`}>
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
          <h2 className="mt-1 text-xl sm:text-2xl text-[#333333] hover:text-[#98022e] transition-colors">
            {decodeHtml(product.name)}
          </h2>
        </Link>

        <p className={`${sumana.className} mt-3 text-2xl font-bold text-black`}>
          ${Number(displayPrice).toFixed(2)}
        </p>

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
            disabled={isPending || !productId}
            className="flex-1 flex items-center justify-center gap-2 bg-[#98022e] hover:bg-[#7a0225] text-white font-bold uppercase tracking-wide text-xs sm:text-sm px-3 sm:px-5 py-2.5 transition-colors cursor-pointer disabled:opacity-50"
          >
            <ShoppingBag size={16} />
            {isPending ? "Adding..." : "Add to Cart"}
          </button>

          <button type="button" aria-label="Add to wishlist" className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-black text-white hover:bg-[#98022e] transition-colors cursor-pointer">
            <Heart size={16} />
          </button>
          <button type="button" aria-label="Compare" className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-black text-white hover:bg-[#98022e] transition-colors cursor-pointer">
            <Repeat size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

const ProductGridCard = ({ product }) => {
  const { mutate: addtoCart } = useAddtoCart();
  // 5. Grid card ke liye bhi apna local popup state
  const [showPopup, setShowPopup] = useState(false);
  const productLink = product.seo_url ? `/${product.seo_url}` : `/${product.product_id}`;
  const productImage = product.image
    ? `https://www.dcwineandspirits.com/image/${product.image}`
    : "/prosecco-gift-800x800.webp";
  const displayPrice = product.special_price || product.price;

  const handleAddtoCart = (product_id) => {
    addtoCart(product_id, {
      onSuccess: (data) => {

        setShowPopup(true);
      },
    });
  };

  return (
    <div className="h-full flex flex-col items-center text-center bg-white border border-gray-200 p-5">
      {/* 7. Popup render */}
      <AddToCartPopup
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
        product={product}
      />

      <Link
        href={productLink}
        className="w-full h-[200px] flex items-center justify-center flex-shrink-0"
      >
        <img
          src={productImage}
          alt={decodeHtml(product.name)}
          loading="lazy"
          className="max-w-full max-h-full object-contain"
        />
      </Link>

      <Link href={productLink} className={`${hindMadurai.className} w-full`}>
        <h2 className="mt-4 text-[16px] text-[#1c2b4b] hover:text-[#98022e] transition-colors leading-snug line-clamp-2 min-h-[3.2em] flex items-center justify-center">
          {decodeHtml(product.name)}
        </h2>
      </Link>

      <p className={`${hindMadurai.className} mt-2 text-base text-gray-400`}>
        ${Number(displayPrice).toFixed(2)}
      </p>

      <button
        type="button"
        onClick={() => handleAddtoCart(product?.product_id)}
        className={`${hindMadurai.className} mt-auto w-full bg-black hover:bg-gray-800 text-white font-bold uppercase tracking-wide text-sm py-3 transition-all cursor-pointer hover:rounded-xl`}
      >
        Add to Cart
      </button>
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

  // infinite scroll: observe a sentinel div at the bottom of the list and
  // fetch the next page once it's in view. Guarded so we never fire while
  // already fetching, or once there's nothing left to fetch.
  useEffect(() => {
    
      const node = sentinelRef.current;
      if (!node || !hasNextPage) return;

      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        },
        { rootMargin: "400px" } // start loading a bit before the user hits bottom
      );
    },[])

    const displayedProducts = sortedProducts.slice(0, showNum);

    return (
      <section className="w-full bg-white flex-1">
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
              className={`cursor-pointer transition-colors ${layout === "grid" ? "text-[#98022e]" : "text-black hover:text-[#98022e]"
                }`}
            >
              <RiGridFill size={20} />
            </button>
            <button
              title="List View"
              type="button"
              onClick={() => setLayout("list")}
              aria-label="List view"
              className={`cursor-pointer transition-colors ${layout === "list" ? "text-[#98022e]" : "text-black hover:text-[#98022e]"
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
                  <ProductListRow key={product.product_id ?? i} product={product} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-6 items-stretch">
                {products.map((product, i) => (
                  <ProductGridCard key={product.product_id ?? i} product={product} />
                ))}
              </div>
            )}

            {/* sentinel — observed to trigger fetchNextPage */}
            <div ref={sentinelRef} className="h-1 w-full" />
            {/* 
          {isFetchingNextPage && (
            <div className="w-full py-8 flex items-center justify-center text-gray-400 gap-2">
              <Loader2 size={18} className="animate-spin" />
              <span className="text-sm">Loading more...</span>
            </div>
          )} */}

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