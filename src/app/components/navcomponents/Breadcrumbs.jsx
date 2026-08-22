"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const Breadcrumbs = ({ breadcrumbs }) => {
  const pathname = usePathname();

  // ── Shared wrapper — same height har jagah, isliye jab breadcrumb
  //     khaali ho (jaise homepage pe) tab bhi page ka layout shift nahi hota ──
  const wrapperClass =
    "w-full px-4 xl:px-20 py-3 select-none flex flex-col justify-center items-center min-h-[44px]";

  // ── Homepage pe: empty wrapper (same height, no content) ──
  if (pathname === "/" && (!breadcrumbs || breadcrumbs.length === 0)) {
    return <div className={wrapperClass} />;
  }

  // ── Logic: Prop vs Pathname ──
  let segmentsToRender = [];

  if (Array.isArray(breadcrumbs) && breadcrumbs.length > 0) {
    segmentsToRender = breadcrumbs;
  } else {
    const pathSegments = pathname.split("/").filter((item) => item !== "");
    segmentsToRender = pathSegments.map((segment) => {
      return {
        label: segment.replace(/-/g, " "),
        href: `/${segment}`,
      };
    });
  }

  return (
    <div className={wrapperClass}>
      <nav
        aria-label="breadcrumb"
        className="max-w-screen-2xl w-full mx-auto flex justify-center"
      >
        {/* ── Mobile par is wrapper ko horizontally scrollable rakha hai (no-wrap +
             overflow-x-auto), taaki jyada items hone par bhi ek hi line mein rahe
             aur user side-swipe karke pura breadcrumb dekh sake. Scrollbar hide
             kar di hai (scrollbar-hide util neeche global css mein add karna). ──*/}
        <ul
          aria-label="Breadcrumbs"
          className="flex items-center m-0 p-0 list-none gap-2 text-[13px] md:text-[14px] font-[Cambria,Georgia,serif] flex-nowrap overflow-x-auto scrollbar-hide max-w-full py-0.5"
        >
          {/* ── Home Icon ── */}
          <li className="flex items-center shrink-0">
            <Link
              href="/"
              className="text-gray-600 hover:text-black transition-colors flex items-center justify-center"
              aria-label="Home"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
            </Link>
          </li>

          {/* ── Map Render Segments (Dynamic or Pathname) ── */}
          {segmentsToRender.map((segment, index) => {
            const isLast = index === segmentsToRender.length - 1;

            let labelToDisplay =
              segment.label || segment.name || segment.title || "Unknown";
            let linkToUse =
              segment.href ||
              segment.url ||
              segment.path ||
              (segment.slug ? `/${segment.slug}` : "#");

            // ── "Brand" / "Brands" aaye toh "Brands" dikhao aur /brands pe link karo ──
            if (
              typeof labelToDisplay === "string" &&
              (labelToDisplay.toLowerCase() === "brand" ||
                labelToDisplay.toLowerCase() === "brands")
            ) {
              labelToDisplay = "Brands";
              linkToUse = "/brands";
            }

            return (
              <li key={index} className="flex items-center gap-2 shrink-0">
                {/* Separator */}
                <span className="text-[#d1d1d1] font-sans text-[15px] shrink-0">
                  /
                </span>

                {/* Agar last item hai YA fir link valid nahi hai, toh as a text render karo */}
                {isLast || linkToUse === "#" ? (
                  <span
                    className="text-[#444] capitalize font-medium whitespace-nowrap"
                    style={{ userSelect: "text" }}
                  >
                    {labelToDisplay}
                  </span>
                ) : (
                  <Link
                    href={linkToUse}
                    className="text-[#666] hover:text-black capitalize transition-colors whitespace-nowrap"
                    style={{ userSelect: "text" }}
                  >
                    {labelToDisplay}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default Breadcrumbs;