"use client";

import { useState } from "react";
import { Sumana, Hind_Madurai } from "next/font/google";
import { ChevronUp, ChevronDown } from "lucide-react";
import { useGetHomePageText } from "../api/hooks/category/useHomePageText";

// 1. Fonts setup
const sumana = Sumana({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-sumana",
});

const hindMadurai = Hind_Madurai({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-hind-madurai",
});

export default function HomepageSeoSection() {
  const [expanded, setExpanded] = useState(false);

  // 0. Data ab yahin fetch ho raha hai - HomePageClient se props (seoData,
  //    isLoading) hata diye, kyunki component khud apna data la sakta hai.
  const { data: seoData, isLoading } = useGetHomePageText();

  if (isLoading) {
    return (
      <section className="w-full bg-[#F1F1F1] px-3 2xl:px-32 py-12 text-center text-gray-500">
        Loading SEO Content...
      </section>
    );
  }

  // 2. Bulletproof extraction based on your exact JSON structure
  const rawContent =
    seoData?.data?.sections?.[0]?.items?.[0]?.content ||
    seoData?.sections?.[0]?.items?.[0]?.content ||
    "";

  // 3. Clean up the custom newline markers
  const formattedContent = rawContent.replace(/\[~nl~\]/g, "");

  // If no content is found, we render nothing (so the page doesn't break)
  if (!formattedContent) return null;

  return (
    <section
      className={`${sumana.variable} ${hindMadurai.variable} w-full`}
      style={{ backgroundColor: "#F1F1F1" }}
    >
      <div className="px-3 2xl:px-32 py-12">

        {/* Content Wrapper with Height Transition */}
        <div
          className={`relative overflow-hidden transition-[max-height] duration-700 ease-in-out ${
            expanded ? "max-h-[5000px]" : "max-h-[350px]"
          }`}
        >
          {/* Inject backend HTML here */}
          <div
            className={`
              font-hind-madurai text-sm md:text-base text-gray-800 leading-relaxed

              /* H2 Styling */
              [&_h2]:font-sumana [&_h2]:text-2xl [&_h2]:md:text-3xl [&_h2]:text-black [&_h2]:mb-3 [&_h2]:mt-8 [&_h2:first-child]:mt-0

              /* H3 Styling */
              [&_h3]:font-sumana [&_h3]:text-base [&_h3]:md:text-lg [&_h3]:font-bold [&_h3]:text-black [&_h3]:mb-3 [&_h3]:mt-6

              /* Links & Paragraphs */
              [&_a]:text-[#b8225a] [&_a]:hover:underline
              [&_p]:mb-4

              /* Grid Styling for the injected "Why Shop" block */
              [&_.row]:flex [&_.row]:flex-wrap [&_.row]:gap-4 [&_.row]:mt-6
              [&_.col-lg-4]:flex-1 [&_.col-lg-4]:min-w-[280px]
            `}
            dangerouslySetInnerHTML={{ __html: formattedContent }}
          />

          {/* Fading overlay at the bottom when collapsed */}
          {!expanded && (
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#F1F1F1] to-transparent pointer-events-none" />
          )}
        </div>

        {/* Show More / Show Less toggle */}
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setExpanded((prev) => !prev)}
            className="flex items-center gap-2 bg-black text-white text-sm px-5 py-2 rounded-full hover:bg-gray-800 transition-colors cursor-pointer"
          >
            {expanded ? (
              <>
                Show Less <ChevronUp size={16} />
              </>
            ) : (
              <>
                Show More <ChevronDown size={16} />
              </>
            )}
          </button>
        </div>

      </div>
    </section>
  );
}