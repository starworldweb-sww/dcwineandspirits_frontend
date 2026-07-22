"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sumana } from "next/font/google";
import { ChevronDown, ShoppingBag } from "lucide-react";
import { useTopCategoryHeader } from "@/app/api/hooks/category/useTopCategoryHeader";
import GiftsByDropDown from "../DropdownComponent/GiftsByDropdown";
import ShopByBrandDropDown from "../DropdownComponent/ShopByBrandDropdown";
import PersonalizedDropDown from "../DropdownComponent/PersonalizedDropDown";
// Apna exact path zaroor check kar lena

const sumana = Sumana({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
});

const toSlug = (title) =>
  title
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

// 1. Title ke against sahi dropdown component ka mapping
//    - Naya dropdown add karna ho toh bas yahan ek line add karni hai
const DROPDOWN_COMPONENTS = {
  "Gifts By": GiftsByDropDown,
  "Shop By Brand": ShopByBrandDropDown,
  "Personalization": PersonalizedDropDown,
};

const Stickynav = () => {
  const [openMenu, setOpenMenu] = useState(null);
  const { data, isLoading, isError } = useTopCategoryHeader();
  const rawItems = data || [];

  // 2. "Deals & Sale" ke alawa baaki sabka dropdown hai
  const MENU_ITEMS = rawItems.map((item) => ({
    label: item.title,
    href: `/${toSlug(item.title)}`,
    hasDropdown: item.title !== "Deals & Sale",
  }));

  const cartItemCount = 0;
  const cartTotal = "0.00";

  return (
    <div className={`${sumana.className} relative hidden lg:block w-full bg-white border-b border-gray-200 sticky top-0 z-40  2xl:px-32 uppercase border-t-1`}>
      <div className="flex items-center justify-between w-full h-12">

        <div className="flex items-center h-full gap-8 py-6">

          {isLoading && <span className="text-sm text-gray-400 normal-case"></span>}
          {isError && <span className="text-sm text-gray-400 normal-case">Menu unavailable</span>}

          {!isLoading && !isError && MENU_ITEMS.map((item, index) => (
            <div
              key={item.label}
              className="relative h-full flex items-center"
              onMouseEnter={() => item.hasDropdown && setOpenMenu(item.label)}
              onMouseLeave={() => item.hasDropdown && setOpenMenu(null)}
            >
              <Link
                href={item.href}
                className="flex items-center gap-2 font-bold text-[17px] text-black hover:text-[#98022e] transition-colors "
              >
                {index === 0 && (
                  <svg width="20" height="14" viewBox="0 0 20 14" fill="none">
                    <path d="M0 1H20" stroke="currentColor" strokeWidth="2" />
                    <path d="M0 7H20" stroke="currentColor" strokeWidth="2" />
                    <path d="M0 13H20" stroke="currentColor" strokeWidth="2" />
                  </svg>
                )}
                {item.label}
                {item.hasDropdown && <ChevronDown size={14} className="mt-[2px]" />}
              </Link>
            </div>
          ))}
        </div>

        <Link href="/cart" className="flex items-center gap-3 h-full group">
          <span className="font-bold text-[12px] text-[rgb(155,0,71)] group-hover:text-[#7e1a3c] transition-colors">
            {cartItemCount} item(s) - ${cartTotal}
          </span>
          <span className="relative bg-[#98022e] group-hover:bg-[#7e1a3c] w-11 h-11 flex items-center justify-center transition-colors">
            <ShoppingBag size={20} className="text-white" strokeWidth={1.5} />
            <span className="absolute -top-1.5 -right-1.5 bg-white text-[#98022e] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-[#98022e]">
              {cartItemCount}
            </span>
          </span>
        </Link>

      </div>

      {/* 3. Active dropdown ko mapping se uthaya - agar mapping mein nahi mila toh kuch render nahi hoga */}
      {(() => {
        const ActiveDropdown = DROPDOWN_COMPONENTS[openMenu];
        if (!ActiveDropdown) return null;

        return (
          <div onMouseEnter={() => setOpenMenu(openMenu)} onMouseLeave={() => setOpenMenu(null)}>
            <ActiveDropdown />
          </div>
        );
      })()}
    </div>
  );
};

export default Stickynav;