"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useLovebyBanner } from "../api/hooks/category/useLovebyBanner";

const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_PRODUCTION_IMAGE_URL;

function RevealBanner({ href, target, alt, image }) {
  return (
    <Link
      href={href}
      target={target}
      className="group relative block w-full overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm hover:shadow-lg hover:border-[#98022e]/30 active:scale-[0.98] hover:-translate-y-1 transition-all duration-300"
    >
      {/* <span className="absolute top-0 left-0 right-0 h-[3px] bg-[#98022e] z-10" /> */}

      <Image
        loading="eager"
        src={image}
        alt={alt}
        width={640}
        height={220}
        className="block w-full h-auto aspect-[640/220] object-cover transition-transform duration-300 group-hover:scale-105"
      />

      {/* subtle bottom gradient overlay for readability if image has text */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {finalBannersData?.sections?.flatMap((section) =>
          section?.items?.map((item) => {
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
              />
            );
          }),
        )}
      </div>
    </div>
  );
};

export default LoveBanner;
