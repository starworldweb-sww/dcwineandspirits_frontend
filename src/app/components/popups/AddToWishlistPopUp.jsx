//@ts-nocheck
"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { decodeHtml } from "@/libs/decodeHtml";

const AddToWishlistPopup = ({ isOpen, onClose, product }) => {
  if (!product) return null;

  // 1. Auto-close after 2.5s, same jaisa cart popup mein hai
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => onClose(), 2500);
    return () => clearTimeout(timer);
  }, [isOpen]);

  // Actual image path check — missing image ho to hamesha fallback icon
  // dikhega, aur load fail hone par (onError) bhi fallback pe switch ho
  // jaata hai instead of blank box.
  const rawImagePath = product.image || product.images?.main || "";
  const hasImageSource = Boolean(rawImagePath);
  const imageUrl = hasImageSource
    ? rawImagePath.startsWith("http")
      ? rawImagePath
      : `${process.env.NEXT_PUBLIC_PRODUCTION_IMAGE_URL}/${rawImagePath}`
    : "";

  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    setImgFailed(false);
  }, [imageUrl]);

  const showImage = hasImageSource && !imgFailed;

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
        <>
          {/* Backdrop — mobile only, same as cart popup, gives the sheet
              focus without blocking scroll of the page underneath */}
          <motion.div
            key="wishlist-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="sm:hidden fixed inset-0 bg-black/25 backdrop-blur-[1px] z-[9998]"
          />

          <motion.div
            key="wishlist-toast"
            // FIX: mobile ab neeche se slide-up hoti hai (bottom sheet,
            // cart popup jaisi) — pehle yeh top se aati thi aur ek chhoti
            // top-right toast ki tarah squeeze ho jaati thi phone par.
            // Desktop par purana top-right toast style hi rehta hai.
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="
              fixed z-[9999] bg-white overflow-hidden font-hind-madurai
              border border-[#e0e0e0]
              bottom-3 inset-x-3 rounded-[22px]
              shadow-[0_-8px_40px_-6px_rgba(0,0,0,0.25)]
              sm:bottom-auto sm:inset-x-auto sm:left-auto
              sm:top-24 sm:right-4 sm:w-[420px] sm:max-w-[calc(100vw-2rem)]
              sm:rounded-none sm:shadow-xl
            "
          >
            {/* mobile drag handle */}
            <div className="sm:hidden flex justify-center pt-2.5 pb-1">
              <div className="w-9 h-1 rounded-full bg-[#e5e0d6]" />
            </div>

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
              className="absolute top-0 right-3 text-[#bbb] hover:text-[#888] transition-colors duration-150 z-10"
            >
              <X size={14} />
            </button>

            <div className="flex items-center gap-4 px-4 pt-4 pb-3">

              {/* Image */}
              <div className="flex-shrink-0 w-[60px] h-[60px] bg-[#f9f9f9] border border-[#ececec] overflow-hidden relative">
                {showImage ? (
                  <Image
                    fill
                    loading="lazy"
                    src={imageUrl}
                    alt={product.name}
                    className="object-contain p-1.5"
                    sizes="60px"
                    onError={() => setImgFailed(true)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Heart size={18} className="text-[#ccc]" />
                  </div>
                )}
              </div>

              {/* Text — FIX: pr-6 was clipping the price/name column too
                  tight against the close button on narrow widths, and
                  since there was no explicit vertical alignment the block
                  could sit off-center against the image. flex-col +
                  justify-center on a min-h matching the image keeps name
                  and price stacked and centered against the image, and
                  pr-8 gives consistent breathing room before the X. */}
              <div className="flex-1 min-w-0 pr-8 flex flex-col justify-center min-h-[60px]">
                <div className="flex items-center gap-1 mb-1">
                  <Heart size={10} strokeWidth={3} fill="#e0527a" className="text-[#e0527a] flex-shrink-0" />
                  <span className="text-[9px] tracking-[0.18em] text-[#e0527a] uppercase font-bold">
                    Added to Wishlist
                  </span>
                </div>
                <p className="text-[13px] text-[#1a1a1a] font-semibold leading-snug line-clamp-2 mb-1 font-hind-madurai truncate">
                  {decodeHtml(product.name)}
                </p>
                <p className="text-[14px] text-[#c99000] font-bold tracking-wide">
                  ${Number(price).toFixed(2)}
                </p>
              </div>

            </div>

            {/* Single full width button — wishlist mein checkout ka concept nahi hota */}
            <div className="flex border-t border-[#ececec] pb-[calc(env(safe-area-inset-bottom,0px))] sm:pb-0">
              <Link
                href="/account/wishlist/"
                className="flex-1 py-2.5 text-center text-[10px] tracking-[0.14em] font-bold uppercase text-white bg-[#98022e] hover:bg-[#7a0225] transition-colors duration-200"
              >
                View Wishlist
              </Link>
            </div>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AddToWishlistPopup;