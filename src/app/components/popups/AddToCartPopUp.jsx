//@ts-nocheck
"use client";

import Link from "next/link";
import Image from "next/image";
import { Check, X, ShoppingCart, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { decodeHtml } from "@/libs/decodeHtml";

// 1. Chhota sub-component — ek related product ka mini card
const RelatedProductChip = ({ product }) => {
  const imageUrl = product.image?.startsWith("http")
    ? product.image
    : `${process.env.NEXT_PUBLIC_PRODUCTION_IMAGE_URL}/${product.image ?? ""}`;
  const price = product.special_price || product.price || "0";
  const link = product.seo_url ? `/${product.seo_url}` : `/${product.product_id}`;

  return (
    <Link
      href={link}
      className="flex items-center gap-2 flex-1 min-w-0 bg-white border border-[#ececec] rounded-md p-2 hover:border-[#c99000] transition-colors duration-150"
    >
      <div className="w-8 h-8 flex-shrink-0 bg-[#faf9f8] rounded overflow-hidden relative">
        {imageUrl && (
          <Image
            fill
            loading="lazy"
            src={imageUrl}
            alt={product.name}
            className="object-contain p-0.5"
            sizes="32px"
          />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10.5px] text-[#333] font-semibold leading-tight line-clamp-1">
          {decodeHtml(product.name)}
        </p>
        <p className="text-[10px] text-[#c99000] font-bold">
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
  relatedProducts = [], // 2. Naya prop — 1-2 related products dikhane ke liye
}) => {
  if (!product) return null;

  useEffect(() => {
    if (!isOpen) return;
    // 3. Timer thoda badhaya (4s) — related products bhi ab dekhne ko hain, 2.5s kam padta
    const timer = setTimeout(() => onClose(), 4000);
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
          initial={{ y: -12, opacity: 0, scale: 0.98 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -12, opacity: 0, scale: 0.98 }}
          transition={{ type: "spring", damping: 28, stiffness: 300 }}
          className="fixed top-5 right-5 z-[9999] w-[400px] max-w-[92vw] bg-white rounded-lg border border-[#ececec] shadow-[0_10px_40px_-8px_rgba(0,0,0,0.18)] overflow-hidden font-hind-madurai"
        >
          {/* Progress bar */}
          <motion.div
            className="h-[3px] bg-gradient-to-r from-[#98022e] to-[#c99000]"
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{ duration: 4, ease: "linear" }}
          />

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center rounded-full text-[#aaa] hover:text-[#666] hover:bg-[#f5f5f5] transition-colors duration-150 z-10 cursor-pointer"
          >
            <X size={14} />
          </button>

          <div className="flex items-center gap-4 px-5 pt-5 pb-4">
            <div className="flex-shrink-0 w-[64px] h-[64px] rounded-md bg-[#faf9f8] border border-[#ececec] overflow-hidden relative">
              {imageUrl ? (
                <Image
                  fill
                  loading="lazy"
                  src={imageUrl}
                  alt={product.name}
                  className="object-contain p-2"
                  sizes="64px"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ShoppingCart size={18} className="text-[#ccc]" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0 pr-5 text-left">
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="w-3.5 h-3.5 rounded-full bg-[#98022e] flex items-center justify-center flex-shrink-0">
                  <Check size={9} strokeWidth={3.5} className="text-white" />
                </span>
                <span className="text-[10px] tracking-[0.16em] text-[#98022e] uppercase font-bold">
                  Added to Cart
                </span>
              </div>
              <p className="text-[13.5px] text-[#1a1a1a] font-semibold leading-snug line-clamp-2 mb-1.5 text-left">
                {decodeHtml(product.name)}
              </p>
              <p className="text-[15px] text-[#c99000] font-bold tracking-wide text-left">
                ${Number(finalPrice).toFixed(2)}
              </p>
            </div>
          </div>

          {/* 4. Related products — sirf tab dikhega jab data mile, warna section render hi nahi hoga */}
          {relatedProducts.length > 0 && (
            <div className="border-t border-[#ececec] px-5 py-3 bg-[#fafafa]">
              <p className="text-[9px] tracking-[0.14em] text-[#999] uppercase font-bold mb-2 flex items-center gap-1">
                <Plus size={10} /> You may also like
              </p>
              <div className="flex gap-2">
                {relatedProducts.slice(0, 2).map((rp) => (
                  <RelatedProductChip key={rp.product_id} product={rp} />
                ))}
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex border-t border-[#ececec]">
            <Link
              href="/account/cart/"
              className="flex-1 py-3 text-center text-[10.5px] tracking-[0.12em] font-bold uppercase text-[#555] border-r border-[#ececec] hover:bg-[#f7f7f7] transition-colors duration-200"
            >
              View Cart
            </Link>
            <Link
              href="/checkout"
              className="flex-1 py-3 text-center text-[10.5px] tracking-[0.12em] font-bold uppercase text-white bg-[#98022e] hover:bg-[#7a0225] transition-colors duration-200"
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