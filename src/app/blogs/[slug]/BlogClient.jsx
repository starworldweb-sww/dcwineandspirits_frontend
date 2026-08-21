"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { User, Eye, MessageCircle, Search, Clock, Rss, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import ProductsHeader from "@/app/components/TittleAndBreadcrumb";
import { useCountViews, useGetAllPosts, useGetCategory, useGetPostBySlug, useSearchPosts } from '@/app/api/hooks/blog/useBlogPosts';

const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_PRODUCTION_IMAGE_URL;
const BLOGS_PER_PAGE = 10;

const formatBlogDate = (dateString) => {
  if (!dateString) return { day: "--", month: "" };
  const dateObj = new Date(dateString);
  if (isNaN(dateObj.getTime())) return { day: "--", month: "" };
  return {
    day: String(dateObj.getDate()).padStart(2, "0"),
    month: dateObj.toLocaleString("en-US", { month: "short" }),
  };
};

const getExcerpt = (html, maxLength = 220) => {
  if (!html) return "";
  const plainText = html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (plainText.length <= maxLength) return plainText;
  return plainText.slice(0, maxLength).trim() + "…";
};

const getReadingTime = (html) => {
  if (!html) return 1;
  const plainText = html.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ");
  const wordCount = plainText.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / 225));
};

const getBlogImageUrl = (imagePath) => {
  if (!imagePath) return "";
  if (imagePath.startsWith("http")) return imagePath;
  const cleanBase = (IMAGE_BASE_URL || "").replace(/\/$/, "");
  const cleanPath = imagePath.replace(/^\//, "");
  return `${cleanBase}/${cleanPath}`;
};

const BlogClient = ({ viewType, category, initialCategoryPosts, initialPostData }) => {
  const { slug } = useParams();
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const { data: catData } = useGetCategory();

  const { data: post, isLoading: postLoading, isError: postError } = useGetPostBySlug(
    viewType === "post" ? slug : null,
    viewType === "post" ? initialPostData : undefined
  );

  const {
    data: categoryData,
    isLoading: categoryLoading,
    isFetching: categoryFetching,
    isError: categoryError,
  } = useGetAllPosts(
    {
      page: currentPage,
      limit: BLOGS_PER_PAGE,
      categorySlug: viewType === "category" ? slug : undefined,
      categoryId: viewType === "category" ? category?.category_id : undefined,
    },
    {
      initialData:
        viewType === "category" && currentPage === 1 ? initialCategoryPosts : undefined,
      enabled: viewType === "category",
    }
  );

  const { mutate: countView } = useCountViews();
  const countedPostIdRef = useRef(null);

  useEffect(() => {
    if (viewType === "post" && post?.post_id && countedPostIdRef.current !== post.post_id) {
      countView(post.post_id);
      countedPostIdRef.current = post.post_id;
    }
  }, [viewType, post?.post_id, countView]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setSearchQuery("");
    setShowSuggestions(false);
    setCurrentPage(1);
  }, [slug]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim());
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data: searchData, isLoading: isSearchLoading } = useSearchPosts({
    keyword: debouncedQuery,
    page: 1,
    limit: 5,
  });

  const suggestions = searchData?.posts || [];

  const handleSidebarSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setShowSuggestions(false);
    router.push(`/blogs?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  const posts = categoryData?.posts ?? [];
  const pagination = categoryData?.pagination ?? {
    total: 0,
    page: 1,
    limit: BLOGS_PER_PAGE,
    totalPages: 1,
  };
  const totalPages = pagination.totalPages || 1;

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderSidebar = () => (
    <aside className="w-full lg:w-[300px] shrink-0 space-y-8">
      <div className="relative">
        <h3 className="font-hind-madurai text-lg font-semibold text-gray-800 mb-3">
          Blog Search
        </h3>

        <form onSubmit={handleSidebarSearch} className="flex">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => searchQuery.trim() && setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
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

        {showSuggestions && debouncedQuery && (
          <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded shadow-lg z-20 max-h-80 overflow-y-auto">
            {isSearchLoading ? (
              <p className="px-3 py-3 text-sm text-gray-400">Searching...</p>
            ) : suggestions.length === 0 ? (
              <p className="px-3 py-3 text-sm text-gray-400">No results found.</p>
            ) : (
              <ul className="divide-y divide-gray-100">
                {suggestions.map((item) => (
                  <li key={item.post_id}>
                    <Link
                      href={`/blogs/${item.slug}`}
                      className="block px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#98022e] transition-colors line-clamp-1"
                      onClick={() => setShowSuggestions(false)}
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      <div>
        <h3 className="font-hind-madurai text-lg font-semibold text-gray-800 mb-3">
          Categories
        </h3>

        <div className="border border-gray-200 rounded-lg bg-white overflow-hidden">
          {catData?.map((c) => (
            <Link
              key={c?.category_id}
              href={`/blogs/${c?.slug}`}
              className={`flex items-center justify-between px-4 py-3 border-b last:border-b-0 border-gray-100 text-sm transition-colors ${
                viewType === "category" && c?.slug === slug
                  ? "bg-[#98022e]/5 text-[#98022e] font-medium"
                  : "text-gray-700 hover:bg-gray-50 hover:text-[#98022e]"
              }`}
            >
              <span>{c?.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );

  if (viewType === "category") {
    const breadcrumbs = [
      { label: "Blogs", href: "/blogs" },
      { label: category?.name || slug, href: `/blogs/${slug}` },
    ];

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
        <ProductsHeader categoryName={category?.name || "Blog Category"} breadcrumbs={breadcrumbs} />

        <div className="px-3 2xl:px-32 py-8 md:py-12 flex flex-col lg:flex-row gap-10">
          <div className="flex-1 min-w-0">
            <div className="hidden md:flex justify-end mb-4">
              <Link
                href="/blogs/rss"
                className="flex items-center gap-1.5 text-sm text-[#98022e] hover:text-[#8c1a3c] transition-colors"
              >
                <Rss size={16} />
                <span>RSS Feed</span>
              </Link>
            </div>

            {category && (
              <div className="mb-6 pb-4 border-b border-gray-200">
                <h1 className="font-sarabun text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                  {category.name}
                </h1>
                {category.description && (
                  // <p className="text-gray-600 text-sm md:text-base">
                  //   {category.description}
                  // </p>
                  <div
                  dangerouslySetInnerHTML={{ __html: category.description }}
                  />
                )}
              </div>
            )}

            {categoryLoading || categoryFetching ? (
              <div className="flex flex-col divide-y divide-gray-200">
                {[1, 2, 3].map((i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : categoryError ? (
              <p className="text-center text-gray-500 py-10">
                Something went wrong while loading blogs. Please try again.
              </p>
            ) : posts.length === 0 ? (
              <p className="text-center text-gray-500 py-10">
                No blog posts found in this category.
              </p>
            ) : (
              <div className="flex flex-col divide-y divide-gray-200">
                {posts.map((postItem) => {
                  const { day, month } = formatBlogDate(postItem.date_created);
                  const authorName = [postItem.author_firstname, postItem.author_lastname]
                    .filter(Boolean)
                    .join(" ");
                  const readingMinutes = getReadingTime(postItem.description);

                  return (
                    <article
                      key={postItem.post_id}
                      className="flex flex-col md:flex-row gap-6 py-8 first:pt-0"
                    >
                      <Link
                        href={`/blogs/${postItem.slug}`}
                        className="relative shrink-0 w-full md:w-[420px] h-[260px] md:h-[300px] rounded-md overflow-hidden bg-gray-100"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={getBlogImageUrl(postItem.image)}
                          alt={postItem.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 left-3 bg-[#98022e] text-white text-center rounded px-2.5 py-1.5 leading-tight shadow-md">
                          <span className="block text-lg font-bold">{day}</span>
                          <span className="block text-[11px] uppercase tracking-wide">
                            {month}
                          </span>
                        </div>
                      </Link>

                      <div className="flex-1 min-w-0 flex flex-col justify-center">
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
                            {postItem.views ?? 0}
                          </span>
                        </div>

                        <Link href={`/blogs/${postItem.slug}`}>
                          <h2 className="font-sarabun text-xl md:text-2xl font-semibold text-gray-800 hover:text-[#98022e] transition-colors mb-3">
                            {postItem.title}
                          </h2>
                        </Link>

                        <p className="font-sarabun text-sm md:text-[15px] text-gray-600 leading-relaxed line-clamp-3 mb-5">
                          {getExcerpt(postItem.description)}
                        </p>

                        <Link
                          href={`/blogs/${postItem.slug}`}
                          className="inline-flex items-center gap-2 w-fit bg-gray-900 hover:bg-[#98022e] text-white text-xs font-semibold tracking-wider uppercase px-5 py-3 rounded transition-all hover:rounded-xl group"
                        >
                          Continue Reading
                          <ArrowRight size={14} className="group-hover:ml-1 transition-all" />
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}

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
                    className={`w-9 h-9 flex items-center justify-center rounded border text-sm font-medium transition-colors cursor-pointer hover:rounded-xl ${
                      page === currentPage
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

          {renderSidebar()}
        </div>
      </div>
    );
  }

  if (postLoading) {
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

  if (postError || !post) {
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
  const authorName = [post.author_firstname, post.author_lastname].filter(Boolean).join(" ");
  const readingMinutes = getReadingTime(post.content);

  const breadcrumbs = [
    { label: "Blogs", href: "/blogs" },
    { label: post.title, href: `/blogs/${post.slug}` },
  ];

  return (
    <div className="w-full bg-white">
      <ProductsHeader categoryName={post.title} breadcrumbs={breadcrumbs} />

      <div className="px-3 2xl:px-32 py-8 md:py-12 flex flex-col lg:flex-row gap-10">
        <article className="flex-1 min-w-0">
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

          <div
            className="blog-article-body"
            dangerouslySetInnerHTML={{ __html: post.content || "" }}
          />
        </article>

        {renderSidebar()}
      </div>

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
