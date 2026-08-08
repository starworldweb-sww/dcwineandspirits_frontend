"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  ChevronUp,
  ChevronDown,
  Heart,
  Repeat,
  ShoppingBag,
} from "lucide-react";
import { Logs } from "lucide-react";
import { RiGridFill } from "react-icons/ri";
import { Sumana, Hind_Madurai } from "next/font/google";
import { useAddtoCart } from "@/app/api/hooks/cart/useAddtoCart";
import { toast } from "sonner";
import { decodeHtml } from "@/libs/decodeHtml";

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
  const productLink = product.seo_url ? `/${product.seo_url}` : `/${product.product_id}`;
  const productImage = product.image 
    ? `https://www.dcwineandspirits.com/image/${product.image}` 
    : "/prosecco-gift-800x800.webp";
  const brandName = product.manufacturer?.name || "";
  const displayPrice = product.special_price || product.price;

  return (
    <div className="flex flex-col sm:flex-row gap-4 py-6 border-b border-gray-200">
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
              {brandName}
            </Link>
          </p>
        )}

        <Link href={productLink}>
          <h2 className="mt-1 text-xl sm:text-2xl text-[#333333] hover:text-[#98022e] transition-colors">
            {product.name}
          </h2>
        </Link>

        <p className={`${sumana.className} mt-3 text-2xl font-bold text-black`}>
          ${Number(displayPrice).toFixed(2)}
        </p>
      </div>
    </div>
  );
};

const ProductGridCard = ({ product }) => {
  const {mutate:addtoCart } =  useAddtoCart()
  const productLink = product.seo_url ? `/${product.seo_url}` : `/${product.product_id}`;
  const productImage = product.image 
    ? `https://www.dcwineandspirits.com/image/${product.image}` 
    : "/prosecco-gift-800x800.webp";
  const displayPrice = product.special_price || product.price;

  const handleAddtoCart = (product_id)=>{
 
   addtoCart(product_id,{
    onSuccess:(data)=>{
      toast.success(data?.message || "Add to Cart Successful ")
    }
   })
  }

  return (
    <div className="h-full flex flex-col items-center text-center bg-white border border-gray-200 p-5">
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
        <h2 className="mt-4 text-lg text-[#1c2b4b] hover:text-[#98022e] transition-colors leading-snug line-clamp-2 min-h-[3.2em] flex items-center justify-center">
          {decodeHtml(product.name)}
        </h2>
      </Link>

      <p className={`${hindMadurai.className} mt-2 text-base text-gray-400`}>
        ${Number(displayPrice).toFixed(2)}
      </p>

      <button
        type="button"
        onClick={()=>handleAddtoCart(product?.product_id)}
        className={`${hindMadurai.className} mt-auto w-full bg-black hover:bg-gray-800 text-white font-bold uppercase tracking-wide text-sm py-3 transition-colors cursor-pointer hover:rounded-xl`}
      >
        Add to Cart
      </button>
    </div>
  );
};

const ProductsDynamicMain = ({ data }) => {
  const [layout, setLayout] = useState("grid");
  const [sortOption, setSortOption] = useState("");
  const [showNum, setShowNum] = useState(24);

  const products = data.products || [];

  const sortedProducts = useMemo(() => {
    if (!products.length) return [];
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
        return sorted;
    }
  }, [products, sortOption]);

  const displayedProducts = sortedProducts.slice(0, showNum);

  return (
    <section className="w-full bg-white flex-1">
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

      {displayedProducts.length === 0 ? (
        <div className="w-full py-20 text-center text-gray-400 font-semibold text-lg">
          No products found.
        </div>
      ) : layout === "list" ? (
        <div>
          {displayedProducts.map((product) => (
            <ProductListRow key={product.product_id} product={product} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-6 items-stretch">
          {displayedProducts.map((product) => (
            <ProductGridCard key={product.product_id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
};

export default ProductsDynamicMain;
