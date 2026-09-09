"use client";

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FaGlassCheers, FaArrowRight } from 'react-icons/fa'
import { HiSparkles } from 'react-icons/hi2'

// ============================================================
// STEP 0: Blur placeholder helper
// - `next/image` ka `placeholder="blur"` sirf static imports pe
//   automatically kaam karta hai. Yahan images string path (public
//   folder) se aa rahi hain, isliye ek chhota shimmer SVG ko khud
//   base64 me convert karke `blurDataURL` bana rahe hain - isse
//   image load hone tak ek soft blur/shimmer dikhta hai, sudden
//   "pop-in" nahi hota (premium feel).
// ============================================================
const shimmer = (w, h) => `
<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#f3f1ea" offset="20%" />
      <stop stop-color="#e8e4d8" offset="50%" />
      <stop stop-color="#f3f1ea" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#f3f1ea" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
</svg>`

const toBase64 = (str) =>
  typeof window === 'undefined'
    ? Buffer.from(str).toString('base64')
    : window.btoa(str)

const shimmerDataURL = (w, h) => `data:image/svg+xml;base64,${toBase64(shimmer(w, h))}`

// ============================================================
// STEP 1: Real products (from the two product pages you shared)
// - `image` yahan direct file path hai (jaise tumne rakha), public
//   folder se serve hoga
// - `seo_url` product ke URL se liya hai, taaki card click pe
//   uske real product page pe le jaaye (jaise HomeProductSlider
//   me `Link href={`/${item.seo_url}`}` hota hai)
// ============================================================
const WEDDING_SEASON_PRODUCTS = [
  {
    id: 1,
    name: 'Taittinger Prestige Rose Champagne Pink Gift Basket',
    price: 249.0,
    image: '/pink-gift-basket-eiffel-tower-wedding.avif',
    seo_url: 'taittinger-prestige-rose-champagne-pink-gift-basket',
  },
  {
    id: 2,
    name: 'Pauillac Wine & Tiffany Glasses Wedding Gift For Couple',
    price: 399.0,
    image: '/pauillac-wine-and-tiffany-glasses-gift-set.avif', // TODO: real path daalna
    seo_url: 'pauillac-wine-and-tiffany-glasses-gift-set',
  },
  {
    id: 3,
    name: 'Wedding Special Le Pauillac De Chateau Latour Red Wine',
    price: 199.0,
    image: '/le-pauillac-de-chateau-latour-french-red-wine.avif',
    seo_url: 'le-pauillac-de-chateau-latour-french-red-wine',
  },
  {
    id: 4,
    name: 'Crystal Design La Marca Prosecco',
    price: 119.0,
    image: '/crystal-design-la-marca-prosecco.avif',
    seo_url: 'crystal-design-la-marca-prosecco',
  },
]

// ---------------------------------------------------------------------------
// STEP 2: PRODUCT CARD (premium, minimal - no animation)
// - Image upar (plain, koi zoom/scale animation nahi), naam aur price
//   neeche ek clean white strip me simple black text - jaise ek
//   gallery/catalog card, loud effects hata diye taaki premium lage.
// - Sirf hover pe border thoda gold ho jaata hai aur shadow halka
//   badhta hai - baaki koi movement/animation nahi.
// - `placeholder="blur"` add kiya - image load hone tak shimmer dikhega.
// ---------------------------------------------------------------------------
const WeddingProductCard = ({ product }) => {
  return (
    <Link
      href={`/${product.seo_url}`}
      aria-label={`View ${product.name}`}
      className="group flex flex-col overflow-hidden rounded-none border border-gray-100 bg-white shadow-sm transition-shadow duration-300 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#98022e]"
    >
      {/* IMAGE - plain, no hover zoom/scale */}
      <div className="relative aspect-square w-full bg-[#f9f9f9]">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover"
          placeholder="blur"
          blurDataURL={shimmerDataURL(400, 400)}
        />

        {/* Small champagne-toast badge, top-right corner - wine/wedding cue */}
        <span className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 shadow-sm">
          <FaGlassCheers className="h-3.5 w-3.5 text-[#98022e]" />
        </span>
      </div>

      {/* INFO - matches the rest of the site's product cards: black
          name, maroon price - taaki isi page pe dikhne wale doosre
          product cards se look zyada alag na lage */}
      <div className="px-3 py-3">
        <p className="font-sumana text-[13px] font-medium leading-snug text-[#333] line-clamp-2">
          {product.name}
        </p>
        <p className="mt-1 font-hind-madurai text-[15px] font-semibold text-[#98022e]">
          ${product.price.toFixed(2)}
        </p>
      </div>
    </Link>
  )
}

// ============================================================
// STEP 3: Main component - Seasonal (Wedding) Gifts Section
// NOTE: uploaded photo hero banner ke background me hai (top part),
// height pehle se kam kar di hai; product grid neeche white bg pe.
// ============================================================
const SeasonalComponent = () => {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* ============================================================
          STEP 4: Hero banner - uploaded wedding photo as background
          - Height pehle 340/420px thi, ab 200/260px kar di (kam)
          ============================================================ */}
      <div className="relative h-[150px] w-full overflow-hidden md:h-[190px]">
        <Image
          src="/whitecouple.png"
          alt="Wdding-Gift-Baskets-Dc-Wine-&-Spirits"
          fill
          priority
          className="object-cover"
          sizes="100vw"
          placeholder="blur"
          blurDataURL={shimmerDataURL(1600, 400)}
        />

        {/* Dark-to-white gradient overlay for text contrast + blend */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-white" />

        {/* Twinkle sparkle icons scattered over the hero photo */}
       

        {/* ============================================================
            STEP 4c: Falling rose petals + rising champagne bubbles -
            ab wapas SIRF hero photo tak limited hain (ribbons hata
            diye hain, sirf petals + bubbles rakhe). Fall/rise distance
            bhi hero ki chhoti height ke hisaab se kam kar di hai.
            ============================================================ */}
        <span className="pointer-events-none absolute left-[10%] top-0 z-10 h-3 w-3 rounded-tl-full rounded-br-full bg-pink-300/70 animate-[fall_9s_ease-in-out_infinite]" />
        <span
          style={{ animationDelay: '3s', animationDuration: '11s' }}
          className="pointer-events-none absolute left-[40%] top-0 z-10 h-2.5 w-2.5 rounded-tl-full rounded-br-full bg-[#c99000]/60 animate-[fall_11s_ease-in-out_infinite]"
        />
        <span
          style={{ animationDelay: '5s', animationDuration: '10s' }}
          className="pointer-events-none absolute left-[68%] top-0 z-10 h-3 w-3 rounded-tl-full rounded-br-full bg-pink-200/70 animate-[fall_10s_ease-in-out_infinite]"
        />
        <span
          style={{ animationDelay: '1.5s', animationDuration: '12s' }}
          className="pointer-events-none absolute left-[90%] top-0 z-10 h-2.5 w-2.5 rounded-tl-full rounded-br-full bg-[#e8c874]/60 animate-[fall_12s_ease-in-out_infinite]"
        />

        <span className="pointer-events-none absolute bottom-2 left-[18%] z-10 h-1.5 w-1.5 rounded-full border border-[#e8c874]/60 bg-[#e8c874]/50 animate-[bubbleRise_5s_ease-in_infinite]" />
        <span
          style={{ animationDelay: '1.2s' }}
          className="pointer-events-none absolute bottom-2 left-[35%] z-10 h-1 w-1 rounded-full border border-white/50 bg-white/60 animate-[bubbleRise_4s_ease-in_infinite]"
        />
        <span
          style={{ animationDelay: '2.4s' }}
          className="pointer-events-none absolute bottom-2 left-[60%] z-10 h-2 w-2 rounded-full border border-[#e8c874]/60 bg-[#e8c874]/50 animate-[bubbleRise_6s_ease-in_infinite]"
        />
        <span
          style={{ animationDelay: '0.6s' }}
          className="pointer-events-none absolute bottom-2 left-[80%] z-10 h-1 w-1 rounded-full border border-white/50 bg-white/70 animate-[bubbleRise_4.5s_ease-in_infinite]"
        />

        {/* Heading content - overlaid on the hero photo */}
        <div className="absolute inset-0 flex flex-col items-center justify-end px-3 pb-6 text-center 2xl:px-32">

          {/* STEP 4a: sirf yahan text-shadow strong kiya taaki bright
              photo/white gradient ke upar bhi text saaf padha jaaye -
              baaki kuch touch nahi kiya */}
          <h2 className="mt-3 max-w-full whitespace-nowrap font-sumana text-[clamp(1.2rem,4.3vw,1.875rem)] font-bold text-white [text-shadow:0_2px_10px_rgba(0,0,0,0.8),0_0_2px_rgba(0,0,0,0.9)]">
            Gifts To Celebrate Every &ldquo;I Do&rdquo;
          </h2>

          {/* Hind Madurai -> project convention for body text */}
          <p className="mt-2 max-w-xl font-hind-madurai text-sm text-white [text-shadow:0_1px_6px_rgba(0,0,0,0.75)] md:text-base">
            Curated wine &amp; spirits gift sets for the newlyweds, the
            wedding party, and every toast in between.
          </p>

          {/* STEP 4b: CTA button - neeche product grid tak smooth
              scroll karta hai (#wedding-season-products anchor se)
              - Filhaal comment out kar diya hai */}
          {/* 
            href="#wedding-season-products"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-xs font-semibold uppercase tracking-widest text-[#98022e] shadow-md transition-transform duration-200 hover:scale-105"
          >
            Shop The Collection
            <FaArrowRight className="h-3 w-3" />
          </a> */}
        </div>
      </div>

      {/* ============================================================
          STEP 5: Product grid - uses WeddingProductCard above
          - `id` yahan diya taaki hero ka CTA button seedha yahan
            scroll kar sake
          - STEP 5a: slider hint - mobile pe cards ka width ab
            calc(50%-8px) ki jagah 44% hai, taaki teesra card thoda
            sa "peek" ho aur user ko pata chale ki aur scroll karna hai
          ============================================================ */}
      <div
        id="wedding-season-products"
        className="relative mx-auto flex max-w-6xl scroll-mt-4 snap-x snap-mandatory gap-4 overflow-x-auto px-3 py-8 no-scrollbar md:grid md:grid-cols-4 md:gap-6 md:overflow-visible 2xl:px-32"
      >
        {WEDDING_SEASON_PRODUCTS.map((product) => (
          <div key={product.id} className="w-[44%] flex-shrink-0 snap-start sm:w-[calc(50%-8px)] md:w-full">
            <WeddingProductCard product={product} />
          </div>
        ))}
      </div>

      {/* ============================================================
          STEP 5b: View All button - ab arrow icon ke saath, thoda
          zyada "actionable" feel ke liye
          ============================================================ */}
      <div className="relative mx-auto max-w-6xl px-3 pb-10 text-center 2xl:px-32">
        <Link
          href="/wedding-wine-gift-baskets/"
          className="inline-flex items-center gap-2 bg-[#98022e] border border-white px-6 py-2 text-xs font-semibold uppercase tracking-widest text-white hover:rounded-xl transition-colors duration-300 hover:bg-[#98022e] hover:text-white active:scale-95"
        >
          View All
          <FaArrowRight className="h-2 w-2" />
        </Link>
      </div>

      {/* ============================================================
          STEP 6: Keyframe animations (ab sirf hero ke sparkles ke liye
          use hote hain - product card se hata diye gaye hain)
          ============================================================ */}
      <style jsx global>{`
        @keyframes twinkle {
          0%,
          100% {
            opacity: 0.25;
            transform: scale(0.85);
          }
          50% {
            opacity: 1;
            transform: scale(1.15);
          }
        }

        @keyframes fall {
          0% {
            transform: translateY(-10px) translateX(0) rotate(0deg);
            opacity: 0;
          }
          8% {
            opacity: 1;
          }
          /* continuous fall - hero ki chhoti height ke andar hi rehta
             hai ab (ribbons/full-page wala scale hata diya) */
          40% {
            transform: translateY(70px) translateX(10px) rotate(140deg);
          }
          70% {
            transform: translateY(130px) translateX(30px) rotate(300deg);
            opacity: 0.9;
          }
          100% {
            transform: translateY(190px) translateX(45px) rotate(480deg);
            opacity: 0;
          }
        }

        @keyframes bubbleRise {
          0% {
            transform: translateY(0) scale(0.8);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          80% {
            transform: translateY(-140px) scale(1);
            opacity: 0.8;
          }
          /* STEP: burst/pop - upar pahunch ke jaldi se phail ke
             gayab ho jaati hai, static fade ki jagah */
          92% {
            transform: translateY(-150px) scale(1.7);
            opacity: 0.5;
          }
          100% {
            transform: translateY(-155px) scale(2.3);
            opacity: 0;
          }
        }
      `}</style>
    </section>
  )
}

export default SeasonalComponent