"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { Sumana } from "next/font/google";

// 1. "Sumana" font ko next/font/google se load kiya hai — sirf Gifts By Occasion
//    section ke liye use hoga. Baaki purana banner section apne existing font mein hi rahega.
const sumana = Sumana({
  subsets: ["latin"],
  weight: ["400", "700"],
});

// ---------------------------------------------------------------
// BANNER DATA (YE PURANA CODE HAI — ISME KUCH NAHI BADLA)
// Add/remove/edit banners here. Each one is just a clickable image.
// ---------------------------------------------------------------
const BANNERS = [
  {
    href: "/veuve-clicquot-champagne-and-flutes-gift-set/",
    image: "https://www.dcwineandspirits.com/image/cache/catalog/Banners/veuve-clicquot-champagne-and-flutes-giftset-1047x349.webp",
    alt: "veuve-clicquot-champagne-and-flutes-gift-set",
  },
  {
    href: "/graduation-gifts/",
    image: "/graduation-1047x349.webp",
    alt: "graduation-day-cheers",
  },
];

// 2. OCCASION DATA — "Gifts By Occasion" section ke liye naya data.
//    Naya occasion add karna ho to bas is array mein ek naya object daal do.
const OCCASIONS = [
  { name: "Graduation Gifts",      slug: "graduation-gifts",      image: "/occasions/graduation-gifts.jpg" },
  { name: "Birthday Gifts",        slug: "birthday-gifts",        image: "/occasions/birthday-gifts.jpg" },
  { name: "Anniversary Gifts",      slug: "anniversary-gifts",      image: "/occasions/anniversary-gifts.jpg" },
  { name: "Congratulations Gifts",  slug: "congratulations-gifts",  image: "/occasions/congratulations-gifts.jpg" },
  { name: "Housewarming Gifts",     slug: "housewarming-gifts",     image: "/occasions/housewarming-gifts.jpg" },
  { name: "Thank You Gifts",        slug: "thank-you-gifts",        image: "/occasions/thank-you-gifts.jpg" },
  { name: "Get Well Soon Gifts",    slug: "get-well-soon-gifts",    image: "/occasions/get-well-soon-gifts.jpg" },
  { name: "Wedding Gifts",          slug: "wedding-gifts",          image: "/occasions/wedding-gifts.jpg" },
  { name: "New Year Gifts",         slug: "new-year-gifts",         image: "/occasions/new-year-gifts.jpg" },
];

const Page = () => {
  // 3. Mobile pe horizontal slider ke liye ref + arrow show/hide state
  //    (sirf Gifts By Occasion section ke liye chahiye, banner section ko iski zaroorat nahi)
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateArrows = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(el.scrollLeft + el.offsetWidth < el.scrollWidth - 2);
  };

  useEffect(() => {
    updateArrows();
  }, []);

  const scroll = (direction) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({
      left: direction === "left" ? -el.offsetWidth : el.offsetWidth,
      behavior: "smooth",
    });
  };

  return (
    <>
      {/* ============================================================= */}
      {/* PURANA BANNER SECTION — bilkul same rakha hai, kuch nahi hataya */}
      {/* ============================================================= */}
      <div className="w-full px-3 2xl:px-32 py-6">

        {/* 4. "EXPLORE ALL PRODUCTS" button — banner grid ke upar */}
       

        {/* PROMO BANNER ROW — Desktop/tablet: side by side. Mobile: stacked. */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {BANNERS.map((banner) => (
            <Link key={banner.href} href={banner.href} className="block w-full">
              <img
                src={banner.image}
                alt={banner.alt}
                width={640}
                height={220}
                loading="lazy"
                className="block w-full h-auto aspect-[640/220] object-cover"
              />
            </Link>
          ))}
        </div>
      </div>

      {/* ============================================================= */}
      {/* NAYA SECTION — GIFTS BY OCCASION                              */}
      {/* ============================================================= */}
      <div className={`w-full bg-white px-3 2xl:px-32 py-12 md:py-16 ${sumana.className}`}>

        {/* Header: Title + Subtitle */}
        <div className="text-center max-w-3xl mx-auto mb-8 md:mb-10">
          <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-widest text-black">
            Gifts By Occasion
          </h2>
          <p className="mt-3 text-[15px] md:text-base text-gray-700 leading-relaxed">
            Celebrate every moment with thoughtfully curated wine gifts for every occasion.
            <br className="hidden md:block" />
            From birthdays to anniversaries, find the perfect bottle or basket to make it memorable.
          </p>
        </div>

        {/* Cards section */}
        <div className="relative">

          {canScrollLeft && (
            <button
              onClick={() => scroll("left")}
              aria-label="Scroll left"
              className="md:hidden absolute left-2 top-[21vw] -translate-y-1/2 z-10
                         w-9 h-9 rounded-full bg-[#98022e] backdrop-blur-sm
                         flex items-center justify-center
                         text-white text-2xl leading-none
                         active:scale-90 transition-transform shadow-lg"
            >
              ‹
            </button>
          )}

          {canScrollRight && (
            <button
              onClick={() => scroll("right")}
              aria-label="Scroll right"
              className="md:hidden absolute right-2 top-[21vw] -translate-y-1/2 z-10
                         w-9 h-9 rounded-full bg-[#98022e] backdrop-blur-sm
                         flex items-center justify-center
                         text-white text-xl leading-none
                         active:scale-90 transition-transform shadow-lg flex items-center justify-center"
            >
              ›
            </button>
          )}

          {/* Mobile: horizontal scroll. Desktop (md+): grid.
              5. FIX: "flex-nowrap" + "overflow-y-hidden" explicitly add kiye hain
                 taaki row kabhi bhi neeche wrap na ho aur vertical scrollbar na aaye.
                 "items-start" bhi laga diya taaki cards ki height alag-alag ho to
                 bhi row apni natural height se zyada na phaile. */}
          <div
            ref={scrollRef}
            onScroll={updateArrows}
            className="flex flex-nowrap items-start gap-4 overflow-x-auto overflow-y-hidden no-scrollbar scroll-smooth
                       md:grid md:grid-cols-3 lg:grid-cols-5 md:gap-6 md:overflow-visible"
          >
            {OCCASIONS.map((item) => (
              <Link
                title={item.name}
                key={item.slug}
                href={`/${item.slug}/`}
                className="flex-shrink-0 w-[42vw] md:w-auto group"
              >
                <div className="w-full aspect-square overflow-hidden rounded-md border border-gray-200 bg-gray-50">
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <p className="mt-3 text-center text-[14px] md:text-[15px] text-black group-hover:text-[#c99000] transition-colors">
                  {item.name}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;