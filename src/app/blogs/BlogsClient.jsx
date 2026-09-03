"use client";

import React, { useState } from 'react';
import Image from "next/image";
import Link from 'next/link';
import { User, Eye, Rss, ArrowRight, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import ProductsHeader from "@/app/components/TittleAndBreadcrumb";
import { useGetAllPosts } from '../api/hooks/blog/useBlogPosts';


const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_PRODUCTION_IMAGE_URL;

const BLOGS_PER_PAGE = 10; // API ka default limit bhi 10 hai (pagination.limit)

// Breadcrumbs - login page ke breadcrumbs array jaisa hi pattern
const breadcrumbs = [
  { label: "Blogs", href: "/blogs" },
];

// 1) Date helper - API "date_created" bhejta hai (e.g. "2026-07-06T04:49:28.000Z"),
//    usko "06" / "Jul" jaise 2 parts mein tod deta hai badge ke liye.
const formatBlogDate = (dateString) => {
  if (!dateString) return { day: "--", month: "" };
  const dateObj = new Date(dateString);
  if (isNaN(dateObj.getTime())) return { day: "--", month: "" };
  return {
    day: String(dateObj.getDate()).padStart(2, "0"),
    month: dateObj.toLocaleString("en-US", { month: "short" }),
  };
};

// 2) Excerpt helper - API ka "description" poora HTML content hai (h2, table,
//    faq sab kuch), isliye tags strip karke sirf plain text ka pehla hissa
//    dikhate hain card mein
const getExcerpt = (html, maxLength = 220) => {
  if (!html) return "";
  const plainText = html
    .replace(/<[^>]*>/g, " ")   // saare HTML tags hata do
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")       // extra spaces clean karo
    .trim();
  if (plainText.length <= maxLength) return plainText;
  return plainText.slice(0, maxLength).trim() + "…";
};

// 3) Reading time helper - description ke plain-text words count karke
//    average reading speed (~225 words/min) se estimated minutes nikalta hai
const getReadingTime = (html) => {
  if (!html) return 1;
  const plainText = html.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ");
  const wordCount = plainText.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.ceil(wordCount / 225);
  return Math.max(1, minutes); // kam se kam 1 min dikhao
};

// 4) Image URL helper - API "catalog/blog/xyz.jpg" jaisa relative path deta
//    hai (bina leading slash ke), isliye IMAGE_BASE_URL ke saath jodna padta hai
const getBlogImageUrl = (imagePath) => {
  if (!imagePath) return "";
  if (imagePath.startsWith("http")) return imagePath;
  const cleanBase = (IMAGE_BASE_URL || "").replace(/\/$/, "");
  const cleanPath = imagePath.replace(/^\//, "");
  return `${cleanBase}/${cleanPath}`;
};

const BlogsClient = ({ initialData }) => {
  // 5) Pagination state - "page" seedha API ko jaata hai
  const [currentPage, setCurrentPage] = useState(1);

  // 6) Real API call - service -> queryKey -> hook layer se
  const { data, isLoading, isFetching, isError } = useGetAllPosts({
    page: currentPage,
    limit: BLOGS_PER_PAGE,
  }, { initialData: currentPage === 1 ? initialData : undefined }
  );

  const posts = data?.posts ?? [];
  const pagination = data?.pagination ?? { total: 0, page: 1, limit: BLOGS_PER_PAGE, totalPages: 1 };
  const totalPages = pagination.totalPages || 1;

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 7) Loading skeleton - jab tak API response nahi aata
  const SkeletonCard = () => (
    <div className="flex flex-col md:flex-row gap-6 py-8 animate-pulse">
      <div className="w-full md:w-[420px] h-[260px] md:h-[300px] rounded-md bg-gray-200 shrink-0" />
      <div className="flex-1 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-1/3" />
        <div className="h-6 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-5/6" />
        <div className="h-10 bg-gray-200 rounded w-40 mt-4" />
      </div>
    </div>
  );

  return (
    <div className="w-full bg-white">

      {/* =============================================================
          8) PAGE HEADER - login page jaisa hi shared ProductsHeader
             component (title + breadcrumb)
      ============================================================= */}
      <ProductsHeader categoryName="Blogs" breadcrumbs={breadcrumbs} />

      {/* =============================================================
          9) BLOG LIST
      ============================================================= */}
      <div className="px-3 2xl:px-32 py-8 md:py-12">

        {/* RSS Feed link */}
        <div className="hidden md:flex justify-end mb-4">
          <Link
            href="/blogs/rss"
            className="flex items-center gap-1.5 text-sm text-[#98022e] hover:text-[#8c1a3c] transition-colors"
          >
            <Rss size={16} />
            <span>RSS Feed</span>
          </Link>
        </div>

        {isLoading || isFetching ? (
          <div className="flex flex-col divide-y divide-gray-200">
            {[1, 2, 3].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : isError ? (
          <p className="text-center text-gray-500 py-10">
            Something went wrong while loading blogs. Please try again.
          </p>
        ) : posts.length === 0 ? (
          <p className="text-center text-gray-500 py-10">No blog posts found.</p>
        ) : (
          <div className="flex flex-col divide-y divide-gray-200">
            {posts.map((post) => {
              const { day, month } = formatBlogDate(post.date_created);
              const authorName = [post.author_firstname, post.author_lastname]
                .filter(Boolean)
                .join(" ");
              const readingMinutes = getReadingTime(post.description);

              return (
                <article
                  key={post.post_id}
                  className="flex flex-col md:flex-row gap-6 py-8 first:pt-0"
                >
                  {/* Blog Image with date badge */}
                  <Link
                    href={`/blogs/${post.slug}`}
                    className="relative shrink-0 w-full md:w-[420px] h-[260px] md:h-[300px] rounded-md overflow-hidden bg-gray-100"
                  >
                    <Image
                      src={getBlogImageUrl(post.image)}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 420px"
                      className="object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-[#98022e] text-white text-center rounded px-2.5 py-1.5 leading-tight shadow-md">
                      <span className="block text-lg font-bold">{day}</span>
                      <span className="block text-[11px] uppercase tracking-wide">{month}</span>
                    </div>
                  </Link>

                  {/* Blog Content */}
                  <div className="flex-1 min-w-0 flex flex-col justify-center">

                    {/* Meta row: author + reading time + views
                        Note: API "comments" field boolean hai (count nahi),
                        isliye comment-count meta yahan se hata diya hai */}
                    <div className="flex items-center flex-wrap gap-4 text-sm text-gray-500 mb-2">
                      {authorName && (
                        <span className="flex items-center gap-1.5">
                          <User size={15} className="text-[#98022e]" />
                          {authorName}
                        </span>
                      )}
                      <span className="flex items-center gap-1.5">
                        <Clock size={15} className="text-[#98022e]" />
                        {readingMinutes} min read
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Eye size={15} className="text-[#98022e]" />
                        {post.views ?? 0}
                      </span>
                    </div>

                    {/* Title */}
                    <Link href={`/blogs/${post.slug}`}>
                      <h2 className="font-sarabun text-xl md:text-2xl font-semibold text-gray-800 hover:text-[#98022e] transition-colors mb-3">
                        {post.title}
                      </h2>
                    </Link>

                    {/* Excerpt - description HTML se plain text nikal kar */}
                    <p className="font-sarabun text-sm md:text-[15px] text-gray-600 leading-relaxed line-clamp-3 mb-5">
                      {getExcerpt(post.description)}
                    </p>

                    {/* Continue Reading button */}
                    <Link
                      href={`/blogs/${post.slug}`}
                      className="inline-flex items-center gap-2 w-fit bg-gray-900 hover:bg-[#98022e] text-white text-xs font-semibold tracking-wider uppercase px-5 py-3 rounded transition-all hover:rounded-xl group"
                    >
                      Continue Reading
                      <ArrowRight size={14} className='group-hover:ml-1 transition-all' />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* =============================================================
            10) PAGINATION - API ke pagination.totalPages se driven
        ============================================================= */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            <button
              type="button"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="Previous page"
              className="w-9 h-9 flex items-center justify-center rounded border border-gray-300 text-gray-600 hover:border-[#98022e] hover:text-[#98022e] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => handlePageChange(page)}
                className={`w-9 h-9 flex items-center justify-center rounded border text-sm font-medium transition-colors cursor-pointer hover:rounded-xl ${page === currentPage
                    ? "bg-[#98022e] border-[#98022e] text-white"
                    : "border-gray-300 text-gray-600 hover:border-[#98022e] hover:text-[#98022e]"
                  }`}
              >
                {page}
              </button>
            ))}

            <button
              type="button"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              aria-label="Next page"
              className="w-9 h-9 flex items-center justify-center rounded border border-gray-300 text-gray-600 hover:border-[#98022e] hover:text-[#98022e] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogsClient;