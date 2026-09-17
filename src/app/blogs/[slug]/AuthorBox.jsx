"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getAuthorBySlug } from "@/libs/authors";
import { FaUserPen } from "react-icons/fa6";
import { BadgeCheck } from "lucide-react";

// Small avatar that shows the real photo, and quietly falls back to a
// user-pen icon if the image 404s instead of showing a broken-image icon.
// `verified` overlays a small badge on the bottom-right corner for
// confirmed staff authors (not shown for an arbitrary fallback name).
const Avatar = ({ src, name, size = "w-12 h-12", verified = false }) => {
  const [failed, setFailed] = useState(false);

  const badge = verified && (
    <span className="absolute -bottom-0.5 -right-0.5 flex items-center justify-center w-[18px] h-[18px] rounded-full bg-white shadow-sm">
      <BadgeCheck
        className="w-4 h-4 text-[#98022e]"
        fill="white"
        strokeWidth={2}
      />
    </span>
  );

  if (!src || failed) {
    return (
      <div className={`relative ${size} shrink-0`}>
        <div
          className={`w-full h-full rounded-full bg-[#98022e]/10 flex items-center justify-center`}
        >
          <FaUserPen className="text-[#98022e] text-base" />
        </div>
        {badge}
      </div>
    );
  }

  return (
    <div className={`relative ${size} shrink-0`}>
      <div className="relative w-full h-full rounded-full overflow-hidden bg-[#eeeeee] ring-2 ring-white shadow-sm">
        <Image
          src={src}
          alt={name}
          fill
          sizes="48px"
          className="object-cover"
          onError={() => setFailed(true)}
        />
      </div>
      {badge}
    </div>
  );
};

// "authorSlug" — same slug used in the /author/[slug] route, e.g. "sam-gera".
// This replaces the old "authorId" lookup so the whole author flow
// (listing page, detail page, this box) uses one consistent identifier.
const AuthorBox = ({ authorSlug, fallbackName }) => {
  const author = getAuthorBySlug(authorSlug);

  const name = author?.name || fallbackName;
  if (!name) return null;

  // Only link through when we actually have a known author page to send
  // people to — an arbitrary fallbackName has no /author/[slug] to visit.
  const authorHref = author ? `/author/${author.slug}` : null;

  return (
    <div className="px-3 lg:px-5 2xl:px-32">
      <div className="my-8 flex items-center gap-3.5 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        {authorHref ? (
          <Link
            href={authorHref}
            className="shrink-0"
            aria-label={`View ${name}'s author page`}
          >
            <Avatar
              src={author?.image}
              name={name}
              verified={Boolean(author)}
            />
          </Link>
        ) : (
          <Avatar src={author?.image} name={name} verified={Boolean(author)} />
        )}

        <div className="min-w-0">
          {/* <p className="text-[10px] font-hind-madurai uppercase tracking-wider text-gray-400 mb-0.5">
            Written by
          </p> */}
          <div className="flex items-baseline flex-wrap gap-x-2">
            {authorHref ? (
              <Link
                href={authorHref}
                className="text-[15px] font-sumana font-semibold text-gray-900 leading-tight hover:underline"
              >
                {name}
              </Link>
            ) : (
              <p className="text-[15px] font-sumana font-semibold text-gray-900 leading-tight">
                {name}
              </p>
            )}

            {author?.tag && (
              <span className="text-[11px] font-sumana font-bold uppercase tracking-wide text-gray-500">
                {author.tag}
              </span>
            )}

            {author?.title && (
              <>
                <span className="text-gray-300 text-xs">•</span>
                <p className="text-[12px] font-hind-madurai font-medium text-[#98022e]">
                  {author.title}
                </p>
              </>
            )}
          </div>

          {author?.bio && (
            <p className="text-[12.5px] font-sarabun text-gray-500 leading-snug mt-1 line-clamp-2">
              {author.bio}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthorBox;
