"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import ProductsHeader from "@/app/components/TittleAndBreadcrumb";
import { AUTHORS } from "@/libs/authors";

const ACCENT = "#8c1a3c";

const breadcrumbs = [{ label: "Authors", href: "/authors" }];

const getInitials = (name) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("");

const AuthorAvatar = ({ author }) => {
  const [imgError, setImgError] = React.useState(false);
  const showImage = author.image && !imgError;

  return (
    <div className="relative w-[180px] h-[180px] md:w-[210px] md:h-[210px] rounded-full overflow-hidden bg-[#eeeeee] border-2 border-[#eeeeee] group-hover:border-[#8c1a3c] transition-colors duration-300 shrink-0">
      {showImage ? (
        <Image
          src={author.image}
          alt={author.name}
          fill
          sizes="(min-width: 768px) 210px, 180px"
          className="object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-3xl font-hind-madurai font-semibold text-[#8c1a3c]">
            {getInitials(author.name)}
          </span>
        </div>
      )}
    </div>
  );
};

const AuthorBio = ({ bio }) => {
  const [expanded, setExpanded] = React.useState(false);
  const isLong = bio && bio.length > 140;

  return (
    <div className="mt-2 max-w-[260px]">
      <p
        className={`text-[13px] font-hind-madurai text-[#666666] leading-[1.6] ${
          !expanded && isLong ? "line-clamp-4" : ""
        }`}
      >
        {bio}
      </p>

      {isLong && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setExpanded((prev) => !prev);
          }}
          className="text-[12px] font-hind-madurai font-semibold mt-1 cursor-pointer hover:underline"
          style={{ color: ACCENT }}
        >
          {expanded ? "Read less" : "Read more"}
        </button>
      )}
    </div>
  );
};

const AuthorCard = ({ author }) => {
  return (
    <Link
      href={`/author/${author.slug}`}
      className="flex flex-col items-center text-center group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8c1a3c] rounded-lg"
    >
      <AuthorAvatar author={author} />

      <h3 className="mt-5 text-[19px] font-hind-madurai font-semibold text-[#333333] flex flex-wrap items-baseline justify-center gap-x-1.5">
        <span>{author.name}</span>
        {author.tag && (
          <span className="text-[14px] font-hind-madurai font-semibold text-gray-600">
            {author.tag}
          </span>
        )}
      </h3>

      <p
        className="text-[13.5px] font-hind-madurai font-medium mt-1"
        style={{ color: ACCENT }}
      >
        {author.title}
      </p>

      {author.bio && <AuthorBio bio={author.bio} />}
    </Link>
  );
};

const AuthorClient = () => {
  return (
    <div className="font-['cambriaregular'] text-[#333333] w-full">
      <ProductsHeader categoryName="Our Authors" breadcrumbs={breadcrumbs} />

      <div className="w-full px-3 lg:px-3 2xl:px-32 py-12 md:py-8">
        <div className="text-center mb-14 md:mb-20">
         

          <h2 className="text-[30px] sm:text-[38px] md:text-[46px] font-hind-madurai font-extrabold text-[#2b2b2b] leading-[1.1] mb-4">
            Meet Our Authors
          </h2>


          <p className="text-[14.5px] md:text-[15.5px] font-hind-madurai text-[#666666] max-w-2xl mx-auto leading-[1.8]">
            The team behind our wine, champagne, and gift curation
            sharing expertise so you can find the perfect bottle every time.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-14 items-start">
          {AUTHORS.map((author) => (
            <AuthorCard key={author.id} author={author} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AuthorClient;
