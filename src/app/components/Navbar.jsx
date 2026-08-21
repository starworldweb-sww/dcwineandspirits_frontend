"use client";

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { User, Heart, Download, Edit3, FileText, LogOut, ChevronDown } from 'lucide-react';
import SearchBar from './navcomponents/SearchBar';
import { useUser, useLogout } from "@/app/api/hooks/useAuth"; // apna actual path daal dena
import { useGetWishlist } from "@/app/api/hooks/wishlist/useGetWishlist";

const Navbar = () => {
  const { data: user } = useUser();
  const logoutMutation = useLogout();
  const isLoggedIn = !!user;

  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const closeTimeoutRef = useRef(null);

  const { data: wishlistData } = useGetWishlist();
  const wishlistCount = wishlistData?.data?.items?.total ?? 0;

  const handleLogout = () => {
    setIsAccountOpen(false);
    logoutMutation.mutate();
  };

  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    setIsAccountOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setIsAccountOpen(false);
    }, 150);
  };

  return (
    <div className="header hidden lg:flex w-full bg-white flex-wrap lg:flex-nowrap items-center justify-between gap-4 lg:gap-6 px-3 2xl:px-32 py-2 lg:py-6.5">

      {/* Logo */}
      <Link href="/" className="shrink-0" title='DC Wine & Spirits'>
        <Image
          src="/dc-wine_logo-360x90.webp"
          loading="eager"
          alt="Logo"
          width={240}
          height={60}
          className="object-contain w-[160px] md:w-[200px] lg:w-[240px] h-auto lg:h-[60px] cursor-pointer"
        />
      </Link>

      {/* Search Bar */}
      <SearchBar />

      {/* Right Side Icons + Button */}
      <div className="flex items-center gap-4 md:gap-5 shrink-0">

        {/* Account Icon / Dropdown */}
        {isLoggedIn ? (
          <div
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {/* 1. FIX: plain Link, koi router.push nahi - click seedha /account pe navigate karega */}
            <Link
              href="/account"
              onClick={() => setIsAccountOpen(false)}
              className="flex items-center gap-1.5 text-[#98022e] hover:opacity-80 transition-opacity cursor-pointer"
              title="Account"
            >
              <User size={30} className="md:w-[34px] md:h-[34px]" strokeWidth={1} />
              <span className="hidden md:inline text-sm font-semibold tracking-wide">
                ACCOUNT
              </span>
              <ChevronDown
                size={16}
                strokeWidth={2}
                className={`transition-transform duration-200 ${isAccountOpen ? "rotate-180" : ""}`}
              />
            </Link>

            {isAccountOpen && (
              // 2. FIX: right-0 ki jagah center-align (left-1/2 -translate-x-1/2)
              //    taaki dropdown account button ke exact neeche ho, left ki
              //    taraf overhang na kare
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 w-56 z-50">
                <div className="bg-white border border-gray-100 rounded-md shadow-xl shadow-black/10 overflow-hidden">
                  <Link
                    href="/account/edit"
                    onClick={() => setIsAccountOpen(false)}
                    className="flex items-center gap-3 px-5 py-3.5 text-[#98022e] font-semibold text-sm tracking-wide hover:bg-gray-50 transition-colors"
                  >
                    <Edit3 size={18} strokeWidth={1.75} />
                    EDIT ACCOUNT
                  </Link>
                  <div className="h-px bg-gray-100 mx-5" />
                  <Link
                    href="/account/order/"
                    onClick={() => setIsAccountOpen(false)}
                    className="flex items-center gap-3 px-5 py-3.5 text-[#98022e] font-semibold text-sm tracking-wide hover:bg-gray-50 transition-colors"
                  >
                    <FileText size={18} strokeWidth={1.75} />
                    MY ORDERS
                  </Link>
                  <div className="h-px bg-gray-100 mx-5" />
                  <button
                    onClick={handleLogout}
                    disabled={logoutMutation.isPending}
                    className="w-full flex items-center gap-3 px-5 py-3.5 text-[#98022e] font-semibold text-sm tracking-wide hover:bg-gray-50 transition-colors disabled:opacity-60"
                  >
                    <LogOut size={18} strokeWidth={1.75} />
                    {logoutMutation.isPending ? "LOGGING OUT..." : "LOGOUT"}
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Link
            href="/account/login"
            className="text-[#98022e] hover:opacity-80 transition-opacity"
            title="Login"
          >
            <User size={30} className="md:w-[34px] md:h-[34px]" strokeWidth={1} />
          </Link>
        )}

        {/* Wishlist Icon with count badge */}
        <Link href="/account/wishlist" className="relative text-[#98022e] hover:opacity-80 transition-opacity" title='Wishlist'>
          <Heart size={30} className="md:w-[34px] md:h-[34px]" strokeWidth={1} />
          <span className="absolute -top-2 -right-2 bg-[#98022e] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
            {wishlistCount}
          </span>
        </Link>

        {/* Bulk Orders Form Button */}
        <Link
          title='Bulk Order Form'
          href="/bulk-orders"
          className="flex items-center gap-2 bg-[#98022e] hover:bg-[#7e1a3c] text-white text-sm font-semibold px-3 md:px-4 py-3 hover:rounded-md whitespace-nowrap transition-colors"
        >
          <Download size={16} />
          <span className="hidden md:inline font-sarabun">BULK ORDERS FORM</span>
        </Link>

      </div>

    </div>
  );
};

export default Navbar;