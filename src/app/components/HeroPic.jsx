"use client"
import React from "react";
import { useGetHomePageTopBanner } from "../api/hooks/category/useHomeBanner";
import Link from "next/link";


const HeroPic = () => {
  const { data: bannerData, isLoading, isError } = useGetHomePageTopBanner();

  if (isLoading) return <div className="w-full aspect-[1280/390] bg-gray-200 animate-pulse"></div>;
  if (isError) return null;

  const banner = bannerData?.sections?.[0]?.items?.[0]; 
  const slug = banner?.seo_url;
  const imageUrl = banner?.image;
  const altText = banner?.alt;
  const titleText = banner?.title;

  // YAHAN CONSOLE.LOG LAGAYEIN - Check karne ke liye ki data proper aa raha hai ya nahi
  console.log("Image URL Output:", `${process.env.NEXT_PUBLIC_PRODUCTION_IMAGE_URL}${imageUrl}`);

  return (
    <section 
      className="w-full lg:px-3 2xl:px-32 lg:py-4" 
      aria-label="Top Banner"
    >
      <Link
      href={slug}
      >

      <img
        // 🛠️ FIX: process.env add kiya gaya hai yahan
        src={`${process.env.NEXT_PUBLIC_PRODUCTION_IMAGE_URL || ''}${imageUrl}`} 
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