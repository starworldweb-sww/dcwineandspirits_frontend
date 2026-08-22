"use client";

import React, { useState } from "react";
import ProductsHeader from "@/app/components/TittleAndBreadcrumb";
import AccountSidebar from "@/app/components/AccountSidebar";
import { toast } from "sonner";

// --- BRAND ACCENT ---
const ACCENT = "#8c1a3c";

const breadcrumbs = [
  { label: "Account", href: "/account" },
  { label: "Newsletter", href: "/account/newsletter" },
];

const NewsLetterClient = () => {
  // No API — sirf local UI state
  const [subscribe, setSubscribe] = useState("yes");

  const handleContinue = () => {
    // No API call — sirf placeholder feedback
    toast.success(
      subscribe === "yes"
        ? "You have subscribed to our newsletter."
        : "You have unsubscribed from our newsletter.",
    );
  };

  return (
    <div className="font-['cambriaregular'] text-[#333333] w-full">
      <ProductsHeader
        categoryName="Newsletter Subscription"
        breadcrumbs={breadcrumbs}
      />

      <div className="flex flex-col lg:flex-row lg:items-start lg:gap-6 2xl:gap-8 w-full px-3 lg:px-3 2xl:px-32 mt-10 mb-14">
        {/* Newsletter Form */}
        <div className="flex-1 min-w-0 w-full">
          <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] sm:items-center gap-2 sm:gap-4 mb-8">
            <label className="text-[14px] font-hind-madurai text-[#333333]">
              Subscribe
            </label>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer text-[14px] font-hind-madurai text-[#333333]">
                <input
                  type="radio"
                  name="subscribe"
                  value="yes"
                  checked={subscribe === "yes"}
                  onChange={() => setSubscribe("yes")}
                  className="accent-[#8c1a3c] w-4 h-4 cursor-pointer"
                />
                Yes
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-[14px] font-hind-madurai text-[#333333]">
                <input
                  type="radio"
                  name="subscribe"
                  value="no"
                  checked={subscribe === "no"}
                  onChange={() => setSubscribe("no")}
                  className="accent-[#8c1a3c] w-4 h-4 cursor-pointer"
                />
                No
              </label>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <a href="/account" className="w-full sm:w-auto flex-1">
              <button
                type="button"
                className="w-full bg-black text-white text-[13px] font-hind-madurai font-semibold tracking-[1.5px] uppercase py-3.5 transition-colors duration-300 hover:bg-[#1a1a1a] cursor-pointer"
              >
                Back
              </button>
            </a>
            <button
              type="button"
              onClick={handleContinue}
              className="w-full sm:w-auto flex-1 bg-black text-white text-[13px] font-hind-madurai font-semibold tracking-[1.5px] uppercase py-3.5 transition-colors duration-300 hover:bg-[#1a1a1a] cursor-pointer"
            >
              Continue
            </button>
          </div>
        </div>

        {/* Right Column: Sidebar */}
        <div className="w-full lg:w-[260px] shrink-0">
          <AccountSidebar />
        </div>
      </div>
    </div>
  );
};

export default NewsLetterClient;