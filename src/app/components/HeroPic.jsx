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
          

          {/* pointer-events-auto turns clicks back on, just for the button */}
          
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