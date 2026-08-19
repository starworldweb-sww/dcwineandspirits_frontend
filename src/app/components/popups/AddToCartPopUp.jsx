//@ts-nocheck
"use client";

import Link from "next/link";
import Image from "next/image";
import { Check, X, ShoppingCart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { decodeHtml } from "@/libs/decodeHtml";

const AddToCartPopup = ({ isOpen, onClose, product, cardPrice = 0 }) => {
  if (!product) return null;

  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => onClose(), 2500);
    return () => clearTimeout(timer);
  }, [isOpen]);

  const imageUrl = product.image?.startsWith("http")
    ? product.image
    : `${process.env.NEXT_PUBLIC_PRODUCTION_IMAGE_URL}/${
        product.image ?? product.images?.main ?? ""
      }`;

  const basePrice =
    product.pricing?.special_price ||
    product.pricing?.price ||
    product.special_price ||
    product.price ||
    "0";

  const finalPrice = Number(basePrice) + Number(cardPrice);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="cart-toast"
          initial={{ y: -16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -16, opacity: 0 }}
          transition={{ type: "spring", damping: 30, stiffness: 280 }}
          className="fixed top-4 right-4 z-[9999] w-[420px] max-w-[95vw] bg-white border border-[#e0e0e0] shadow-xl overflow-hidden font-hind-madurai"
        >
          {/* Maroon drain bar */}
          <motion.div
            className="h-[2px] bg-[#98022e]"
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{ duration: 2.5, ease: "linear" }}
          />

          {/* Close button — absolute top right */}
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
                  <ShoppingCart size={18} className="text-[#ccc]" />
                </div>
              )}
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0 pr-6">
              <div className="flex items-center gap-1 mb-1">
                <Check size={10} strokeWidth={3} className="text-[#98022e] flex-shrink-0" />
                <span className="text-[9px] tracking-[0.18em] text-[#98022e] uppercase font-bold">
                  Added to Cart
                </span>
              </div>
              <p className="text-[13px] text-[#1a1a1a] font-semibold leading-snug line-clamp-2 mb-1 font-hind-madurai">
                {decodeHtml(product.name)}
              </p>
              <p className="text-[14px] text-[#c99000] font-bold tracking-wide">
                ${Number(finalPrice).toFixed(2)}
              </p>
            </div>

          </div>

          {/* Full width buttons at bottom */}
          <div className="flex border-t border-[#ececec]">
            <Link
              href="/account/cart/"
              className="flex-1 py-2.5 text-center text-[10px] tracking-[0.14em] font-bold uppercase text-[#555] border-r border-[#ececec] hover:bg-[#f5f5f5] transition-colors duration-200"
            >
              View Cart
            </Link>
            <Link
              href="/checkout"
              className="flex-1 py-2.5 text-center text-[10px] tracking-[0.14em] font-bold uppercase text-white bg-[#98022e] hover:bg-[#7a0225] transition-colors duration-200"
            >
              Checkout
            </Link>
          </div>

        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddToCartPopup;