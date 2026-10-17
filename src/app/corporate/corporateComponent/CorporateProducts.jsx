"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useGetProductBySlugOrId } from "@/app/api/hooks/useAllProducts";



const MAROON = "#98022e";
const GOLD = "#c99000";
const decodeHtml = (text = "") =>
  text
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");

const getImageUrl = (path = "") =>
  path.startsWith("http")
    ? path
    : `${process.env.NEXT_PUBLIC_PRODUCTION_IMAGE_URL}${path}`;


const formatPrice = (value) => `$${Number(value).toFixed(2)}`;

export default function CorporateProducts() {
  const scrollRef = useRef(null);

  // 4. Hook call - slug: corporate-gift-basket
  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetProductBySlugOrId("corporate-gift-basket", {}, {}, 12);

  // 5. Saare pages ke products ek array me jodo.
  //    (page?.data?.products?.items = axios response ka wrapper, page?.products?.items = agar service data pehle hi nikal ke deti hai)
  const products =
    data?.pages?.flatMap(
      (page) => page?.data?.products?.items ?? page?.products?.items ?? []
    ) ?? [];

  // 6. Arrow buttons: ek baar me ~ 80% width scroll
  const scrollByAmount = (direction) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: "smooth" });
  };

  // 7. Scroll end ke paas pahunchne pe agla page load karo
  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el || !hasNextPage || isFetchingNextPage) return;
    const nearEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 300;
    if (nearEnd) fetchNextPage();
  };

  // Error ya empty hone pe kuch nahi dikhana
  if (isError || (!isLoading && products.length === 0)) return null;

  return (
    <section className="bg-[#eeeeee] py-10 md:py-14 px-3 2xl:px-32 font-hind-madurai">
      {/* 8. Heading + arrows */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2
            className="text-2xl md:text-[32px] font-bold font-sarabun"
           
          >
            Corporate Gift Baskets
          </h2>
          <div className="mt-3 h-[2px] w-16" style={{ backgroundColor: MAROON }} />
         
        </div>

        {/* Arrows sirf desktop pe */}
     
      </div>

      {/* 9. Horizontal scroll row (scrollbar chhupa hua) */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex gap-3 md:gap-4 overflow-x-auto snap-x snap-mandatory pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {/* Loading skeleton */}
        {isLoading &&
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="shrink-0 w-[220px] md:w-[280px] animate-pulse">
              <div className="aspect-square bg-[#eceff1]" />
              <div className="h-4 w-20 bg-[#eceff1] mt-3" />
              <div className="h-4 w-full bg-[#eceff1] mt-2" />
              <div className="h-3 w-24 bg-[#eceff1] mt-2" />
            </div>
          ))}

        {/* 10. Product cards */}
        {products.map((product) => {
          const hasDiscount = !!product.special_price;

          return (
            // CHANGE 1: card pe border + padding + hover shadow,
            // taaki har product ka image, price aur naam ek hi box me dikhe
            <Link
              key={product.product_id}
              href={`/${product.seo_url}`}
              className="group shrink-0 snap-start w-[220px] md:w-[280px] no-underline border border-[#e5e5e5] bg-white p-3 transition-shadow hover:shadow-md"
            >
              {/* CHANGE 3: image box pe halka border, taaki white image bhi box me dikhe */}
              <div className="relative aspect-square bg-[#eceff1] border border-[#eeeeee] overflow-hidden">
                <Image
                  src={encodeURI(getImageUrl(product.image))}
                  alt={decodeHtml(product.name)}
                  fill
                  sizes="(max-width: 768px) 220px, 280px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Out of stock label */}
                {!product.in_stock && (
                  <span className="absolute top-2 left-2 bg-[#1c1f22] text-white text-[10px] font-semibold px-2 py-1 tracking-wide">
                    OUT OF STOCK
                  </span>
                )}
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-2 mt-3">
                <span className="text-base font-bold" style={{ color: MAROON }}>
                  {formatPrice(product.final_price)}
                </span>
                {hasDiscount && (
                  <span className="text-sm text-[#999] line-through">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>

              {/* CHANGE 2: block + min-h = naam 1 line ka ho ya 2 line ka,
                  subtitle sab cards me ek hi jagah aayegi */}
              <span
                className="block mt-1 min-h-[2.6rem] text-sm md:text-[15px] font-normal uppercase text-[#1c1f22] leading-snug line-clamp-2 font-hind-madurai"
              >
                {decodeHtml(product.name)}
              </span>

              {/* Subtitle (brand ka naam) */}
              <p className="mt-1 text-sm text-[#888]">
                {decodeHtml(product.manufacturer?.name) || "Gift Basket"}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}