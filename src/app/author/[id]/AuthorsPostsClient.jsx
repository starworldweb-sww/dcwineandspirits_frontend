"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ProductsHeader from "@/app/components/TittleAndBreadcrumb";
import { useGetPostsByAuthor } from "@/app/api/hooks/blog/useBlogPosts";
import { getAuthorBySlug } from "@/libs/authors";

const ACCENT = "#8c1a3c";
const IMAGE_BASE = process.env.NEXT_PUBLIC_PRODUCTION_IMAGE_URL || "";

// Strip HTML tags for a clean excerpt
const stripHtml = (html = "") =>
  html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;|&amp;|&#\d+;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

// Formats a number in the compact US style: 1,200 -> "1.2K", 2,300,000 -> "2.3M".
// Only used for stats where the raw number can get large (like total views) —
// small counts (like total blog count) stay as plain numbers.
const formatCompactUS = (n) =>
  new Intl.NumberFormat("en-US", {
    notation: "compact",
    compactDisplay: "short",
    maximumFractionDigits: 1,
  }).format(n);

// Rolling / count-up number. Animates from 0 to `value` using
// requestAnimationFrame with an ease-out curve for a smooth "odometer"
// style roll rather than a linear tick. Re-animates whenever `value`
// changes (e.g. once posts finish loading and the real total arrives).
// "format" controls how the rolling number is displayed at each frame —
// defaults to plain "1,234" style, pass formatCompactUS for "1.2K" style.
const AnimatedCounter = ({
  value = 0,
  duration = 1400,
  format = (n) => n.toLocaleString("en-US"),
}) => {
  const [display, setDisplay] = useState(0);
  const frameRef = useRef(null);
  const startRef = useRef(null);

  useEffect(() => {
    startRef.current = null;
    cancelAnimationFrame(frameRef.current);

    const animate = (timestamp) => {
      if (!startRef.current) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
      setDisplay(Math.round(eased * value));

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, duration]);

  return <span>{format(display)}</span>;
};

// A single stat block — big rolling number + small label underneath,
// with a vertical divider handled by the parent row (not here).
// "format" is passed straight through to AnimatedCounter.
const StatBlock = ({ value, label, delay = 0, format }) => (
  <div
    className="flex flex-col items-center text-center px-8 sm:px-12 author-fade-slide-up"
    style={{ animationDelay: `${delay}s` }}
  >
    <span
      className="font-hind-madurai font-semibold text-[34px] sm:text-[42px] leading-none"
      style={{ color: ACCENT }}
    >
      <AnimatedCounter value={value} format={format} />
    </span>
    <span className="mt-2 text-[11px] sm:text-[12px] font-hind-madurai font-semibold uppercase tracking-[0.2em] text-[#8a8a8a]">
      {label}
    </span>
  </div>
);

// "badge" — optional small label shown top-left of the image, e.g.
// "Most Popular" or "Most Recent". Normal grid cards don't pass this.
const BlogCard = ({ post, badge }) => {
  const excerpt = stripHtml(post.description).slice(0, 150);
  const imgSrc = post.image?.startsWith("http")
    ? post.image
    : `${IMAGE_BASE}${post.image}`;

  return (
    <Link
      href={`/blogs/${post.slug}`}
      className="group flex flex-col bg-white border border-gray-200 hover:shadow-md transition-shadow duration-300"
    >
      <div className="relative w-full h-[220px] overflow-hidden bg-[#eeeeee]">
        {badge && (
          <span
            className="absolute left-3 top-3 z-10 px-2.5 py-1 text-[10px] font-hind-madurai font-semibold uppercase tracking-wide text-white rounded-sm"
            style={{ backgroundColor: ACCENT }}
          >
            {badge}
          </span>
        )}
        <Image
          src={imgSrc}
          alt={post.title}
          fill
          sizes="(max-width: 768px) 100vw, 380px"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-5 flex flex-col gap-2">
        <span className="text-[12px] font-hind-madurai text-[#999999]">
          {formatDate(post.date_created)} &middot; {post.views} views
        </span>
        <h3 className="text-[17px] font-hind-madurai font-semibold text-[#333333] leading-snug line-clamp-2 group-hover:text-[#8c1a3c] transition-colors">
          {post.title}
        </h3>
        <p className="text-[13.5px] font-hind-madurai text-[#666666] leading-[1.6] line-clamp-3">
          {excerpt}...
        </p>
      </div>
    </Link>
  );
};

// Author profile header — biography-card style: bold name + bio on the
// left, large photo panel on the right. "author" is a single object
// (from getAuthorBySlug()), not the whole array — hence singular prop name.
const AuthorProfileHeader = ({ author, fallbackName }) => {
  const displayName = author?.name || fallbackName;

  return (
    <div className="relative bg-[#f7f6f4] rounded-2xl overflow-hidden mb-16">
      <style>{`
        @keyframes authorPhotoScaleIn {
          0% { transform: scale(0.92); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .author-photo-animate {
          animation: authorPhotoScaleIn 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        @keyframes authorFadeSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .author-fade-slide-up {
          animation: authorFadeSlideUp 0.6s ease-out both;
        }

        @keyframes authorLineGrow {
          from { width: 0; opacity: 0; }
          to { width: 100%; opacity: 1; }
        }
        .author-line-animate {
          animation: authorLineGrow 0.7s ease-out 0.15s both;
        }
      `}</style>

      <div className="grid grid-cols-1 md:grid-cols-[1.05fr_0.95fr] gap-10 md:gap-8 items-center px-6 sm:px-10 md:px-14 py-12 md:py-14">
        {/* ---------- Left: name, title, bio, socials ---------- */}
        <div className="order-2 md:order-1 text-left">
          <h2
            className="font-hind-madurai font-extrabold text-[#2b2b2b] leading-[0.98] text-[38px] sm:text-[50px] md:text-[58px] author-fade-slide-up"
            style={{ animationDelay: "0.1s" }}
          >
            {displayName}
          </h2>

          {author?.title && (
            <p
              className="mt-3 text-[13.5px] md:text-[14.5px] font-hind-madurai font-semibold uppercase tracking-wide author-fade-slide-up"
              style={{ color: ACCENT, animationDelay: "0.2s" }}
            >
              {author.title}
            </p>
          )}

          {author?.bio && (
            <p
              className="mt-6 max-w-[480px] text-[14.5px] md:text-[15px] font-hind-madurai text-[#5f5f5f] leading-[1.85] author-fade-slide-up"
              style={{ animationDelay: "0.3s" }}
            >
              {author.bio}
            </p>
          )}

          {(author?.linkedin || author?.instagram) && (
            <div
              className="flex items-center gap-3.5 mt-7 author-fade-slide-up"
              style={{ animationDelay: "0.4s" }}
            >
              {author.linkedin && (
                <a
                  href={author.linkedin}
                  target="_blank"
                  rel="nofollow"
                  aria-label={`${displayName} on LinkedIn`}
                  className="group/social w-10 h-10 flex items-center justify-center rounded-full shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
                  style={{ backgroundColor: "#0A66C2" }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="#ffffff"
                    className="w-[18px] h-[18px] transition-transform duration-300 group-hover/social:scale-110"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              )}

              {author.instagram && (
                <a
                  href={author.instagram}
                  target="_blank"
                  rel="nofollow"
                  aria-label={`${displayName} on Instagram`}
                  className="group/social w-10 h-10 flex items-center justify-center rounded-full shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
                  style={{
                    background:
                      "radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)",
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="#ffffff"
                    className="w-[18px] h-[18px] transition-transform duration-300 group-hover/social:scale-110"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.012-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.98-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.198-4.354-2.618-6.78-6.98-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </a>
              )}
            </div>
          )}
        </div>

        {/* ---------- Right: photo panel ---------- */}
        {author?.image && (
          <div className="order-1 md:order-2 relative w-full max-w-[300px] md:max-w-[320px] mx-auto h-[220px] sm:h-[260px] md:h-[320px] author-photo-animate">
            <div className="absolute inset-0 rounded-[32px] overflow-hidden bg-[#eeeeee] shadow-[0_10px_30px_-10px_rgba(0,0,0,0.15)]">
              <Image
                src={author.image}
                alt={displayName}
                fill
                sizes="(max-width: 768px) 60vw, 320px"
                className="object-cover"
              />
            </div>
            <div
              className="absolute -bottom-3 -right-3 w-full h-full rounded-[32px] -z-10"
              style={{ backgroundColor: `${ACCENT}1a` }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

const AuthorPostsClient = ({ authorSlug }) => {
  // ---- Yahan authorSlug kaha se aa raha hai? ----
  // Ye component parent page se render hota hai:
  //   app/author/[slug]/page.jsx
  // Us dynamic route ka `[slug]` segment (URL se, e.g. /author/sam-gera)
  // params ke through parent page ko milta hai, aur wahi parent
  // <AuthorPostsClient authorSlug={slug} /> ki tarah pass karta hai.

  // Step 1: Slug se static AUTHORS list (libs/authors.js) mein author ka
  // pura profile (id/name/title/bio/photo) dhoond lo — sabse pehle,
  // kyunki isi se firstname/lastname nikalenge posts fetch karne ke liye.
  const authorMeta = getAuthorBySlug(authorSlug);
  console.log("authorSlug:", authorSlug, "authorMeta:", authorMeta);

  // Step 2: Naye backend route (/posts/author?firstname=..&lastname=..)
  // ko firstname/lastname chahiye, id nahi. Static "name" field
  // ("Sam Gera") ko split karke nikaal rahe hain.
  const [authorFirstname, ...rest] = (authorMeta?.name || "").split(" ");
  const authorLastname = rest.join(" ") || undefined;

  // Step 3: Us author ke saare blog posts backend se fetch karo.
  // NOTE: "Most Popular" / "Most Recent" sahi se nikalne ke liye humein
  // author ke SAARE posts chahiye, sirf ek page ke 10 nahi — isliye
  // yahan limit zyada (100) rakha hai. Agar kisi author ke 100 se zyada
  // posts ho jayein, toh backend se ek "highlights" endpoint banwana
  // zyada sahi approach hogi (sorted by views/date, top 1-1 each).
  const { data, isLoading, isError } = useGetPostsByAuthor(authorFirstname, {
    lastname: authorLastname,
    page: 1,
    limit: 100,
  });

  const authorPosts = data?.posts || [];

  // Step 4: Agar slug AUTHORS list mein nahi mila (authorMeta null aaya),
  // toh kam se kam naam dikhane ke liye posts ke data se naam nikaal lo.
  // Ye sirf ek fallback hai — normal case mein authorMeta hi use hoga.
  const fallbackName =
    authorPosts.length > 0
      ? `${authorPosts[0].author_firstname} ${authorPosts[0].author_lastname}`
      : "Author";

  // Step 5: Final naam jo page pe dikhana hai — pehle static metadata ka
  // naam try karo, warna fallback naam use karo.
  const displayName = authorMeta?.name || fallbackName;

  // ---- Step 6: Most Popular post (sabse zyada "views") ----
  const mostPopularPost =
    authorPosts.length > 0
      ? authorPosts.reduce((popular, current) =>
          current.views > popular.views ? current : popular
        )
      : null;

  // ---- Step 7: Most Recent post (sabse latest "date_created") ----
  const mostRecentPost =
    authorPosts.length > 0
      ? authorPosts.reduce((recent, current) =>
          new Date(current.date_created) > new Date(recent.date_created)
            ? current
            : recent
        )
      : null;

  // Agar same post dono categories mein aa gaya (e.g. sirf ek hi post hai
  // author ke paas), toh use dono jagah dikhane ki zaroorat nahi.
  const showBothHighlights =
    mostPopularPost && mostRecentPost && mostPopularPost.post_id !== mostRecentPost.post_id;

  // ---- Step 8: Overall stats for the rolling counter row ----
  const totalBlogs = authorPosts.length;
  const totalViews = authorPosts.reduce(
    (sum, post) => sum + (post.views || 0),
    0
  );

  // Breadcrumb ab slug-based hai — route bhi /author/[slug] hi hai,
  // isliye link yahan bhi slug se banna chahiye, id se nahi.
  const breadcrumbs = [
    { label: "Author", href: "/author/" },
    { label: displayName, href: `/author/${authorSlug}/` },
  ];

  return (
    <div className="font-['cambriaregular'] text-[#333333] w-full">
      <ProductsHeader categoryName={displayName} breadcrumbs={breadcrumbs} />

      <div className="w-full px-3 lg:px-3 2xl:px-32 py-12 md:py-16">
        <AuthorProfileHeader author={authorMeta} fallbackName={fallbackName} />

        {/* ================= STATS: Total Blogs + Total Views ================= */}
        {!isLoading && !isError && authorPosts.length > 0 && (
          <div className="flex items-center justify-center divide-x divide-gray-200 mb-16">
            <StatBlock value={totalBlogs} label="Total Posts" delay={0.1} />
            {/* Total Views uses the compact US format (1.2K / 3.4M) since
                view counts can get large; Total Blogs stays a plain number
                since it's typically small. */}
            <StatBlock
              value={totalViews}
              label="Total Views"
              delay={0.2}
              format={formatCompactUS}
            />
          </div>
        )}

        {isLoading && (
          <p className="text-center font-hind-madurai text-[#666666] py-10">
            Loading posts...
          </p>
        )}

        {isError && (
          <p className="text-center font-hind-madurai text-red-600 py-10">
            Something went wrong while loading posts.
          </p>
        )}

        {!isLoading && !isError && authorPosts.length === 0 && (
          <p className="text-center font-hind-madurai text-[#666666] py-10">
            No posts found for this author yet.
          </p>
        )}

        {/* ================= HIGHLIGHTS: Most Popular + Most Recent ================= */}
        {(mostPopularPost || mostRecentPost) && (
          <div className="mb-14">
            <h2 className="text-[20px] md:text-[24px] font-hind-madurai font-bold text-[#333333] mb-5">
              Highlights
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {mostPopularPost && (
                <BlogCard post={mostPopularPost} badge="Most Popular" />
              )}

              {showBothHighlights && (
                <BlogCard post={mostRecentPost} badge="Most Recent" />
              )}
            </div>
          </div>
        )}

        {/* ================= ALL POSTS ================= */}
        {authorPosts.length > 0 && (
          <>
            <h2 className="text-[20px] md:text-[24px] font-hind-madurai font-bold text-[#333333] mb-5">
              All Posts
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {authorPosts.map((post) => (
                <BlogCard key={post.post_id} post={post} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthorPostsClient;