"use client"
import React from "react";
import { useGetHomePageTopBanner } from "../api/hooks/category/useHomeBanner";
import Link from "next/link";


const HeroPic = ({ data, isLoading: propLoading, isError: propError }) => {
  const hookResult = useGetHomePageTopBanner({ enabled: !data && propLoading === undefined });
  const finalData = data !== undefined ? data : hookResult.data;
  const isLoading = propLoading !== undefined ? propLoading : hookResult.isLoading;
  const isError = propError !== undefined ? propError : hookResult.isError;

  if (isLoading) return <div className="w-full aspect-[1280/390] bg-gray-200 animate-pulse"></div>;
  if (isError) return null;

  const banner = finalData?.sections?.[0]?.items?.[0];
  const slug = banner?.seo_url;
  const imageUrl = banner?.image;
  const altText = banner?.alt;
  const titleText = banner?.title;
  const customUrl = banner?.custom_url;
  console.log("image url", imageUrl, "slug", slug, "customUrl", customUrl, "altText", altText, "titleText", titleText);

  const bannerLink = slug ? `/${slug}` : customUrl || "/";

  return (
    <section
      className="w-full lg:px-3 2xl:px-32 lg:py-4"
      aria-label="Top Banner"
    >
      <Link
      href={bannerLink}
      >

      <img
        src={`${process.env.NEXT_PUBLIC_PRODUCTION_IMAGE_URL}${imageUrl}`}
        title={altText}
        alt={altText}
        width={1280}
        height={390}
        loading="eager"
        fetchPriority="high"
        decoding="sync"
        className="block w-full h-auto max-w-full aspect-[1280/390] object-cover transition-[0.2s] cursor-pointer"
      />
      </Link>
    </section>
  );
};

export default HeroPic;
