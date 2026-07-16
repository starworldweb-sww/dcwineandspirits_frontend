"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sumana } from "next/font/google";
import { ChevronDown, ShoppingBag } from "lucide-react";

// Loads the "Sumana" font, same way Enriqueta was loaded in the old Stickynav
const sumana = Sumana({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
});

// Menu items shown on the left side of the sticky nav.
// Each one can optionally have a dropdown (hasDropdown: true).
// Wire up your real dropdown components where the comments say so.
const MENU_ITEMS = [
  { label: "Gifts By", href: "/gifts-by", hasDropdown: true },
  { label: "Shop By Brand", href: "/shop-by-brand", hasDropdown: true },
  { label: "Personalization", href: "/personalization", hasDropdown: true },
  { label: "Wine Gifts", href: "/wine-gifts", hasDropdown: true },
  { label: "Occasion", href: "/occasion", hasDropdown: true },
  { label: "Deals & Sale", href: "/deals-and-sale", hasDropdown: false },
];

const Stickynav = () => {
  // Tracks which menu item's dropdown is currently open (by label).
  // null means no dropdown is open.
  const [openMenu, setOpenMenu] = useState(null);

  // Replace these with your real cart data (React Query / context / etc.)
  const cartItemCount = 0;
  const cartTotal = "0.00";

  return (
    <div className={`${sumana.className} hidden lg:block w-full bg-white border-b border-gray-200 sticky top-0 z-40  2xl:px-32 uppercase border-t-1`}>
      <div className="flex items-center justify-between w-full h-12">

        {/* Left side: hamburger icon + main menu links */}
        <div className="flex items-center h-full gap-8 py-6">

          {/* Hamburger / all-categories icon, like in the reference image */}
          <button className="text-black hover:text-[#98022e] transition-colors">
            <svg width="20" height="14" viewBox="0 0 20 14" fill="none">
              <path d="M0 1H20" stroke="currentColor" strokeWidth="2" />
              <path d="M0 7H20" stroke="currentColor" strokeWidth="2" />
              <path d="M0 13H20" stroke="currentColor" strokeWidth="2" />
            </svg>
          </button>

          {MENU_ITEMS.map((item) => (
            <div
              key={item.label}
              className="relative h-full flex items-center"
              onMouseEnter={() => item.hasDropdown && setOpenMenu(item.label)}
              onMouseLeave={() => item.hasDropdown && setOpenMenu(null)}
            >
              <Link
                href={item.href}
                className="flex items-center gap-1 font-bold text-[17px] text-black hover:text-[#98022e] transition-colors "
              >
                {item.label}
                {item.hasDropdown && <ChevronDown size={14} className="mt-[2px]" />}
              </Link>

              {/* Dropdown panel - swap this placeholder for your real
                  dropdown component (GiftsByDropDown, BrandsDropdownMenu, etc.) */}
              {item.hasDropdown && openMenu === item.label && (
                <div className="absolute top-full left-0 w-64 bg-white border border-gray-200 shadow-lg p-4">
                  {/* e.g. <GiftsByDropDown /> */}
                  <p className="text-sm text-gray-500">{item.label} dropdown goes here</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Right side: cart summary */}
        <Link
          href="/cart"
          className="flex items-center gap-3 h-full group"
        >
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
    </div>
  );
};

export default Stickynav;