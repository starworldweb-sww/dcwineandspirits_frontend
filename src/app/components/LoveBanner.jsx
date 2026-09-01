"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useLovebyBanner } from "../api/hooks/category/useLovebyBanner";

const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_PRODUCTION_IMAGE_URL;

// Manual text overrides for select banners — API only gives image + link,
// so title/subtitle/local-image/badge for specific slots is maintained here.
const BANNER_TEXT_OVERRIDES = {
  0: {
    title: "Veuve Clicquot & Flutes",
    subtitle: "Champagne gift set — shop now",
    badge: "6% OFF",
    image: "/veuve-clicquot-champagne-and-flutes-giftset-1047x349.jpg",
  },
  1: {
    title: "Graduation Gift Basket",
    subtitle: "Gift sets for grads",
    badge: "NEW",
    image: "/graduation-love.jpg",
  },
};

// Ek hi consistent card: image + neeche title/subtitle strip.
// Viewport me aane par halka fade-up ke sath reveal hota hai.
function BannerCard({ href, target, alt, image, title, subtitle, badge }) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const isDiscount = badge?.toLowerCase().includes("off");

  return (
    <Link
      ref={ref}
      href={href}
      target={target}
      className={`group relative block w-full shrink-0 snap-start overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-500 ease-out hover:shadow-md hover:border-[#98022e]/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#98022e]/50 focus-visible:ring-offset-2 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <div className="relative w-full overflow-hidden aspect-[640/220] bg-gray-50">
        <img
          src={image}
          alt={alt || title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {badge && (
          <span
            className={`absolute top-2 left-2 rounded-sm px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm ${
              isDiscount ? "bg-[#98022e]" : "bg-[#c99000]"
            }`}
          >
            {badge}
          </span>
        )}
      </div>

      {title && (
        <div className="flex items-center justify-between gap-3 border-t border-gray-100 px-4 py-3">
          <div className="min-w-0">
            <p className="truncate text-[15px] font-hind-madurai font-semibold text-black group-hover:text-[#98022e] transition-colors">
              {title}
            </p>
            {subtitle && (
              <p className="mt-0.5 line-clamp-1 text-[12.5px] text-gray-500 font-hind-madurai">
                {subtitle}
              </p>
            )}
          </div>

          <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-[#98022e]/30 text-[#98022e] transition-all duration-300 group-hover:translate-x-0.5 group-hover:bg-[#98022e] group-hover:text-white">
            <ChevronRight size={16} />
          </span>
        </div>
      )}
    </Link>
  );
}

const LoveBanner = ({ data, isLoading: propLoading, isError: propError }) => {
  const standalone = propLoading === undefined;
  const bannerHookResult = useLovebyBanner({ enabled: standalone });

  const finalBannersData = data !== undefined ? data : bannerHookResult.data;
  const isLoading = standalone ? bannerHookResult.isLoading : propLoading;
  const isError = standalone ? bannerHookResult.isError : propError;

  if (isLoading || isError) return null;

  return (
    <div className="w-full px-3 2xl:px-32 py-6">
      <div className="flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory md:grid md:grid-cols-2 md:overflow-visible">
        {finalBannersData?.sections?.flatMap((section) =>
          section?.items?.map((item, index) => {
            const href =
              item.type === "custom"
                ? item.custom_url
                : `/${item.seo_url || item.id}`;
            const override = BANNER_TEXT_OVERRIDES[index];

            return (
              <div key={item.id} className="w-[88%] shrink-0 sm:w-[70%] md:w-auto">
                <BannerCard
                  href={href}
                  target={item.type === "custom" ? "_blank" : undefined}
                  alt={item.alt}
                  image={override ? override.image : `${IMAGE_BASE_URL}${item.image}`}
                  title={override?.title}
                  subtitle={override?.subtitle}
                  badge={override?.badge}
                />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default LoveBanner;