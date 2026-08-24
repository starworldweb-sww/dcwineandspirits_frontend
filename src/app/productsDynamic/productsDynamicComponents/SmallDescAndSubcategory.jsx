import React from 'react'
import { Sumana, Hind_Madurai } from 'next/font/google'
import Link from 'next/link'
import { decodeHtml } from '@/libs/decodeHtml'

// fonts ko CSS variable ke roop mein expose kar rahe hain
// taaki neeche styled-jsx mein (nested h1-h6 aur baaki content pe) use kar sakein
const sumana = Sumana({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-sumana',
  display: 'swap',
})

const hindMadurai = Hind_Madurai({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-hind',
  display: 'swap',
})

const IMAGE_BASE_URL = 'https://www.dcwineandspirits.com/image/'

// 1. Props: parent se smalldesc (HTML string) aur subCategories (array) milega — category API se
const SmallDescAndSubcategory = ({ smalldesc, subCategories = [] }) => {
  // 2. Agar smalldesc hi nahi aaya backend se, kuch render mat karo
  if (!smalldesc && (!subCategories || subCategories.length === 0)) return null

  return (
    // 5. FIX: "min-w-0 w-full" add kiya — isse yeh div apne parent (flex/grid layout)
    //    ko force nahi karega wide hone ke liye. Bina min-w-0 ke, flex items ka
    //    default min-width "auto" hota hai, jo andar ke pills ke natural width
    //    tak shrink hone se rokta hai — isi wajah se page pe horizontal scroll
    //    aa raha tha aur last pill viewport se bahar cut ho rahi thi.
    <div className={`w-full min-w-0 px-2 py-2 ${sumana.variable} ${hindMadurai.variable}`}>
      {smalldesc && (
        // 3. small-description-content class isliye taaki backend ke inline styles/tags
        //    hamare Tailwind ke sath conflict na karein
        <div
          className="small-description-content"
          // 4. decodeHtml zaroori hai kyunki API se aane wala HTML double-encoded hai
          //    (jaise &amp;nbsp; , &amp;amp; etc.) — pehle decode, phir render
          dangerouslySetInnerHTML={{ __html: decodeHtml(smalldesc) }}
        />
      )}

      {/* ---- Subcategory pills (solid brand color, text inside, no images) ---- */}
      {subCategories && subCategories.length > 0 && (
        // 6. FIX: "min-w-0" yahan bhi zaroori hai — outer div se inherited overflow
        //    ko yeh wrapper bhi contain kare, taaki scroll sirf pills row ke andar
        //    ho, page ke andar nahi
        <div className="relative mt-6 w-full">
          {/* edge fade — right side pe hint deta hai ki aur items scroll karne ko hain */}
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 sm:w-14" />
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-6" />

          {/* 7. FIX: "min-w-0" is scroll container pe bhi — yeh actual element hai
              jo overflow-x-auto kar raha hai, isliye isko bhi apne aap ko
              shrink karne dena zaroori hai */}
          <div className="scrollbar-none flex min-w-0 snap-x snap-mandatory flex-nowrap gap-3 overflow-x-auto px-1 pb-3">
            {subCategories.map((sub) => (
              <Link
                key={sub.category_id}
                href={`/${sub?.seo_url}`}
                className={`${hindMadurai.className} flex-none snap-start whitespace-nowrap rounded-full bg-[#98022e] px-5 py-3 text-[13px] font-semibold text-white shadow-sm outline-none transition-all duration-150 hover:bg-[#7a0225] active:scale-95 focus-visible:ring-2 focus-visible:ring-[#98022e] focus-visible:ring-offset-2 sm:px-6 sm:py-3.5 sm:text-sm`}
              >
                {sub.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      <style jsx global>{`
        /* ---- base body content — Hind Madurai ---- */
        .small-description-content {
          font-family: var(--font-hind);
          font-size: 16px;
          line-height: 1.7;
          color: #3a3a3a;
        }

        /* ---- headings — Sumana ---- */
        .small-description-content h1,
        .small-description-content h2,
        .small-description-content h3,
        .small-description-content h4,
        .small-description-content h5,
        .small-description-content h6 {
          font-family: var(--font-sumana);
          font-weight: 700;
          color: #1a1a1a;
          line-height: 1.35;
          margin-top: 20px;
          margin-bottom: 10px;
        }

        .small-description-content h1:first-child,
        .small-description-content h2:first-child,
        .small-description-content h3:first-child {
          margin-top: 0;
        }

        .small-description-content h1 {
          font-size: 26px;
        }

        .small-description-content h2 {
          font-size: 22px;
        }

        .small-description-content h3 {
          font-size: 19px;
        }

        .small-description-content h4,
        .small-description-content h5,
        .small-description-content h6 {
          font-size: 17px;
        }

        /* ---- paragraphs & spacing ---- */
        .small-description-content p {
          margin: 0 0 14px 0;
        }

        .small-description-content p:last-child {
          margin-bottom: 0;
        }

        /* ---- emphasis ---- */
        .small-description-content strong,
        .small-description-content b {
          font-weight: 700;
          color: #1a1a1a;
        }

        .small-description-content em,
        .small-description-content i {
          font-style: italic;
        }

        /* ---- links ---- */
        .small-description-content a {
          color: #98022e;
          text-decoration: underline;
          text-underline-offset: 2px;
          transition: color 0.15s ease;
        }

        .small-description-content a:hover {
          color: #7a0225;
        }

        /* ---- lists ---- */
        .small-description-content ul,
        .small-description-content ol {
          margin: 0 0 14px 0;
          padding-left: 22px;
        }

        .small-description-content li {
          margin-bottom: 6px;
        }

        .small-description-content li:last-child {
          margin-bottom: 0;
        }

        /* ---- images ---- */
        .small-description-content img {
          max-width: 100%;
          height: auto;
          border-radius: 4px;
        }

        /* ---- tables ---- */
        .small-description-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 0 0 14px 0;
        }

        .small-description-content th,
        .small-description-content td {
          border: 1px solid #e0e0e0;
          padding: 8px 10px;
          text-align: left;
        }

        .small-description-content th {
          background: #f8f8f8;
          font-weight: 600;
        }

        /* ---- blockquote ---- */
        .small-description-content blockquote {
          margin: 0 0 14px 0;
          padding: 10px 16px;
          border-left: 3px solid #98022e;
          background: #f8f8f8;
          font-style: italic;
          color: #555;
        }

        /* ---- responsive description ---- */
        @media (max-width: 640px) {
          .small-description-content {
            font-size: 15px;
            line-height: 1.6;
          }

          .small-description-content h1 {
            font-size: 20px;
          }

          .small-description-content h2 {
            font-size: 18px;
          }

          .small-description-content h3 {
            font-size: 17px;
          }
        }
        /* ---- subcategory pills: hide scrollbar cross-browser ---- */
        .scrollbar-none {
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none; /* IE/Edge */
        }
        .scrollbar-none::-webkit-scrollbar {
          display: none; /* Chrome/Safari */
        }
      `}</style>
    </div>
  )
}

export default SmallDescAndSubcategory