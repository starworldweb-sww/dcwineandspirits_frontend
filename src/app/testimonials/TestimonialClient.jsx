"use client"; // useState + useQuery use ho raha hai, isliye client component

import React, { useState } from "react";
import Link from "next/link";
import { Star, User } from "lucide-react";
import ProductsHeader from "@/app/components/TittleAndBreadcrumb";
import { useGetTestimonials } from "../api/hooks/getTestimonials";

const breadcrumbs = [{ label: "Testimonials", href: "/testimonials" }];

// Ek page mein kitne reviews dikhane hain
const REVIEWS_PER_PAGE = 12;

// STEP 1: &amp; jaisi HTML entities ko normal text banao
const decodeHtml = (text = "") =>
  text
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");

// STEP 2: Date ko readable format mein badlo (e.g. "March 4, 2026")
const formatReviewDate = (dateString) =>
  new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

// STEP 3: Star rating (filled + empty stars)
const StarRating = ({ rating = 0, size = 15 }) => (
  <div className="flex items-center gap-0.5 shrink-0">
    {[1, 2, 3, 4, 5].map((starNumber) => (
      <Star
        key={starNumber}
        size={size}
        className={
          starNumber <= rating
            ? "fill-[#f5a623] text-[#f5a623]"
            : "text-[#d9d9d9]"
        }
      />
    ))}
  </div>
);

// STEP 4: Avatar - photo ki jagah icon wala round circle
const IconAvatar = () => (
  <div className="shrink-0 h-14 w-14 rounded-full bg-gradient-to-br from-[#f9eef1] to-[#ecd2da] ring-4 ring-[#fbf4f6] flex items-center justify-center">
    <User size={26} strokeWidth={1.75} className="text-[#8c1a3c]" />
  </div>
);

// STEP 5: Ek review ka card
const ReviewCard = ({ review }) => {
  // 👇 "/product/" ko apne actual product route se match karna
  const productLink = review.product_seo_url
    ? `/${review.product_seo_url}`
    : null;

  return (
    <div className="flex gap-4 rounded-2xl border border-[#eeeeee] bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(140,26,60,0.10)]">
      <IconAvatar />

      <div className="flex-1 min-w-0">
        {/* Naam (left) aur stars (right) */}
        <div className="flex items-center justify-between gap-3">
          <p className="text-[15px] font-hind-madurai font-semibold text-[#222222] truncate">
            {review.author}
          </p>
          <StarRating rating={review.rating} />
        </div>

        {/* Date */}
        <p className="text-[12px] text-[#9a9a9a] mt-0.5">
          {formatReviewDate(review.date)}
        </p>

        {/* whitespace-pre-line se \r\n wale line breaks sahi dikhte hain */}
        <p className="mt-3 text-[14px] leading-relaxed font-hind-madurai text-[#666666] whitespace-pre-line">
          {decodeHtml(review.text)}
        </p>

        {/* Kis product pe review hai (product na mile to null aata hai) */}
        {review.product_name && (
          <p className="mt-3 pt-3 border-t border-[#f2f2f2] text-[13px] text-[#8a8a8a]">
            Reviewed:{" "}
            {productLink ? (
              <Link
                href={productLink}
                className="font-medium text-[#8c1a3c] hover:underline"
              >
                {decodeHtml(review.product_name)}
              </Link>
            ) : (
              <span className="font-medium text-[#555555]">
                {decodeHtml(review.product_name)}
              </span>
            )}
          </p>
        )}
      </div>
    </div>
  );
};

const TestimonialClient = () => {
  // STEP 6: current page ka state
  const [currentPage, setCurrentPage] = useState(1);

  // STEP 7: API se data lao
  const { data, isLoading, isError } = useGetTestimonials(
    currentPage,
    REVIEWS_PER_PAGE
  );

  const reviews = data?.reviews ?? [];
  const averageRating = data?.averageRating ?? 0;
  const totalReviews = data?.pagination?.totalReviews ?? 0;
  const totalPages = data?.pagination?.totalPages ?? 0;

  // Page badalne pe upar scroll karo
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    // ✅ CHANGE 1: font-['cambriaregular'] ki jagah font-hind-madurai
    <div className="font-hind-madurai text-[#333333] w-full">
      <ProductsHeader categoryName="Testimonials" breadcrumbs={breadcrumbs} />

      <div className="w-full px-3 lg:px-3 2xl:px-32 py-10">
        {/* Cards ko beech mein rakhne ke liye narrow container */}
        <div className="mx-auto w-full max-w-3xl">
          {/* Loading state */}
          {isLoading && (
            <div className="flex flex-col gap-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="h-32 rounded-2xl bg-[#f3f3f3] animate-pulse"
                />
              ))}
            </div>
          )}

          {/* Error state */}
          {isError && (
            <p className="text-center text-[#8c1a3c] py-16">
              Something went wrong while loading testimonials. Please try again
              later.
            </p>
          )}

          {/* Empty state */}
          {!isLoading && !isError && reviews.length === 0 && (
            <p className="text-center text-[#666666] py-16">
              No testimonials yet.
            </p>
          )}

          {/* Success state */}
          {!isLoading && !isError && reviews.length > 0 && (
            <>
              {/* Average rating summary */}
       
              {/* Reviews list (ek ke neeche ek) */}
              <div className="flex flex-col gap-4">
                {reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-10">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-5 py-2 rounded-full border border-[#8c1a3c] text-[#8c1a3c] text-[14px] transition hover:bg-[#8c1a3c] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-[#8c1a3c]"
                  >
                    Previous
                  </button>
                  <span className="text-[14px] text-[#777777]">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-5 py-2 rounded-full bg-[#8c1a3c] text-white text-[14px] transition hover:bg-[#721530] disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestimonialClient;