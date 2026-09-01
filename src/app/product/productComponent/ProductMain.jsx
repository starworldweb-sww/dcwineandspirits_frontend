"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Check,
  Dot,
  X,
  ChevronUp,
  ChevronDown,
  Heart,
  Repeat,
  ShoppingBag,
  Gift,
  Truck,
  Download,
  HelpCircle,
  Star,
  Tag,
  Upload,
} from "lucide-react";
import { Sumana, Hind_Madurai } from "next/font/google";
import ProductsHeader from "../../components/TittleAndBreadcrumb";
import { useAddtoCart } from "@/app/api/hooks/cart/useAddtoCart";
import { useCheckWishlist } from "@/app/api/hooks/wishlist/useCheckWishlist";
import { toast } from "sonner";
import Link from "next/link";
import AddToWishlistPopup from "@/app/components/popups/AddToWishlistPopUp";
import AddToCartPopup from "@/app/components/popups/AddToCartPopUp";
import { useAddToWishlist } from "@/app/api/hooks/wishlist/useAddToWishlist";
import { addRecentProduct } from "@/libs/recentProducts";
import { useCompareList } from "@/app/api/hooks/useCompareProducts";


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

const IMAGE_BASE = "https://www.dcwineandspirits.com/image/";

const getImageUrl = (path) => {
  if (!path) return "/prosecco-gift-800x800.webp";
  if (path.startsWith("http")) return path;
  const cleanBase = (IMAGE_BASE || "").replace(/\/$/, "");
  const cleanPath = path.replace(/^\//, "");
  return `${cleanBase}/${cleanPath}`;
};

const decodeHtml = (str) => {
  if (typeof window === "undefined" || !str) return str ?? "";
  const txt = document.createElement("textarea");
  txt.innerHTML = String(str);
  return txt.value;
};

export default function ProductMain({ product }) {
  const [stock] = useState(product.quantity > 0);
  const productImage = getImageUrl(product.image);
  const [mainImage, setMainImage] = useState(productImage);
  const [isImageHovered, setIsImageHovered] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState("center center");
  const [quantity, setQuantity] = useState(1);

  const rawOptions = Array.isArray(product.options) ? product.options : [];

  const initialOptionValues = useMemo(() => {
    const init = {};
    rawOptions.forEach((opt) => {
      const key = String(opt.product_option_id);
      const hasValues = Array.isArray(opt.values) && opt.values.length > 0;
      if (hasValues) {
        const firstValue = opt.values[0];
        init[key] =
          firstValue?.product_option_value_id != null
            ? String(firstValue.product_option_value_id)
            : "";
      } else {
        init[key] = opt.text_value != null ? String(opt.text_value) : "";
      }
    });
    return init;
  }, [rawOptions]);

  const [optionValues, setOptionValues] = useState(initialOptionValues);
  const [fileNames, setFileNames] = useState({});

  useEffect(() => {
    setOptionValues(initialOptionValues);
  }, [initialOptionValues]);

  const [showWishlistPopup, setShowWishlistPopup] = useState(false);
  const [showCartPopup, setShowCartPopup] = useState(false);
  const addToCartMut = useAddtoCart();
  const isAddingToCart = addToCartMut.isPending;

  const productId = product?.product_id || product?.id;
  const addToWishlistMut = useAddToWishlist();
  const isAddingToWishlist = addToWishlistMut.isPending;

  const { data: wishlistCheckData } = useCheckWishlist(productId);
  const isInWishlist = Boolean(
    wishlistCheckData?.data?.inWishlist ?? wishlistCheckData?.inWishlist,
  );

  const { compareIds, addProduct, removeProduct } = useCompareList();
  const productSlug = product?.seo_url;
  const isInCompare = compareIds.includes(productSlug);

  const reviews = Array.isArray(product.reviews) ? product.reviews : [];
  const reviewCount = product.review_count ?? reviews.length;
  const averageRating = product.average_rating || 0;

  const productImages =
    product.images
      ?.map((img) => getImageUrl(typeof img === "string" ? img : img.image))
      .filter((u) => u && u !== "/prosecco-gift-800x800.webp") || [];

  const allImages = productImages.length
    ? [productImage, ...productImages]
    : [productImage];

  const hasMultipleImages = allImages.length > 1;

  const originalPrice = product.price;
  const specialPrice = product.special_price;
  const hasSpecialPrice = specialPrice !== null && specialPrice !== undefined && specialPrice !== "";

  const discountPercent = hasSpecialPrice
    ? Math.round(
        ((Number(originalPrice) - Number(specialPrice)) / Number(originalPrice)) * 100,
      )
    : 0;

  const brandName = product.manufacturer?.name || "";
  const brandurl = product.manufacturer?.manufacturer_seo_url || "";
  const brandImage = product.manufacturer?.image
    ? getImageUrl(product.manufacturer.image)
    : "";

  const tagsRaw = product.tag
    ? String(product.tag)
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    : [];

  const handleImageChange = (clickedImage) => {
    setMainImage(clickedImage);
    setIsImageHovered(false);
    setZoomOrigin("center center");
  };

  const handleImageMove = (e) => {
    const imageBox = e.currentTarget.getBoundingClientRect();
    const mouseXPercent = ((e.clientX - imageBox.left) / imageBox.width) * 100;
    const mouseYPercent = ((e.clientY - imageBox.top) / imageBox.height) * 100;
    setZoomOrigin(`${mouseXPercent}% ${mouseYPercent}%`);
  };

  const setOptionValue = (productOptionId, value) => {
    setOptionValues((prev) => ({
      ...prev,
      [String(productOptionId)]: value == null ? "" : String(value),
    }));
  };

  const buildOptionPayload = () => {
    const payload = {};
    rawOptions.forEach((opt) => {
      const key = String(opt.product_option_id);
      const userValue = optionValues[key];
      const hasValues = Array.isArray(opt.values) && opt.values.length > 0;
      const optionType = String(opt.type || opt.option_type || "")
        .toLowerCase()
        .trim();

      if (optionType === "checkbox" && hasValues) {
        const ids = Array.isArray(userValue)
          ? userValue.map((v) => String(v))
          : userValue
            ? String(userValue).split(",").filter(Boolean)
            : [];
        const selectedItems = opt.values.filter((v) =>
          ids.includes(String(v.product_option_value_id)),
        );
        if (selectedItems.length > 0) {
          payload[key] = selectedItems.map((v) => v.name).join(", ")
        }
        return;
      }

      if (optionType === "radio" && hasValues) {
        if (!userValue) return;
        const selected = opt.values.find(
          (v) => String(v.product_option_value_id) === String(userValue),
        );
        payload[key] = userValue
        return;
      }

      if (optionType === "select" || (optionType === "" && hasValues)) {
        if (!userValue) return;
        const selected = opt.values.find(
          (v) => String(v.product_option_value_id) === String(userValue),
        );
        payload[key] = userValue
        return;
      }

      if (optionType === "file") {
        if (!userValue) return;
        payload[key] = userValue
        return;
      }

      if (userValue != null && String(userValue).trim() !== "") {
        payload[key] = userValue
      }
    });
    return payload;
  };

  const validateOptions = () => {
    for (const opt of rawOptions) {
      if (opt.required) {
        const key = String(opt.product_option_id);
        const v = optionValues[key];
        if (v == null || String(v).trim() === "") {
          toast.error(`${opt.name} is required`);
          return false;
        }
      }
    }
    return true;
  };

  const handleAddToCartClick = async () => {
    if (!productId || isAddingToCart || !stock) return;
    if (!validateOptions()) return;

    try {
      const optionPayload = buildOptionPayload();
      console.log("optionPayload",optionPayload)
      const res = await addToCartMut.mutateAsync({
        product_id: productId,
        quantity: Math.max(1, Number(quantity) || 1),
        option: optionPayload,
      });
      if (res?.success) {
        setShowCartPopup(true);
      }
    } catch (e) {}
  };

  const handleAddToWishlistClick = async () => {
    if (!productId || isAddingToWishlist || isInWishlist) return;
    try {
      await addToWishlistMut.mutateAsync(productId);
      setShowWishlistPopup(true);
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed to add to wishlist");
    }
  };

  const handleToggleCompare = () => {
    if (!productSlug) return;
    if (isInCompare) {
      removeProduct(productSlug);
      toast.success("Removed from compare");
    } else {
      addProduct(productSlug);
      toast.success("Added to compare");
    }
  };

  const handleWriteReviewClick = () => {
    const reviewSection = document.getElementById("product-review-section");
    if (reviewSection) reviewSection.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (product?.product_id) {
      addRecentProduct(product);
    }
  }, [product]);

  const sanitizedName = decodeHtml(product.name);

  return (
    <>
      <ProductsHeader categoryName={sanitizedName} />

      <AddToWishlistPopup
        isOpen={showWishlistPopup}
        onClose={() => setShowWishlistPopup(false)}
        product={{ ...product, image: productImage }}
      />

      <AddToCartPopup
        isOpen={showCartPopup}
        onClose={() => setShowCartPopup(false)}
        product={{ ...product, image: productImage }}
      />

      <main className={` w-full bg-white ${hindMadurai.className}`}>
        <section className="bg-white px-3 2xl:px-32 py-6">
          <div className="flex flex-col lg:flex-row lg:items-stretch gap-8">
            <div className="w-full lg:w-auto flex flex-row gap-3 lg:gap-4">
              {hasMultipleImages && (
                <div className="flex flex-col gap-3 w-14 sm:w-16 lg:w-20 flex-shrink-0">
                  {allImages.map((imageUrl, index) => (
                    <div
                      key={`${imageUrl}-${index}`}
                      onClick={() => handleImageChange(imageUrl)}
                      className={`w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 border-2 cursor-pointer overflow-hidden bg-white p-1 transition-all ${
                        mainImage === imageUrl
                          ? "border-[#98022e]"
                          : "border-gray-200"
                      }`}
                    >
                      <img
                        src={imageUrl}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover object-center"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* ============================================================
                  FIX: "lg:h-full" hata diya — parent ki koi definite height
                  set nahi thi, isliye percentage height (h-full) browser mein
                  unpredictable resolve ho rahi thi aur poore section ki
                  height bahut zyada ban rahi thi, jisse neeche bada khaali
                  gap dikh raha tha. Ab fixed "lg:h-[486px]" use kiya hai —
                  ye definite value hai, koi ambiguity nahi.
              ============================================================ */}
              <div
                onMouseEnter={() => setIsImageHovered(true)}
                onMouseMove={handleImageMove}
                onMouseLeave={() => {
                  setIsImageHovered(false);
                  setZoomOrigin("center center");
                }}
                className={`relative w-full min-w-0 lg:flex-none flex justify-center items-center bg-white border border-gray-200 overflow-hidden cursor-zoom-in aspect-square lg:aspect-auto lg:h-[486px] ${
                  hasMultipleImages ? "lg:w-[486px]" : "lg:w-[582px]"
                }`}
              >
                {hasSpecialPrice && discountPercent > 0 && (
                  <>
                    <style jsx>{`
                      @keyframes discountPopIn {
                        0% {
                          opacity: 0;
                          transform: scale(0.3) rotate(-8deg);
                        }
                        60% {
                          opacity: 1;
                          transform: scale(1.15) rotate(2deg);
                        }
                        100% {
                          opacity: 1;
                          transform: scale(1) rotate(0deg);
                        }
                      }
                      .discount-badge {
                        animation: discountPopIn 0.5s ease-out;
                      }
                    `}</style>
                    <span className="discount-badge absolute top-2 right-2 z-10 bg-[#98022e] text-white text-xs sm:text-sm font-bold px-2 py-1 rounded-sm shadow-md">
                      {discountPercent}% OFF
                    </span>
                  </>
                )}

                <img
                  src={mainImage}
                  alt={sanitizedName}
                  draggable={false}
                  className="w-full h-full object-contain object-center select-none will-change-transform"
                  style={{
                    transform: isImageHovered ? "scale(2.2)" : "scale(1)",
                    transformOrigin: zoomOrigin,
                    transition: isImageHovered
                      ? "transform 120ms ease-out"
                      : "transform 220ms ease-out",
                  }}
                />
              </div>
            </div>

            <div className="w-full flex-1 min-w-0 flex flex-col justify-between">
              <div className="bg-[#f8f8f8] p-5 sm:p-6 lg:min-h-[486px]">

                <div className="sm:hidden pb-4 border-b border-gray-200">
                  <div className="flex items-center justify-between gap-4">
                    <div className={`${sumana.className}`}>
                      {hasSpecialPrice ? (
                        <div className="flex flex-col">
                          <span className="relative inline-block w-fit font-semibold text-base text-[#98022e]">
                            <span className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px bg-[#98022e]" />
                            ${Number(originalPrice).toFixed(2)}
                          </span>
                          <strong className="font-bold text-2xl text-black">
                            ${Number(specialPrice).toFixed(2)}
                          </strong>
                        </div>
                      ) : (
                        <strong className="font-bold text-2xl text-black">
                          ${Number(originalPrice).toFixed(2)}
                        </strong>
                      )}
                    </div>

                    {brandName && (
                      <div className="w-[90px] h-[50px] flex-shrink-0 flex items-center justify-center bg-white border border-gray-200">
                        <Link
                          href={`/${brandurl}`}
                          className="w-full h-full flex items-center justify-center p-1.5"
                        >
                          {brandImage ? (
                            <img
                              src={brandImage}
                              alt={brandName}
                              className="max-w-full max-h-full object-contain"
                            />
                          ) : (
                            <span className="text-[10px] tracking-widest text-gray-700 text-center px-2">
                              {brandName}
                            </span>
                          )}
                        </Link>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5 text-sm mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-1">
                      {stock ? (
                        <Check className="text-green-500" size={16} strokeWidth={3} />
                      ) : (
                        <X className="text-red-500" size={16} strokeWidth={2.5} />
                      )}
                      <span
                        className={
                          stock ? "text-green-600 font-bold" : "text-red-600 font-bold"
                        }
                      >
                        {stock ? "IN STOCK" : "OUT OF STOCK"}
                      </span>
                    </div>
                    <span className="text-gray-600">Model: {product.model}</span>
                    {product.sku && (
                      <span className="text-gray-600 break-words">
                        SKU: {product.sku}
                      </span>
                    )}
                    {product.upc && (
                      <span className="text-gray-600">UPC: {product.upc}</span>
                    )}
                  </div>
                </div>

                <div className="hidden sm:flex flex-nowrap items-stretch justify-between gap-4 pb-4 border-b border-gray-200">
                  <div className="flex flex-nowrap items-stretch gap-4">
                    <div
                      className={`${sumana.className} flex flex-col justify-center`}
                    >
                      {hasSpecialPrice ? (
                        <div className="flex flex-col">
                          <span className="relative inline-block w-fit font-semibold text-lg text-[#98022e]">
                            <span className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px bg-[#98022e]" />
                            ${Number(originalPrice).toFixed(2)}
                          </span>
                          <strong className="font-bold text-2xl lg:text-3xl text-black">
                            ${Number(specialPrice).toFixed(2)}
                          </strong>
                        </div>
                      ) : (
                        <strong className="font-bold text-2xl lg:text-3xl text-black">
                          ${Number(originalPrice).toFixed(2)}
                        </strong>
                      )}
                    </div>

                    <div className="w-px bg-gray-300" />

                    <div className="flex flex-col gap-1 text-sm justify-center">
                      <div className="flex items-center gap-1">
                        {stock ? (
                          <Check
                            className="text-green-500"
                            size={16}
                            strokeWidth={3}
                          />
                        ) : (
                          <X
                            className="text-red-500"
                            size={16}
                            strokeWidth={2.5}
                          />
                        )}
                        <span
                          className={
                            stock
                              ? "text-green-600 font-bold"
                              : "text-red-600 font-bold"
                          }
                        >
                          {stock ? "IN STOCK" : "OUT OF STOCK"}
                        </span>
                      </div>

                      <div className="flex items-center text-sm text-gray-600">
                        <Dot strokeWidth={2.75} size={18} />
                        Model: {product.model}
                      </div>

                      {product.sku && (
                        <div className="flex items-center text-gray-600">
                          <Dot strokeWidth={2.75} size={18} />
                          SKU: {product.sku}
                        </div>
                      )}

                      {product.upc && (
                        <div className="flex items-center text-gray-600">
                          <Dot strokeWidth={2.75} size={18} />
                          UPC: {product.upc}
                        </div>
                      )}
                    </div>
                  </div>

                  {brandName && (
                    <div className="w-[120px] h-[60px] flex-shrink-0 flex items-center justify-center bg-white border border-gray-200">
                      <Link
                        href={`/${brandurl}`}
                        className="w-full h-full flex items-center justify-center p-2"
                      >
                        {brandImage ? (
                          <img
                            src={brandImage}
                            alt={brandName}
                            className="max-w-full max-h-full object-contain"
                          />
                        ) : (
                          <span className="text-xs tracking-widest text-gray-700 text-center px-2">
                            {brandName}
                          </span>
                        )}
                      </Link>
                    </div>
                  )}
                </div>

                {rawOptions.length > 0 && (
                  <div className="w-full mt-5 mb-5 space-y-5">
                    {/* option rendering — unchanged, same as before */}
                    {rawOptions.map((opt) => {
                      const key = String(opt.product_option_id);
                      const hasValues =
                        Array.isArray(opt.values) && opt.values.length > 0;
                      const optionType = String(opt.type || opt.option_type || "")
                        .toLowerCase()
                        .trim();
                      const label = (
                        <label
                          htmlFor={`option-${key}`}
                          className="block text-base font-semibold text-gray-800 mb-2"
                        >
                          {opt.name}
                          {opt.required && (
                            <span className="text-red-500 ml-1">*</span>
                          )}
                        </label>
                      );
                      const baseInputClass =
                        "block w-full p-3 border border-gray-300 bg-white rounded-sm shadow-sm focus:ring-1 focus:ring-[#c99000] focus:border-[#c99000] outline-none text-gray-700 bg-white";

                      if (String(opt.option_id) === "13") {
                        const currentValue = optionValues[key] || "";
                        return (
                          <div key={key}>
                            {label}
                            <textarea
                              id={`option-${key}`}
                              rows={4}
                              value={currentValue}
                              onChange={(e) =>
                                setOptionValue(key, e.target.value)
                              }
                              placeholder={opt.name}
                              className="block w-full h-[100px] lg:h-[120px] p-3 border border-gray-300 bg-white rounded-sm shadow-sm focus:ring-1 focus:ring-[#c99000] focus:border-[#c99000] outline-none transition-all resize-y text-gray-600 italic"
                            />
                          </div>
                        );
                      }

                      if (optionType === "select" || (optionType === "" && hasValues)) {
                        const value = optionValues[key] || "";
                        return (
                          <div key={key}>
                            {label}
                            <select
                              id={`option-${key}`}
                              value={value}
                              onChange={(e) =>
                                setOptionValue(key, e.target.value)
                              }
                              className={baseInputClass}
                            >
                              {opt.values.map((v) => {
                                const priceDiff = Number(v.price || 0);
                                const labelText =
                                  priceDiff > 0
                                    ? `${v.name} (+$${priceDiff.toFixed(2)})`
                                    : v.name;
                                return (
                                  <option
                                    key={v.product_option_value_id}
                                    value={v.product_option_value_id}
                                  >
                                    {labelText}
                                  </option>
                                );
                              })}
                            </select>
                          </div>
                        );
                      }

                      if (optionType === "radio" && hasValues) {
                        const value = optionValues[key] || "";
                        return (
                          <div key={key}>
                            {label}
                            <div className="flex flex-wrap gap-4">
                              {opt.values.map((v) => {
                                const priceDiff = Number(v.price || 0);
                                const labelText =
                                  priceDiff > 0
                                    ? `${v.name} (+$${priceDiff.toFixed(2)})`
                                    : v.name;
                                const vid = `${key}-${v.product_option_value_id}`;
                                return (
                                  <label
                                    key={v.product_option_value_id}
                                    htmlFor={vid}
                                    className="flex items-center gap-2 cursor-pointer"
                                  >
                                    <input
                                      id={vid}
                                      type="radio"
                                      name={`opt-${key}`}
                                      value={v.product_option_value_id}
                                      checked={
                                        String(value) ===
                                        String(v.product_option_value_id)
                                      }
                                      onChange={() =>
                                        setOptionValue(key, v.product_option_value_id)
                                      }
                                      className="w-4 h-4 accent-[#98022e] cursor-pointer"
                                    />
                                    <span className="text-sm text-gray-700">
                                      {labelText}
                                    </span>
                                  </label>
                                );
                              })}
                            </div>
                          </div>
                        );
                      }

                      if (optionType === "checkbox" && hasValues) {
                        const rawValue = optionValues[key];
                        const selectedArr = Array.isArray(rawValue)
                          ? rawValue.map((v) => String(v))
                          : rawValue
                            ? String(rawValue).split(",").filter(Boolean)
                            : [];
                        const toggleCheckbox = (povId) => {
                          const id = String(povId);
                          const next = selectedArr.includes(id)
                            ? selectedArr.filter((x) => x !== id)
                            : [...selectedArr, id];
                          setOptionValue(key, next.join(","));
                        };
                        return (
                          <div key={key}>
                            {label}
                            <div className="flex flex-wrap gap-4">
                              {opt.values.map((v) => {
                                const priceDiff = Number(v.price || 0);
                                const labelText =
                                  priceDiff > 0
                                    ? `${v.name} (+$${priceDiff.toFixed(2)})`
                                    : v.name;
                                const vid = `${key}-${v.product_option_value_id}`;
                                const isChecked = selectedArr.includes(
                                  String(v.product_option_value_id),
                                );
                                return (
                                  <label
                                    key={v.product_option_value_id}
                                    htmlFor={vid}
                                    className="flex items-center gap-2 cursor-pointer"
                                  >
                                    <input
                                      id={vid}
                                      type="checkbox"
                                      checked={isChecked}
                                      onChange={() =>
                                        toggleCheckbox(v.product_option_value_id)
                                      }
                                      className="w-4 h-4 accent-[#98022e] cursor-pointer rounded"
                                    />
                                    <span className="text-sm text-gray-700">
                                      {labelText}
                                    </span>
                                  </label>
                                );
                              })}
                            </div>
                          </div>
                        );
                      }

                      if (optionType === "textarea") {
                        const currentValue = optionValues[key] || "";
                        return (
                          <div key={key}>
                            {label}
                            <textarea
                              id={`option-${key}`}
                              rows={4}
                              value={currentValue}
                              onChange={(e) =>
                                setOptionValue(key, e.target.value)
                              }
                              placeholder={opt.name}
                              className="block w-full min-h-[110px] sm:min-h-[120px] p-3 border border-gray-300 bg-white rounded-sm shadow-sm focus:ring-1 focus:ring-[#c99000] focus:border-[#c99000] outline-none transition-all resize-y text-gray-600 italic"
                            />
                          </div>
                        );
                      }

                      if (optionType === "file") {
                        const currentValue = optionValues[key] || "";
                        const fileName = fileNames[key] || "";
                        return (
                          <div key={key}>
                            {label}
                            <div className="flex items-center gap-3">
                              <label
                                className={`inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-sm bg-white cursor-pointer hover:bg-gray-50 text-sm transition-colors ${
                                  currentValue ? "text-[#98022e]" : "text-gray-700"
                                }`}
                              >
                                <input
                                  type="file"
                                  className="hidden"
                                  onChange={(e) => {
                                    const f = e.target.files?.[0];
                                    if (f) {
                                      setOptionValue(key, f);
                                      setFileNames((prev) => ({
                                        ...prev,
                                        [key]: f.name,
                                      }));
                                    }
                                  }}
                                />
                                <Upload size={16} />
                                <span>
                                  {fileName ||
                                    (typeof currentValue === "string" && currentValue
                                      ? "File chosen"
                                      : "Choose file")}
                                </span>
                              </label>
                              {(currentValue || fileName) && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setOptionValue(key, "");
                                    setFileNames((prev) => {
                                      const next = { ...prev };
                                      delete next[key];
                                      return next;
                                    });
                                  }}
                                  className="text-sm text-red-500 hover:underline"
                                >
                                  Remove
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      }

                      if (
                        optionType === "date" ||
                        optionType === "time" ||
                        optionType === "datetime"
                      ) {
                        const currentValue = optionValues[key] || "";
                        const htmlType =
                          optionType === "datetime" ? "datetime-local" : optionType;
                        return (
                          <div key={key}>
                            {label}
                            <input
                              id={`option-${key}`}
                              type={htmlType}
                              value={currentValue}
                              onChange={(e) =>
                                setOptionValue(key, e.target.value)
                              }
                              className={baseInputClass}
                            />
                          </div>
                        );
                      }

                      const currentValue = optionValues[key] || "";
                      return (
                        <div key={key}>
                          {label}
                          <input
                            id={`option-${key}`}
                            type="text"
                            value={currentValue}
                            onChange={(e) =>
                              setOptionValue(key, e.target.value)
                            }
                            placeholder={opt.name}
                            className={baseInputClass + " italic text-gray-600"}
                          />
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="w-full pb-4 border-b border-gray-200 ">
                  <div className="flex items-stretch gap-3">
                    <div className="flex items-center border border-gray-300 bg-white">
                      <input
                        type="number"
                        min={1}
                        value={quantity}
                        onChange={(e) =>
                          setQuantity(Math.max(1, Number(e.target.value) || 1))
                        }
                        className="w-14 text-center outline-none py-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <div className="flex flex-col border-l border-gray-300">
                        <button
                          type="button"
                          onClick={() =>
                            setQuantity((currentQty) => currentQty + 1)
                          }
                          className="px-2 hover:bg-gray-100 cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <ChevronUp size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setQuantity((currentQty) =>
                              Math.max(1, currentQty - 1),
                            )
                          }
                          className="px-2 hover:bg-gray-100 border-t border-gray-300 cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <ChevronDown size={14} />
                        </button>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddToCartClick}
                      disabled={isAddingToCart || !stock}
                      className="flex-1 flex items-center justify-center gap-2 bg-[#98022e] hover:bg-[#7a0225] text-white font-bold uppercase tracking-wide transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      <ShoppingBag size={18} />
                      {isAddingToCart ? "Adding..." : "Add to Cart"}
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-6 mt-4 text-sm">
                    <button
                      type="button"
                      onClick={handleAddToWishlistClick}
                      disabled={isAddingToWishlist || isInWishlist}
                      className={`flex items-center gap-2 transition-colors cursor-pointer disabled:cursor-not-allowed ${
                        isInWishlist
                          ? "text-[#98022e]"
                          : "text-gray-700 hover:text-[#98022e]"
                      }`}
                    >
                      <Heart
                        size={16}
                        className={
                          isInWishlist
                            ? "fill-[#98022e] text-[#98022e]"
                            : ""
                        }
                      />
                      {isInWishlist
                        ? "Added to Wish List"
                        : isAddingToWishlist
                          ? "Adding..."
                          : "Add to Wish List"}
                    </button>

                    <button
                      type="button"
                      onClick={handleToggleCompare}
                      className={`flex items-center gap-2 transition-colors cursor-pointer ${
                        isInCompare
                          ? "text-[#98022e]"
                          : "text-gray-700 hover:text-[#98022e]"
                      }`}
                    >
                      <Repeat
                        size={16}
                        className={isInCompare ? "text-[#98022e]" : ""}
                      />
                      {isInCompare ? "Added to Compare" : "Compare this Product"}
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-4">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((starNumber) => (
                      <Star
                        key={starNumber}
                        size={16}
                        className={
                          starNumber <= Math.round(averageRating)
                            ? "fill-[#c99000] text-[#c99000]"
                            : "fill-transparent text-gray-300"
                        }
                      />
                    ))}
                  </div>

                  <p
                    onClick={handleWriteReviewClick}
                    className="text-black hover:cursor-pointer hover:text-[#c99000] underline text-sm"
                  >
                    Based on {reviewCount}{" "}
                    {reviewCount === 1 ? "review" : "reviews"}.
                  </p>

                  <span className="text-gray-400">-</span>

                  <p
                    onClick={handleWriteReviewClick}
                    className="text-[#98022e] hover:cursor-pointer hover:underline text-sm font-bold"
                  >
                    Write a review
                  </p>
                </div>

                {tagsRaw.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 mt-5 pt-4 border-t border-gray-200">
                    <span className="flex items-center gap-1 text-sm font-semibold text-gray-800">
                      <Tag size={14} className="text-[#98022e]" />
                      Tags:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {tagsRaw.map((t, i) => (
                        <Link
                          key={`${t}-${i}`}
                          href={`/search?tag=${encodeURIComponent(t)}`}
                          className="inline-flex items-center rounded-full bg-[#1c1c26] hover:bg-[#98022e] text-white text-[12px] font-medium px-3 py-1 transition-colors"
                        >
                          {t}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

           <div className="w-full bg-[#f8f8f8] border-t border-gray-200 mt-4">
  <div className="grid grid-cols-4 divide-x divide-gray-200">
    
    <a 
      className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 py-3 sm:py-4 px-1 sm:px-2 text-[11px] sm:text-sm font-semibold text-black hover:text-[#98022e] transition-colors text-center"
    >
      <Gift size={16} className="text-[#98022e] sm:w-[18px] sm:h-[18px]" />
      Free Gift Card
    </a>
    
    <a  
      className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 py-3 sm:py-4 px-1 sm:px-2 text-[11px] sm:text-sm font-semibold text-black hover:text-[#98022e] transition-colors text-center"
    >
      <Truck size={16} className="text-[#98022e] sm:w-[18px] sm:h-[18px]" />
      Fast Delivery
    </a>
<a
    
      download={true}
      href="/bulk-order-form.xlsx"
      className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 py-3 sm:py-4 px-1 sm:px-2 text-[11px] sm:text-sm font-semibold text-black hover:text-[#98022e] transition-colors text-center"
    >
      <Download size={16} className="text-[#98022e] sm:w-[18px] sm:h-[18px]" />
      Bulk Form
    </a>

    <a
      href="/frequently-asked-questions/"
      className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 py-3 sm:py-4 px-1 sm:px-2 text-[11px] sm:text-sm font-semibold text-black hover:text-[#98022e] transition-colors text-center"
    >
      <HelpCircle size={16} className="text-[#98022e] sm:w-[18px] sm:h-[18px]" />
      FAQs
    </a>
  </div>
</div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}