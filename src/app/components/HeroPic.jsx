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
  const customUrl = banner?.custom_url;
  const bannerLink = slug ? `/${slug}` : customUrl || "/";

  return (
    <section
      className="w-full lg:px-3 2xl:px-32 lg:py-4"
      aria-label="Top Banner"
    >
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

        {/* Left side overlay: corporate message (no box) */}
        <div className="absolute inset-y-0 left-0 w-[62%] md:w-[48%] flex items-center pl-[4%] pointer-events-none bg-gradient-to-r from-black/60 via-black/30 to-transparent">
          <div className="flex flex-col items-start gap-1.5 sm:gap-2 md:gap-3 lg:gap-4">
            <p className="text-white font-bold leading-tight drop-shadow-lg text-sm sm:text-lg md:text-2xl lg:text-4xl">
              Gifts That Build
              <span className="block text-[#f6f6f6] shadow-white italic drop-shadow-md text-sm sm:text-lg md:text-2xl lg:text-4xl">
                Lasting Business Bonds
              </span>
            </p>

            <p className="hidden sm:block text-[#f2f2f2] drop-shadow-md text-xs md:text-sm lg:text-base max-w-md">
              Up to 15% off on bulk orders
            </p>

            <div className="flex items-center gap-2 md:gap-3 pointer-events-auto mt-0.5">
              <Link
                href="/corporate/"
                className="hidden sm:inline-block border border-[#f2f2f2] text-[#f2f2f2] hover:bg-[#f2f2f2] hover:text-black font-semibold rounded-full transition-colors px-4 py-1.5 text-xs md:px-6 md:py-2 md:text-sm lg:px-8 lg:py-3 lg:text-base"
              >
                Corporate Enquiry
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroPic;