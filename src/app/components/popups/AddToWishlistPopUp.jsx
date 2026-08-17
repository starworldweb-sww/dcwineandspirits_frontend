//@ts-nocheck
"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { decodeHtml } from "@/libs/decodeHtml";

const AddToWishlistPopup = ({ isOpen, onClose, product }) => {
  if (!product) return null;

  // 1. Auto-close after 2.5s, same jaisa cart popup mein hai
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => onClose(), 2500);
    return () => clearTimeout(timer);
  }, [isOpen]);

  // 2. Image URL resolve — full url ho ya sirf filename, dono handle
  const imageUrl = product.image?.startsWith("http")
    ? product.image
    : `${process.env.NEXT_PUBLIC_PRODUCTION_IMAGE_URL}/${
        product.image ?? product.images?.main ?? ""
      }`;

  // 3. Price fallback chain — special price pehle, phir normal price
  const price =
    product.pricing?.special_price ||
    product.pricing?.price ||
    product.special_price ||
    product.price ||
    "0";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="wishlist-toast"
          initial={{ y: -16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -16, opacity: 0 }}
          transition={{ type: "spring", damping: 30, stiffness: 280 }}
          className="fixed top-4 right-4 z-[9999] w-[420px] max-w-[95vw] bg-white border border-[#e0e0e0] shadow-xl overflow-hidden font-hind-madurai"
        >
          {/* Drain bar — cart popup ke maroon se yahan rose accent, visually differentiate karne ke liye */}
          <motion.div
            className="h-[2px] bg-[#e0527a]"
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{ duration: 2.5, ease: "linear" }}
          />

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 text-[#bbb] hover:text-[#888] transition-colors duration-150 z-10"
          >
            <X size={14} />
          </button>

          <div className="flex items-center gap-4 px-4 pt-4 pb-3">

            {/* Image */}
            <div className="flex-shrink-0 w-[60px] h-[60px] bg-[#f9f9f9] border border-[#ececec] overflow-hidden relative">
              {imageUrl ? (
                <Image
                  fill
                  loading="lazy"
                  src={imageUrl}
                  alt={product.name}
                  className="object-contain p-1.5"
                  sizes="60px"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Heart size={18} className="text-[#ccc]" />
                </div>
              )}
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0 pr-6">
              <div className="flex items-center gap-1 mb-1">
                <Heart size={10} strokeWidth={3} fill="#e0527a" className="text-[#e0527a] flex-shrink-0" />
                <span className="text-[9px] tracking-[0.18em] text-[#e0527a] uppercase font-bold">
                  Added to Wishlist
                </span>
              </div>
              <p className="text-[13px] text-[#1a1a1a] font-semibold leading-snug line-clamp-2 mb-1 font-hind-madurai">
                {decodeHtml(product.name)}
              </p>
              <p className="text-[14px] text-[#c99000] font-bold tracking-wide">
                ${Number(price).toFixed(2)}
              </p>
            </div>

          </div>

          {/* Single full width button — wishlist mein checkout ka concept nahi hota */}
          <div className="flex border-t border-[#ececec]">
            <Link
              href="/account/wishlist/"
              className="flex-1 py-2.5 text-center text-[10px] tracking-[0.14em] font-bold uppercase text-white bg-[#98022e] hover:bg-[#7a0225] transition-colors duration-200"
            >
              View Wishlist
            </Link>
          </div>

        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddToWishlistPopup;