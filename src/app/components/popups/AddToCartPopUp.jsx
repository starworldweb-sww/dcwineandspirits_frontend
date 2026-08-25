//@ts-nocheck
"use client";

import Link from "next/link";
import Image from "next/image";
import { Check, X, ShoppingCart, ArrowRight, Wine } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { decodeHtml } from "@/libs/decodeHtml";

// Related product — minimal, editorial chip
const RelatedProductChip = ({ product }) => {
  const imageUrl = product.image?.startsWith("http")
    ? product.image
    : `${process.env.NEXT_PUBLIC_PRODUCTION_IMAGE_URL}/${product.image ?? ""}`;
  const price = product.special_price || product.price || "0";
  const link = product.seo_url ? `/${product.seo_url}` : `/${product.product_id}`;

  return (
    <Link
      href={link}
      className="group flex items-center gap-2 flex-1 min-w-0 py-1.5"
    >
      <div className="w-9 h-9 flex-shrink-0 bg-[#f7f5f2] rounded-md overflow-hidden relative border border-[#eee] group-hover:border-[#c99000]/50 transition-colors duration-200">
        {imageUrl && (
          <Image
            fill
            loading="lazy"
            src={imageUrl}
            alt={product.name}
            className="object-contain p-1 mix-blend-multiply"
            sizes="36px"
          />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] text-[#2a2a2a] font-medium leading-tight line-clamp-1 group-hover:text-[#98022e] transition-colors">
          {decodeHtml(product.name)}
        </p>
        <p className="text-[9.5px] text-[#b08600] font-semibold mt-0.5">
          ${Number(price).toFixed(2)}
        </p>
      </div>
    </Link>
  );
};

const AddToCartPopup = ({
  isOpen,
  onClose,
  product,
  cardPrice = 0,
  relatedProducts = [],
}) => {
  if (!product) return null;

  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => onClose(), 4200);
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
        <>
          {/* subtle backdrop — mobile only, gives the sheet focus without blocking scroll of page */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="sm:hidden fixed inset-0 bg-black/25 backdrop-blur-[1px] z-[9998]"
          />

          <motion.div
            key="cart-toast"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 340 }}
            className="
              fixed z-[9999] bg-[#fffdfa] overflow-hidden font-hind-madurai
              border border-[#e8e3da]
              bottom-0 left-0 right-0 rounded-t-[22px]
              shadow-[0_-8px_40px_-6px_rgba(0,0,0,0.25)]
              sm:bottom-auto sm:left-auto sm:top-5 sm:right-5 sm:w-[360px]
              sm:rounded-2xl sm:shadow-[0_24px_60px_-14px_rgba(0,0,0,0.28)]
            "
          >
            {/* mobile drag handle */}
            <div className="sm:hidden flex justify-center pt-2.5 pb-1">
              <div className="w-9 h-1 rounded-full bg-[#e5e0d6]" />
            </div>

            {/* hairline gold-maroon accent — top edge, brand signature */}
            <div className="hidden sm:block h-[3px] w-full bg-gradient-to-r from-[#c99000] via-[#98022e] to-[#c99000]" />

            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute top-3 right-3 sm:top-3.5 sm:right-3.5 w-6 h-6 flex items-center justify-center rounded-full text-[#999] hover:text-[#1a1a1a] hover:bg-black/[0.04] transition-colors duration-150 z-10 cursor-pointer"
            >
              <X size={13} />
            </button>

            <div className="px-4 sm:px-5 pt-2.5 sm:pt-4 pb-3">
              {/* eyebrow */}
              <div className="flex items-center gap-1.5 mb-3">
                <span className="w-4 h-4 rounded-full bg-[#98022e] flex items-center justify-center flex-shrink-0">
                  <Check size={9} strokeWidth={3.5} className="text-white" />
                </span>
                <span className="text-[9.5px] tracking-[0.18em] text-[#98022e] uppercase font-bold">
                  Added to Cart
                </span>
              </div>

              <div className="flex items-center gap-3.5">
                {/* product image, framed like a label */}
                <div className="flex-shrink-0 w-[58px] h-[58px] sm:w-[64px] sm:h-[64px] rounded-xl bg-[#f7f5f2] border border-[#eee] overflow-hidden relative">
                  {imageUrl ? (
                    <Image
                      fill
                      loading="lazy"
                      src={imageUrl}
                      alt={product.name}
                      className="object-contain p-2 mix-blend-multiply"
                      sizes="64px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Wine size={18} className="text-[#ccc]" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0 text-left">
                  <p className="text-[13px] sm:text-[13.5px] text-[#1a1a1a] font-semibold leading-snug line-clamp-2">
                    {decodeHtml(product.name)}
                  </p>
                  <p className="text-[14px] sm:text-[15px] text-[#98022e] font-bold tracking-wide mt-1">
                    ${Number(finalPrice).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            {/* related products — editorial, no card borders */}
            {relatedProducts.length > 0 && (
              <div className="px-4 sm:px-5 pb-3">
                <div className="h-px bg-[#eee] mb-2.5" />
                <p className="text-[8.5px] tracking-[0.16em] text-[#a89a7d] uppercase font-bold mb-1">
                  Pairs well with
                </p>
                <div className="flex gap-3">
                  {relatedProducts.slice(0, 2).map((rp) => (
                    <RelatedProductChip key={rp.product_id} product={rp} />
                  ))}
                </div>
              </div>
            )}

            {/* progress line — very subtle, sits above buttons */}
            <div className="h-[2px] w-full bg-[#f0ede6] overflow-hidden">
              <motion.div
                className="h-full bg-[#c99000]"
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: 4.2, ease: "linear" }}
              />
            </div>

            {/* actions */}
            <div className="flex gap-2 px-4 sm:px-5 py-3 pb-[calc(env(safe-area-inset-bottom,0px)+12px)] sm:pb-3">
              <Link
                href="/cart/"
                className="flex-1 py-2.5 text-center text-[10.5px] tracking-[0.1em] font-bold uppercase text-[#1a1a1a] border border-[#ddd8cd] rounded-lg hover:bg-[#faf8f4] hover:border-[#c99000] transition-colors duration-200"
              >
                View Cart
              </Link>
              <Link
                href="/checkout"
                className="flex-1 py-2.5 flex items-center justify-center gap-1.5 text-center text-[10.5px] tracking-[0.1em] font-bold uppercase text-white bg-[#98022e] rounded-lg hover:bg-[#7a0225] transition-colors duration-200"
              >
                Checkout
                <ArrowRight size={12} strokeWidth={2.5} />
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AddToCartPopup;