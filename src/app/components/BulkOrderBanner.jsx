"use client";

import Image from "next/image";
import { Phone, Download } from "lucide-react";

// 1. Bulk Order / Small Order section
// - Background bottle image with dark overlay
// - Stacked on mobile, side-by-side from `lg` up
// - Uses site's px-3 2xl:px-32 padding convention
export default function BulkOrderBanner() {
  return (
    <section className="relative w-full mt-4 lg:mt-6">
      {/* 2. Background image + stronger overlay for readability */}
      <Image
        src="/champagne-dc-banner-1600x350.webp"
        alt="Champagne bottles background"
        fill
        sizes="100vw"
        className="object-cover"
      />
      {/* Darker overlay + subtle bottom gradient so bottle text/label doesn't compete with content */}
      <div className="absolute inset-0 bg-black/70" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30" />

      {/* 3. Content wrapper - padding convention applied here */}
      <div className="relative px-3 2xl:px-32 py-10 lg:py-20">
        <div className="flex flex-col lg:flex-row lg:items-start gap-10 lg:gap-16">
          {/* 4. Bulk Order column */}
          <div className="flex-1">
            <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl text-white">
              Bulk Order
            </h2>
            <p className="mt-2 text-sm md:text-base text-gray-200">
              5 recipients or more
            </p>
            {/* Divider - more visible now */}
            <hr className="my-5 border-gray-400/70" />

            <div className="flex flex-col sm:flex-row gap-3">
              {/* 4a. Call us button - outline style, added subtle backdrop for legibility */}
              <a
                href="tel:+12024598489"
                className="flex items-center justify-center gap-2 w-full sm:w-auto border border-white/80 text-white px-5 py-3.5 text-sm md:text-base backdrop-blur-[2px] hover:bg-white hover:text-black active:bg-white active:text-black transition-colors"
              >
                <Phone size={16} className="shrink-0" />
                <span className="whitespace-nowrap">
                  Call us today (202) 459-8489
                </span>
              </a>

              {/* 4b. Download form button - filled white with shadow for depth */}
              <a
                download={true}
                href="/bulk-order-form.xlsx"
                className="flex items-center justify-center gap-2 w-full sm:w-auto bg-white text-black px-5 py-3.5 text-sm md:text-base shadow-md hover:bg-gray-200 active:bg-gray-200 transition-colors"
              >
                <Download size={16} className="shrink-0" />
                Download Our Large Order Form
              </a>
            </div>
          </div>

          {/* 5. Small Order column - extra top spacing on mobile to separate from Bulk Order */}
          <div className="flex-1 mt-4 lg:mt-0">
            <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl text-white">
              Small Order
            </h2>
            <p className="mt-2 text-sm md:text-base text-gray-200">
              Less than 5 recipients
            </p>
            <hr className="my-5 border-gray-400/70" />

            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <p className="text-white text-sm md:text-base">
                Simply place your order online
              </p>

              {/* 5a. See all products button - shadow for depth, matches Bulk Order buttons */}
              <a
                href="/products/"
                className="w-full sm:w-auto bg-white text-black px-6 py-3.5 text-sm md:text-base text-center shadow-md hover:bg-gray-200 active:bg-gray-200 transition-colors"
              >
                SEE ALL PRODUCTS
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}