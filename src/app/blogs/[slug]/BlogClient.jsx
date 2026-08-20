"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { User, Eye, MessageCircle, Search, Clock } from 'lucide-react';
import ProductsHeader from "@/app/components/TittleAndBreadcrumb";
import { useGetPostBySlug } from '@/app/api/hooks/blog/useBlogPosts';


const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_PRODUCTION_IMAGE_URL;

// 1) Date helper - list page jaisa hi, "date_created" se badge banata hai
const formatBlogDate = (dateString) => {
  if (!dateString) return { day: "--", month: "" };
  const dateObj = new Date(dateString);
  if (isNaN(dateObj.getTime())) return { day: "--", month: "" };
  return {
    day: String(dateObj.getDate()).padStart(2, "0"),
    month: dateObj.toLocaleString("en-US", { month: "short" }),
  };
};

// 2) Reading time helper - list page jaisa hi, "content" HTML se words count karta hai
const getReadingTime = (html) => {
  if (!html) return 1;
  const plainText = html.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ");
  const wordCount = plainText.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / 225));
};

// 3) Image URL helper - relative path ko IMAGE_BASE_URL ke saath jodta hai
const getBlogImageUrl = (imagePath) => {
  if (!imagePath) return "";
  if (imagePath.startsWith("http")) return imagePath;
  const cleanBase = (IMAGE_BASE_URL || "").replace(/\/$/, "");
  const cleanPath = imagePath.replace(/^\//, "");
  return `${cleanBase}/${cleanPath}`;
};

const BlogClient = () => {
  const { slug } = useParams(); // route se slug uthaya, jaise tumne bana rakha hai
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  // 4) Real API call - slug based single post
  const { data: post, isLoading, isError } = useGetPostBySlug(slug);

  console.log(post);

  const handleSidebarSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/blogs?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  // 5) Loading skeleton
  if (isLoading) {
    return (
      <div className="w-full px-3 2xl:px-32 py-10 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-2/3 mb-6" />
        <div className="h-[400px] bg-gray-200 rounded mb-6" />
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-5/6" />
          <div className="h-4 bg-gray-200 rounded w-4/6" />
        </div>
      </div>
    );
  }

  // 6) Not found / error state
  if (isError || !post) {
    return (
      <div className="w-full px-3 2xl:px-32 py-16 text-center">
        <h1 className="font-hind-madurai text-2xl font-semibold text-gray-800 mb-3">
          Blog post not found
        </h1>
        <p className="text-gray-500 mb-6">
          The post you're looking for doesn't exist or may have been removed.
        </p>
        <Link
          href="/blogs"
          className="inline-block bg-[#98022e] hover:bg-[#8c1a3c] text-white text-sm font-semibold uppercase tracking-wide px-5 py-3 rounded transition-colors"
        >
          Back to Blogs
        </Link>
      </div>
    );
  }

  const { day, month } = formatBlogDate(post.date_created);
  const authorName = [post.author_firstname, post.author_lastname]
    .filter(Boolean)
    .join(" ");
  const readingMinutes = getReadingTime(post.content);

  const breadcrumbs = [
    { label: "Blogs", href: "/blogs" },
    { label: post.title, href: `/blogs/${post.slug}` },
  ];

  return (
    <div className="w-full bg-white">

      {/* =============================================================
          7) PAGE HEADER - login/blogs list jaisa hi shared ProductsHeader
      ============================================================= */}
      <ProductsHeader categoryName={post.title} breadcrumbs={breadcrumbs} />

      {/* =============================================================
          8) MAIN LAYOUT - content (left) + sidebar (right)
      ============================================================= */}
      <div className="px-3 2xl:px-32 py-8 md:py-12 flex flex-col lg:flex-row gap-10">

        {/* ---------- LEFT: Article ---------- */}
        <article className="flex-1 min-w-0">

          {/* Featured image + date badge */}
          <div className="relative w-full h-[280px] md:h-[420px] rounded-md overflow-hidden bg-gray-100 mb-5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={getBlogImageUrl(post.image)}
              alt={post.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3 bg-[#98022e] text-white text-center rounded px-2.5 py-1.5 leading-tight shadow-md">
              <span className="block text-lg font-bold">{day}</span>
              <span className="block text-[11px] uppercase tracking-wide">{month}</span>
            </div>
          </div>

          {/* Meta row - author, reading time, views
              Note: "comments" API se boolean aata hai (count nahi), isliye
              yahan sirf icon dikha rahe hain, number nahi (fake 0 nahi likha) */}
          <div className="flex items-center flex-wrap gap-4 text-sm text-gray-500 mb-6 pb-4 border-b border-gray-200">
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
              {post.views ?? 0} View(s)
            </span>
            <span className="flex items-center gap-1.5">
              <MessageCircle size={15} className="text-[#98022e]" />
              {post.comments ? "Comments open" : "Comments closed"}
            </span>
          </div>

          {/* 9) Actual blog HTML content - "content" field mein h2/h3/table/
              blockquote/details-faq sab hai, isliye ek scoped className
              "blog-article-body" se style kar rahe hain (neeche styled-jsx) */}
          <div
            className="blog-article-body"
            dangerouslySetInnerHTML={{ __html: post.content || "" }}
          />
        </article>

        {/* ---------- RIGHT: Sidebar ---------- */}
        <aside className="w-full lg:w-[300px] shrink-0 space-y-8">

          {/* Blog Search */}
          <div>
            <h3 className="font-hind-madurai text-lg font-semibold text-gray-800 mb-3">
              Blog Search
            </h3>
            <form onSubmit={handleSidebarSearch} className="flex">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search blogs..."
                className="flex-1 min-w-0 border border-gray-300 focus:border-[#98022e] rounded-l px-3 py-2.5 text-sm outline-none"
              />
              <button
                type="submit"
                aria-label="Search"
                className="shrink-0 bg-[#98022e] hover:bg-[#8c1a3c] text-white px-4 rounded-r transition-colors"
              >
                <Search size={16} />
              </button>
            </form>
          </div>

          {/* ⚠️ Categories aur Related Products yahan nahi hain kyunki
              getPostBySlug API in fields ko return nahi karta abhi.
              Jab category/related-product API ready ho, yahan add kar dena. */}
        </aside>
      </div>

      {/* =============================================================
          10) Blog content ke andar aane wale raw HTML tags (h2, table,
              blockquote, details/faq, etc.) ko style karne ke liye
      ============================================================= */}
      <style jsx global>{`
        .blog-article-body {
          font-family: var(--font-sarabun, inherit);
          color: #333333;
          line-height: 1.75;
          font-size: 15px;
        }
        .blog-article-body h2 {
          font-size: 22px;
          font-weight: 700;
          color: #1a1a1a;
          margin-top: 2rem;
          margin-bottom: 0.75rem;
        }
        .blog-article-body h3 {
          font-size: 18px;
          font-weight: 700;
          color: #1a1a1a;
          margin-top: 1.5rem;
          margin-bottom: 0.5rem;
        }
        .blog-article-body p {
          margin-bottom: 1rem;
        }
        .blog-article-body a {
          color: #98022e;
          text-decoration: underline;
        }
        .blog-article-body ul,
        .blog-article-body ol {
          margin: 1rem 0 1rem 1.5rem;
          list-style: disc;
        }
        .blog-article-body ol {
          list-style: decimal;
        }
        .blog-article-body li {
          margin-bottom: 0.4rem;
        }
        .blog-article-body img {
          max-width: 100%;
          height: auto;
          border-radius: 6px;
          margin: 1rem 0;
        }
        .blog-article-body blockquote {
          border-left: 3px solid #98022e;
          padding: 0.75rem 1rem;
          background: #faf5f6;
          margin: 1.5rem 0;
          font-style: italic;
          color: #555;
        }
        .blog-article-body table {
          width: 100%;
          border-collapse: collapse;
          margin: 1.5rem 0;
          font-size: 14px;
        }
        .blog-article-body th,
        .blog-article-body td {
          border: 1px solid #e5e5e5;
          padding: 0.6rem 0.8rem;
          text-align: left;
        }
        .blog-article-body th {
          background: #f7f7f7;
          font-weight: 600;
        }
        .blog-article-body details {
          border: 1px solid #e5e5e5;
          border-radius: 6px;
          padding: 0.75rem 1rem;
          margin-bottom: 0.75rem;
        }
        .blog-article-body summary {
          font-weight: 600;
          cursor: pointer;
          color: #1a1a1a;
        }
        .blog-article-body .cta-button {
          display: inline-block;
          background: #98022e;
          color: #fff !important;
          padding: 0.6rem 1.2rem;
          border-radius: 4px;
          text-decoration: none !important;
          font-size: 13px;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
};

export default BlogClient;