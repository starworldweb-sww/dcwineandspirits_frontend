import React from 'react'
import { decodeHtml } from "@/libs/decodeHtml";

const MainDescription = ({ description }) => {
  if (!description) return null;

  return (
    <>
      <div
        className={`
          w-full py-8 px-2 2xl:px-32 max-w-none text-[15px] leading-[1.7] text-[#5a5a5a]

          [&_h2]:text-[18px] sm:[&_h2]:text-[18px] [&_h2]:font-medium [&_h2]:text-[#3d3d3d] [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:leading-snug
          [&_h2:first-child]:mt-0

          [&_h3]:text-[19px] [&_h3]:font-semibold [&_h3]:text-[#3d3d3d] [&_h3]:mt-6 [&_h3]:mb-3

          [&_p]:mb-4 [&_p]:text-[#5a5a5a]

          [&_a]:text-[#98022e] [&_a]:no-underline hover:[&_a]:underline

          [&_strong]:font-semibold [&_strong]:text-[#3d3d3d]
          [&_b]:font-semibold [&_b]:text-[#3d3d3d]

          [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4 [&_ul]:space-y-2
          [&_li]:text-[#5a5a5a]

          [&_.faq]:flex [&_.faq]:flex-col [&_.faq]:gap-4 [&_.faq]:mt-4
          [&_.faq_details]:border-l-4 [&_.faq_details]:border-[#98022e] [&_.faq_details]:bg-[#f8f7f7] [&_.faq_details]:rounded-r-md [&_.faq_details]:p-5

          [&_.faq_summary]:font-semibold [&_.faq_summary]:text-[17px] [&_.faq_summary]:text-[#2a2a2a] [&_.faq_summary]:cursor-pointer [&_.faq_summary]:list-none [&_.faq_summary]:leading-snug

          [&_.faq_details[open]_summary]:mb-3

          [&_.faq_details_p]:mb-0 [&_.faq_details_p]:text-[#5a5a5a]
        `}
        dangerouslySetInnerHTML={{ __html: decodeHtml(description) }}
      />

      {/* summary ka default browser triangle/arrow marker hata rahe hain,
          kyunki screenshot mein koi arrow visible nahi hai */}
      <style jsx global>{`
        .faq summary::-webkit-details-marker {
          display: none;
        }
        .faq summary::marker {
          content: "";
        }
      `}</style>
    </>
  );
};

export default MainDescription