"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { Sumana } from "next/font/google";
import { ChevronDown, ShoppingBag, X } from "lucide-react";
import { useTopCategoryHeader } from "@/app/api/hooks/category/useTopCategoryHeader";
import GiftsByDropDown from "../DropdownComponent/GiftsByDropdown";
import ShopByBrandDropDown from "../DropdownComponent/ShopByBrandDropdown";
import PersonalizedDropDown from "../DropdownComponent/PersonalizedDropDown";
import WineGiftsDropdown from "../DropdownComponent/WineGiftsDropdown";
import OcassionsDropDown from "../DropdownComponent/OcassionsDropDown";
import { useGetCartList } from "@/app/api/hooks/cart/useGetCartList";

const toSlug = (title) =>
  title
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const DROPDOWN_COMPONENTS = {
  "Gifts By": GiftsByDropDown,
  "Shop By Brand": ShopByBrandDropDown,
  "Personalization": PersonalizedDropDown,
  "Wine Gifts": WineGiftsDropdown,
  "Occasion": OcassionsDropDown,
};

const COMPACT_DROPDOWNS = ["Gifts By"];

const TAX_RATE = 0.0625;

const Stickynav = () => {
  const [openMenu, setOpenMenu] = useState(null);
  const [compactLeft, setCompactLeft] = useState(0);
  const [showCart, setShowCart] = useState(false);
  const itemRefs = useRef({});
  const { data, isLoading, isError } = useTopCategoryHeader();
  const { data: cartlist } = useGetCartList();

  const rawItems = data || [];
  const MENU_ITEMS = rawItems?.map((item) => ({
    label: item.title,
    href: `/${toSlug(item.title)}`,
    hasDropdown: item.title !== "Deals & Sale",
  }));

  const cartItems = cartlist?.items || [];
  const cartItemCount = cartItems.length;

  // 6. Price/qty math for the mini-cart panel
  const getUnitPrice = (product) => {
    const special = parseFloat(product?.special_price);
    const regular = parseFloat(product?.price);
    return !isNaN(special) && special > 0 ? special : (regular || 0);
  };

  const subTotal = cartItems.reduce(
    (sum, i) => sum + getUnitPrice(i.product) * (i.quantity || 1),
    0
  );
  const tax = subTotal * TAX_RATE;
  const total = subTotal + tax;

  const handleOpen = (label) => {
    setOpenMenu(label);
    const el = itemRefs.current[label];
    if (el) {
      setCompactLeft(el.offsetLeft);
    }
  };


  const ActiveDropdown = DROPDOWN_COMPONENTS[openMenu];
  const isCompact = COMPACT_DROPDOWNS.includes(openMenu);

  return (
    <div className="font-sumana relative hidden lg:block w-full bg-white border-b border-gray-200 sticky top-0 z-40  2xl:px-32 uppercase border-t-1">
      <div className="flex items-center justify-around gap-28 w-full h-12">
        <div className="flex items-center h-full gap-3 xl:gap-5 py-6">
          {isLoading && <span className="text-sm text-gray-400 normal-case"></span>}
          {isError && <span className="text-sm text-gray-400 normal-case">Menu unavailable</span>}

          {!isLoading && !isError && MENU_ITEMS.map((item, index) => (
            <div
              key={item.label}
              ref={(el) => (itemRefs.current[item.label] = el)}
              className="relative h-full flex items-center"
              onMouseEnter={() => item.hasDropdown && handleOpen(item.label)}
              onMouseLeave={() => item.hasDropdown && setOpenMenu(null)}
            >
              <Link
                href={item.href}
                className="flex items-center gap-2 font-bold lg:text-[15px] xl:text-[17px] text-black hover:text-[#98022e] transition-all "
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

        {/* 7. Cart trigger + hover mini-cart wrapper */}
        <div
          className="relative h-full"
          onMouseEnter={() => setShowCart(true)}
          onMouseLeave={() => setShowCart(false)}
        >
          <Link href="/account/cart" className="flex items-center gap-3 h-full group">
            <span className="font-bold text-[12px] text-[rgb(155,0,71)] group-hover:text-[#7e1a3c] transition-colors">
              {cartItemCount} item(s) - ${subTotal.toFixed(2)}
            </span>
            <span className="relative bg-[#98022e] group-hover:bg-[#7e1a3c] w-11 h-11 flex items-center justify-center transition-colors">
              <ShoppingBag size={20} className="text-white" strokeWidth={1.5} />
              <span className="absolute -top-1.5 -right-1.5 bg-white text-[#98022e] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-[#98022e]">
                {cartItemCount}
              </span>
            </span>
          </Link>


          {showCart && cartItemCount > 0 && (
            <div className="absolute top-full right-0 w-[380px] bg-white shadow-2xl border border-gray-200 normal-case z-50">
              <div className="max-h-[210px] overflow-y-auto">
                {cartItems.map((item, idx) => {
                  const unitPrice = getUnitPrice(item.product);
                  return (
                    <div
                      key={item?.cart_id || idx}
                      className="flex items-center gap-3 px-4 py-3 border-b border-gray-100"
                    >
                      <div className="w-12 h-12 flex-shrink-0 bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden">
                        {item?.product?.image ? (

                          <img
                            src={`${process.env.NEXT_PUBLIC_PRODUCTION_IMAGE_URL}${item?.product?.image}`}
                            alt={item?.product?.name || "Product"}
                            className="w-full h-full object-contain"
                          />
                        ) : null}
                      </div>

                      <a href={`/${item?.product?.slug}`} className="flex-1 text-[13px] font-normal text-black leading-snug line-clamp-2">
                        {item?.product?.name}
                      </a>

                      <span className="text-[12px] text-gray-500 whitespace-nowrap">
                        x {item?.quantity}
                      </span>

                      <span className="text-[13px] font-semibold text-black whitespace-nowrap w-16 text-right">
                        ${(unitPrice * item?.quantity).toFixed(2)}
                      </span>

                      <button
                        type="button"
                        aria-label="Remove item"
                        className="text-gray-400 hover:text-[#98022e] transition-colors"
                        onClick={() => { }}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="px-4 py-3 space-y-2 border-b border-gray-100">
                <div className="flex items-center justify-between text-[13px]">
                  <span className="text-gray-600 font-normal">Sub-Total</span>
                  <span className="font-semibold text-black">${subTotal.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-[13px]">
                  <span className="text-gray-600 font-normal">Tax ({(TAX_RATE * 100).toFixed(2)}%)</span>
                  <span className="font-semibold text-black">${tax.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-[15px] pt-1">
                  <span className="text-black font-bold">Total</span>
                  <span className="font-bold text-black">${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="p-3 space-y-2 bg-[#2b3440]">
                <Link
                  href="/cart"
                  className="block w-full text-center py-3 bg-white text-gray-700 font-semibold text-[13px] tracking-wide hover:bg-gray-100 transition-colors"
                >
                  VIEW CART
                </Link>
                <Link
                  href="/checkout"
                  className="block w-full text-center py-3 bg-[#98022e] text-white font-semibold text-[13px] tracking-wide hover:bg-[#7e1a3c] transition-colors"
                >
                  CHECKOUT
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {ActiveDropdown && (
        <div
          onMouseEnter={() => setOpenMenu(openMenu)}
          onMouseLeave={() => setOpenMenu(null)}
          className={isCompact ? "absolute top-full" : ""}
          style={isCompact ? { left: `${compactLeft}px` } : undefined}
        >
          <ActiveDropdown />
        </div>
      )}
    </div>
  );
};

export default Stickynav;