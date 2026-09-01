"use client";

import { Phone, Download } from "lucide-react";

// 1. Bulk Order / Small Order section
// - Background bottle image with dark overlay
// - Stacked on mobile, side-by-side from `lg` up
// - Uses site's px-3 2xl:px-32 padding convention
export default function BulkOrderBanner() {
  return (
    <section className="relative w-full mt-4 lg:mt-6">
      {/* 2. Background image + dark overlay */}
      <img
        src="/champagne-dc-banner-1600x350.webp"
        alt="Champagne bottles background"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-black/60" />

      {/* 3. Content wrapper - padding convention applied here */}
      <div className="relative px-3 2xl:px-32 py-12 lg:py-20">
        <div className="flex flex-col lg:flex-row lg:items-start gap-10 lg:gap-16">
          {/* 4. Bulk Order column */}
          <div className="flex-1">
            <h2 className="font-serif text-3xl md:text-4xl text-white">
              Bulk Order
            </h2>
            <p className="mt-2 text-sm md:text-base text-gray-200">
              5 recipients or more
            </p>
            <hr className="my-4 border-gray-400/50" />

            <div className="flex flex-col sm:flex-row gap-3">
              {/* 4a. Call us button - outline style */}
              <a
                href="tel:+12024598489"
                className="flex items-center justify-center gap-2 border border-white text-white px-5 py-3 text-sm md:text-base hover:bg-white hover:text-black transition-colors"
              >
                <Phone size={16} />
                Call us today (202) 459-8489
              </a>

              {/* 4b. Download form button - filled white */}
              <a
                download={true}
                href="/bulk-order-form.xlsx"
                className="flex items-center justify-center gap-2 bg-white text-black px-5 py-3 text-sm md:text-base hover:bg-gray-200 transition-colors"
              >
                <Download size={16} />
                Download Our Large Order Form
              </a>
            </div>
          </div>

          {/* 5. Small Order column */}
          <div className="flex-1">
            <h2 className="font-serif text-3xl md:text-4xl text-white">
              Small Order
            </h2>
            <p className="mt-2 text-sm md:text-base text-gray-200">
              Less than 5 recipients
            </p>
            <hr className="my-4 border-gray-400/50" />

            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <p className="text-white text-sm md:text-base">
                Simply place your order online
              </p>

              {/* 5a. See all products button */}
              <a
                href="/products/"
                className="bg-white text-black px-6 py-3 text-sm md:text-base text-center hover:bg-gray-200 transition-colors"
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
