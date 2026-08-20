"use client";

import React, { useState } from "react";
import { Copy, Check, Tag } from "lucide-react";
import { toast } from "sonner";
import ProductsHeader from "../components/TittleAndBreadcrumb";

// 1. Coupon data — manage codes/discounts here
const coupons = [
  {
    code: "WELCOME10",
    discount: "$10 OFF",
    title: "Sign Up & Save",
    description: "Sign Up & Save $10 Today.",
    expiry: "Valid till 31st December 2026",
    variant: "dark",
  },
  {
    code: "FLAT10",
    discount: "$10 OFF",
    title: "Flat Discount",
    description: "$10 discount on first order, minimum amount $100.",
    expiry: "Valid till 31st December 2026",
    variant: "light",
  },
  {
    code: "MOTHERDAY",
    discount: "$10 OFF",
    title: "Mother's Day Offer",
    description: "$10 discount, minimum amount $100.",
    expiry: "Valid till 10 May 2026 (Expired)",
    variant: "light",
  },
  {
    code: "FATHERDAY",
    discount: "$10 OFF",
    title: "Father's Day Offer",
    description: "$10 discount, minimum amount $100.",
    expiry: "Valid till 21 June 2026 (Expired)",
    variant: "dark",
  },
];

const CouponsTable = () => {
  const [copiedCode, setCopiedCode] = useState(null);

  // 2. Copy coupon code to clipboard
  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Code "${code}" copied!`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <main className="text-[#333333] font-hind-madurai mb-2  h-full w-full">
      {/* Header — same pattern as other pages */}
      <div className="w-full">
        <ProductsHeader categoryName="Coupon & Deals" />
      </div>

      {/* Coupon Grid */}
      <div className="px-3 2xl:px-32 grid grid-cols-1 md:grid-cols-2 gap-6 mt-2 bg-[#eeeeee] py-2">
        {coupons.map((coupon) => {
          const isDark = coupon.variant === "dark";
          return (
            <div
              key={coupon.code}
              className={`relative flex flex-col sm:flex-row rounded-sm overflow-hidden ${
                isDark
                  ? "bg-[#a40034] border border-[#98022e] shadow-sm text-white"
                  : "bg-white border-2 border-[#e3e3e3] shadow-md text-[#333333]"
              }`}
            >
              {/* LEFT STUB — discount */}
              <div
                className={`sm:w-24 md:w-28 w-full shrink-0 flex flex-row sm:flex-col items-center justify-center gap-2 sm:gap-1 py-3 sm:py-6 ${
                  isDark ? "bg-black/15" : "bg-[#f7ecef]"
                }`}
              >
                <Tag
                  size={18}
                  className={isDark ? "text-white" : "text-[#98022e]"}
                />
                <p
                  className={`font-sumana text-lg font-bold text-center leading-tight ${
                    isDark ? "text-white" : "text-[#98022e]"
                  }`}
                >
                  {coupon.discount}
                </p>
              </div>

              {/* PERFORATED DIVIDER — ticket notch effect (desktop only) */}
              <div className="hidden sm:block relative w-0 border-l border-dashed border-gray-300/60">
                <div className="absolute -top-3 -left-3 w-6 h-6 rounded-full bg-white"></div>
                <div className="absolute -bottom-3 -left-3 w-6 h-6 rounded-full bg-white"></div>
              </div>

              {/* RIGHT SIDE — details + coupon code */}
              <div className="flex-1 min-w-0 p-5 flex flex-col justify-between gap-4">
                <div>
                  <h3
                    className={`font-sumana text-base font-bold ${
                      isDark ? "text-white" : "text-[#333333]"
                    }`}
                  >
                    {coupon.title}
                  </h3>
                  <p
                    className={`text-xs mt-1 leading-relaxed normal-case ${
                      isDark ? "text-gray-200" : "text-gray-500"
                    }`}
                  >
                    {coupon.description}
                  </p>
                  <p
                    className={`text-[10px] mt-2 uppercase tracking-wide ${
                      isDark ? "text-gray-300" : "text-gray-400"
                    }`}
                  >
                    {coupon.expiry}
                  </p>
                </div>

                {/* Coupon Code Box */}
                <div
                  className={`flex items-center justify-between gap-2 border border-dashed rounded-sm px-3 py-2 ${
                    isDark
                      ? "border-white/50 bg-black/10"
                      : "border-[#98022e]/60 bg-[#f7ecef]"
                  }`}
                >
                  <span
                    className={`text-sm font-bold tracking-widest truncate normal-case ${
                      isDark ? "text-white" : "text-[#98022e]"
                    }`}
                  >
                    {coupon.code}
                  </span>
                  <button
                    onClick={() => handleCopy(coupon.code)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wide transition-colors shrink-0 cursor-pointer normal-case ${
                      isDark
                        ? "bg-white text-[#98022e] hover:bg-gray-100"
                        : "bg-[#98022e] text-white hover:bg-[#7e1a3c]"
                    }`}
                  >
                    {copiedCode === coupon.code ? (
                      <>
                        <Check size={12} />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy size={12} />
                        Copy
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
};

export default CouponsTable;