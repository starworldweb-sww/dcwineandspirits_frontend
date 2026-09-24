"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_PRODUCTION_IMAGE_URL;
const CURRENCY_SYMBOL = "$";
const CARD_GAP = 16; // Tailwind gap-4

const getImageUrl = (imagePath) => {
  if (!imagePath) return "";
  if (imagePath.startsWith("http")) return imagePath;
  const cleanBase = (IMAGE_BASE_URL || "").replace(/\/$/, "");
  const cleanPath = imagePath.replace(/^\//, "");
  return `${cleanBase}/${cleanPath}`;
};

// Product names are stored HTML-encoded in the DB (&amp; etc.)
const decodeHtml = (str) =>
  (str || "")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");

const formatPrice = (price) => {
  const num = Number(price);
  return isNaN(num) ? "" : `${CURRENCY_SYMBOL}${num.toFixed(2)}`;
};

const arrowBase =
  "hidden sm:flex absolute top-1/2 -translate-y-1/2 z-10 w-9 h-9 items-center justify-center rounded-full bg-white border border-gray-200 shadow-md hover:border-[#98022e] hover:text-[#98022e] transition-all duration-200 cursor-pointer";

/**
 * Horizontal slider of products related to a blog post.
 *
 * Props:
 *  - products: array of { product_id, slug, name, image, price }
 *  - title:    heading text (default "Related Products")
 *
 * Behaviour:
 *  - Products without a slug are skipped (link would be dead).
 *  - Arrow buttons show only when there is more to scroll in that direction.
 *  - One click scrolls by a whole number of cards, so no card is cut off.
 *  - Mobile uses touch-swipe (arrows hidden).
 */
const BlogRelatedProducts = ({ products = [], title = "Related Products" }) => {
  const listRef = useRef(null);
  const [canScroll, setCanScroll] = useState({ left: false, right: false });

  const items = (products ?? []).filter((item) => item?.slug);

  const updateScrollState = useCallback(() => {
    const el = listRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    const left = el.scrollLeft > 4;
    const right = el.scrollLeft < maxScroll - 4;
    setCanScroll((prev) =>
      prev.left === left && prev.right === right ? prev : { left, right },
    );
  }, []);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;

    updateScrollState();
    el.addEventListener("scroll", updateScrollState, { passive: true });

    // Re-check on container resize (window resize, layout change)
    const observer = new ResizeObserver(updateScrollState);
    observer.observe(el);

    return () => {
      el.removeEventListener("scroll", updateScrollState);
      observer.disconnect();
    };
  }, [items.length, updateScrollState]);

  const scrollByCards = (direction) => {
    const el = listRef.current;
    if (!el) return;
    const firstCard = el.querySelector("li");
    if (!firstCard) return;

    const step = firstCard.offsetWidth + CARD_GAP;
    const visibleCards = Math.max(1, Math.floor(el.clientWidth / step));

    el.scrollBy({
      left: (direction === "left" ? -1 : 1) * step * visibleCards,
      behavior: "smooth",
    });
  };

  if (items.length === 0) return null;

  return (
    <section className="mt-10 pt-6 border-t border-gray-200">
      <h3 className="font-hind-madurai text-xl font-semibold text-gray-800 mb-4">
        {title}
      </h3>

      <div className="relative">
        <button
          type="button"
          onClick={() => scrollByCards("left")}
          aria-label="Previous products"
          tabIndex={canScroll.left ? 0 : -1}
          className={`${arrowBase} -left-4 ${
            canScroll.left ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <ChevronLeft size={18} />
        </button>

        <ul
          ref={listRef}
          className="flex gap-4 overflow-x-auto overscroll-x-contain scroll-smooth snap-x snap-mandatory list-none m-0 p-0 pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {items.map((item) => (
            <li
              key={item.product_id}
              className="shrink-0 snap-start w-[45%] sm:w-[200px]"
            >
              <Link href={`/${item.slug}`} className="group block">
                <div className="relative w-full aspect-square bg-gray-50 rounded mb-2">
                  <Image
                    src={getImageUrl(item.image)}
                    alt={decodeHtml(item.name)}
                    fill
                    sizes="(max-width: 768px) 50vw, 200px"
                    className="object-contain p-2"
                  />
                </div>
                <h4 className="text-sm text-gray-800 group-hover:text-[#98022e] line-clamp-2">
                  {decodeHtml(item.name)}
                </h4>
                <p className="text-sm font-semibold text-[#98022e] mt-1">
                  {formatPrice(item.price)}
                </p>
              </Link>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={() => scrollByCards("right")}
          aria-label="Next products"
          tabIndex={canScroll.right ? 0 : -1}
          className={`${arrowBase} -right-4 ${
            canScroll.right ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </section>
  );
};

export default BlogRelatedProducts;