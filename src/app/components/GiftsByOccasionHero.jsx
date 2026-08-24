"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { Sumana } from "next/font/google";
import { Gift } from "lucide-react";
import { useGetGiftByOccasion } from "../api/hooks/category/useGiftsByOccassion";
import { useLovebyBanner } from "../api/hooks/category/useLovebyBanner";


const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_PRODUCTION_IMAGE_URL;

// 9. "View all" ka target page — ek jagah define kiya hai taaki mobile aur
//    desktop dono grids isi ek constant ko use karein, alag-alag hardcode na ho
const VIEW_ALL_OCCASIONS_HREF = "/occasion-gift-basket/";

// Scroll me viewport me aane par left/right se slide-in hone wala banner card.
// direction: "left" | "right" — kis taraf se andar aayega.
function RevealBanner({ direction = "left", href, target, alt, image }) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // sirf ek baar animate ho, baar baar nahi
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const hiddenTransform =
    direction === "left" ? "-translate-x-16" : "translate-x-16";

  return (
    <Link
      ref={ref}
      href={href}
      target={target}
      className={`group block w-full overflow-hidden shadow-sm hover:shadow-lg active:scale-[0.98] hover:-translate-y-1 transition-all duration-700 ease-out ${
        isVisible ? "opacity-100 translate-x-0" : `opacity-0 ${hiddenTransform}`
      }`}
    >
      <img
        src={image}
        alt={alt}
        width={640}
        height={220}
        loading="lazy"
        className="block w-full h-auto aspect-[640/220] object-cover transition-transform duration-300 group-hover:scale-105"
      />
    </Link>
  );
}

// 10. "View All Occasions" tile — dono grids (mobile + desktop) mein same
//     dikhna chahiye, isliye ek chhota shared component bana diya. Modern
//     look ke liye: diagonal maroon→black gradient, ek circular glass-style
//     icon badge (Gift icon), aur hover pe icon-badge scale-up + arrow
//     slide-in — baaki tiles ke beech yeh clearly ek premium CTA jaisa lage
function ViewAllOccasionsTile({ variant = "mobile" }) {
  const isMobile = variant === "mobile";
  return (
    <Link
      title="View All Occasions"
      href={VIEW_ALL_OCCASIONS_HREF}
      className="group relative flex w-full lg:hidden aspect-square flex-col items-center justify-center overflow-hidden rounded-xl bg-[#980145] text-white text-center shadow-sm hover:shadow-xl active:scale-95 hover:-translate-y-1 transition-all duration-300"
    >
      {/* subtle decorative circle — gold accent, isse flat gradient thoda depth le leta hai */}
      <span className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-[#c99000]/20 blur-xl transition-transform duration-500 group-hover:scale-125" />

      {/* icon badge — glassy circle, hover pe halka scale-up */}
      <span className="relative z-10 flex items-center justify-center rounded-full bg-white/15 backdrop-blur-sm ring-1 ring-white/25 transition-transform duration-300 group-hover:scale-110 group-hover:bg-white/25 h-10 w-10 sm:h-12 sm:w-12 border-white border-2">
        <Gift size={isMobile ? 18 : 22} strokeWidth={2} />
      </span>

      <span className={`relative z-10 mt-2 font-semibold leading-snug ${isMobile ? "text-[12.5px] px-2" : "text-[15px] px-3"}`}>
        Explore 
        <br />
       All Occasions
      </span>

      {/* <span className="relative z-10 mt-1.5 flex items-center gap-1 text-[11px] font-medium text-[#e8c98a] transition-transform duration-300 group-hover:translate-x-1">
        Explore
        <ArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-0.5" />
      </span> */}
    </Link>
  );
}


const GiftsByOccasionHero = ({ data, bannersData, isLoading: propLoading, isError: propError }) => {
  const standalone = propLoading === undefined;
  const giftHookResult = useGetGiftByOccasion({ enabled: standalone });
  const bannerHookResult = useLovebyBanner({ enabled: standalone });

  const finalGiftData = data !== undefined ? data : giftHookResult.data;
  const finalBannersData = bannersData !== undefined ? bannersData : bannerHookResult.data;
  const isLoading = standalone ? (giftHookResult.isLoading || bannerHookResult.isLoading) : propLoading;
  const isError = standalone ? (giftHookResult.isError || bannerHookResult.isError) : propError;

  const occasionSection = Array.isArray(finalGiftData?.sections)
    ? finalGiftData.sections.find((section) => Array.isArray(section.items))
    : null;

  const occasions = (occasionSection?.items || []).map((item) => ({
    name: item.title,
    slug: item.seo_url,
    image: `${IMAGE_BASE_URL}${item.image}`,
    href: item.custom_url ? item.custom_url : `/${item.seo_url}/`,
  }));

  return (
    <>
      <div className="w-full px-3 2xl:px-32 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {finalBannersData?.sections?.flatMap(section =>
            section?.items?.map((item, index) => {
              const href =
                item.type === "custom"
                  ? item.custom_url
                  : `/${item.seo_url || item.id}`;

              return (
                <RevealBanner
                  key={item.id}
                  href={href}
                  target={item.type === "custom" ? "_blank" : undefined}
                  alt={item.alt}
                  image={`${IMAGE_BASE_URL}${item.image}`}
                  direction={index % 2 === 0 ? "left" : "right"}
                />
              );
            })
          )}
        </div>
      </div>


      <div className={`w-full bg-[#fdfaf5] px-3 2xl:px-32 py-4 `}>

        <div className="text-center max-w-3xl mx-auto mb-8 md:mb-10">
          <h2 className="text-2xl md:text-[24px] font-bold uppercase tracking-widest text-black font-sumana">
            Gifts By Occasion
          </h2>
          <p className="mt-3 text-[16px] md:text-base text-gray-700 leading-relaxed font-hind-madurai">
            Celebrate every moment with thoughtfully curated wine gifts for every occasion.
            <br className="hidden md:block" />
            From birthdays to anniversaries, find the perfect bottle or basket to make it memorable.
          </p>
        </div>

        {isLoading ? (
          <p className="w-full text-center py-6 text-gray-500">Loading...</p>
        ) : isError ? (
          <p className="w-full text-center py-6 text-[#98022e]">
            Failed to load occasions. Please try again.
          </p>
        ) : occasions.length === 0 ? (
          <p className="w-full text-center py-6 text-gray-400">No occasions found.</p>
        ) : (
          <>
            {/* Mobile: hero tile (pehla occasion) 2 rows span karta hai, baaki
                items uske saath chhote grid tiles ki tarah fill hote hain */}
            <div className="grid grid-cols-2 gap-3 md:hidden">
              {occasions.map((item, index) => {
                const isHero = index === 0;
                return (
                  <Link
                    title={item.name}
                    key={item.slug}
                    href={item.href}
                    className={`group relative overflow-hidden bg-white shadow-sm hover:shadow-lg active:scale-95 hover:-translate-y-1 transition-all duration-300 ${
                      isHero ? "row-span-2 rounded-2xl" : "rounded-xl"
                    }`}
                  >
                    {isHero ? (
                      <div className="relative h-full w-full min-h-[160px]">
                        <img
                          src={item.image}
                          alt={item.name}
                          loading="lazy"
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                        <div className="absolute inset-x-0 bottom-0 px-3 py-3">
                          <p className="text-white text-center text-[15px] font-semibold leading-tight drop-shadow">
                            {item.name}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="relative w-full aspect-square overflow-hidden">
                          <img
                            src={item.image}
                            alt={item.name}
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/40 to-transparent" />
                        </div>
                        <p className="py-2 px-1 text-center text-[13px] text-black group-hover:text-[#c99000] transition-colors leading-tight">
                          {item.name}
                        </p>
                      </>
                    )}
                  </Link>
                );
              })}
              {/* 11. Grid ka aakhri tile — hamesha "View All Occasions" button,
                  chahe occasions ki count even ho ya odd. Ismein grid mein
                  koi khaali column nahi bachega aur user ko full listing
                  page pe jaane ka clear CTA milega */}
              <div className="rounded-xl overflow-hidden">
                <ViewAllOccasionsTile variant="mobile" />
              </div>
            </div>

            {/* Desktop/tablet: same grid structure, thoda depth/polish add kiya */}
            <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-5 md:gap-6">
              {occasions.map((item) => (
                <Link
                  title={item.name}
                  key={item.slug}
                  href={item.href}
                  className="group"
                >
                  <div className="w-full aspect-square overflow-hidden rounded-xl bg-white shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                    <img
                      src={item.image}
                      alt={item.name}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <p className="mt-3 text-center text-[15px] text-black group-hover:text-[#c99000] transition-colors">
                    {item.name}
                  </p>
                </Link>
              ))}
              {/* 12. Desktop grid mein bhi same "View All Occasions" tile, taaki
                  wahan bhi user ko full list tak jaane ka rasta mile */}
              <ViewAllOccasionsTile variant="desktop" />
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default GiftsByOccasionHero;