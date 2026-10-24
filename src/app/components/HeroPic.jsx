"use client";
import React from "react";
import Image from "next/image";
import { useGetHomePageTopBanner } from "../api/hooks/category/useHomeBanner";
import Link from "next/link";

const HeroPic = ({ data, isLoading: propLoading, isError: propError }) => {
  const hookResult = useGetHomePageTopBanner({
    enabled: !data && propLoading === undefined,
  });
  const finalData = data !== undefined ? data : hookResult.data;
  const isLoading =
    propLoading !== undefined ? propLoading : hookResult.isLoading;
  const isError = propError !== undefined ? propError : hookResult.isError;

  if (isLoading)
    return (
      <div className="w-full aspect-[1280/390] bg-gray-200 animate-pulse"></div>
    );
  if (isError) return null;

  const banner = finalData?.sections?.[0]?.items?.[0];
  const slug = banner?.seo_url;
  const imageUrl = banner?.image;
  const altText = banner?.alt;
  const titleText = banner?.title;
  const customUrl = banner?.custom_url;
  const bannerLink = slug ? `/${slug}` : customUrl || "/";

  return (
    <section
      className="w-full lg:px-3 2xl:px-32 lg:py-4"
      aria-label="Top Banner"
    >
      {/* The wrapper is relative so the text overlay can sit on top of the image.
          The image link and the button link are siblings, because a link can't live inside another link. */}
      <div className="relative">
        <Link href={bannerLink} className="block">
          <Image
            src={`${process.env.NEXT_PUBLIC_PRODUCTION_IMAGE_URL}${imageUrl}`}
            title={altText}
            alt={altText}
            width={1280}
            height={390}
            loading="eager"
            priority
            className="block w-full h-auto max-w-full aspect-[1280/390] object-cover transition-[0.2s] cursor-pointer"
          />
        </Link>

        {/* Overlay on the left side, centered vertically.
            pointer-events-none lets clicks on the text fall through to the image link below. */}
        <div className="absolute inset-y-0 left-0 w-[48%] flex flex-col items-start justify-center gap-2 md:gap-4 lg:gap-5 pl-[5%] pointer-events-none">
          <p className="font-[family-name:var(--font-new-rocker)] text-white text-xl md:text-4xl lg:text-5xl 2xl:text-6xl leading-[1.1]">
            <span className="spooky-shiver block">No Tricks,</span>
            {/* Negative delay so the two lines never shake in sync */}
            <span
              className="spooky-shiver block"
              style={{ animationDelay: "-0.2s" }}
            >
              Just <span className="text-[#e66c2c]">Gift-Worthy</span> Treats.
            </span>
          </p>

          {/* pointer-events-auto turns clicks back on, just for the button */}
          <Link
            href={bannerLink}
            className=" font-[family-name:var(--font-new-rocker)] pointer-events-auto w-fit px-3 py-1 md:px-6 md:py-2 lg:px-9 lg:py-3 text-[9px] md:text-[12px] lg:text-[14px] font-bold uppercase tracking-widest rounded-full bg-[#0B1C24]/85 backdrop-blur-sm border-2 border-[#FF7518] text-[#FF9A3C] shadow-[0_0_18px_rgba(255,117,24,0.7)] transition-all duration-300 hover:bg-[#FF7518] hover:text-[#0B1C24] hover:shadow-[0_0_32px_rgba(255,117,24,1)] hover:scale-105 active:scale-95 mt-2"
          >
            Shop Now
          </Link>
        </div>
      </div>

      <style jsx global>{`
        /* Very light, uneven jitter so it looks like a subtle shiver */
        @keyframes spooky-shiver {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          10% { transform: translate(-0.5px, 0.5px) rotate(-0.15deg); }
          20% { transform: translate(0.5px, -0.5px) rotate(0.15deg); }
          30% { transform: translate(-0.5px, -0.5px) rotate(0deg); }
          40% { transform: translate(0.5px, 0.5px) rotate(0.15deg); }
          50% { transform: translate(-0.5px, 0) rotate(-0.15deg); }
          60% { transform: translate(0.5px, 0.5px) rotate(0deg); }
          70% { transform: translate(0, -0.5px) rotate(0.15deg); }
          80% { transform: translate(-0.5px, 0.5px) rotate(-0.15deg); }
          90% { transform: translate(0.5px, 0) rotate(0deg); }
        }

        /* Shivers for about 3 seconds (7 runs x 0.45s) and then settles.
           It ends exactly where it started, so there's no jump when it stops. */
        .spooky-shiver {
          animation: spooky-shiver 0.45s linear 7;
        }

        /* Respect users who prefer less motion */
        @media (prefers-reduced-motion: reduce) {
          .spooky-shiver {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
};

export default HeroPic;