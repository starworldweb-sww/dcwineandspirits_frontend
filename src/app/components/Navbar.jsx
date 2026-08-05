"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { User, Heart, Download, Search } from 'lucide-react';
import SearchBar from './navcomponents/SearchBar';

const Navbar = () => {
  // Change this to your actual wishlist count from state/API
  const wishlistCount = 0;

  return (
    <div className="header hidden lg:flex w-full bg-white flex-wrap lg:flex-nowrap items-center justify-between gap-4 lg:gap-6 px-3 2xl:px-32 py-2 lg:py-8">

      {/* Logo */}
      <Link href="/" className="shrink-0" title='DC Wine & Spirits'>
        <Image
          src="/dc-wine_logo-360x90.webp" // replace with your actual logo path
          alt="Logo"
          width={240}
          height={60}
          className="object-contain w-[160px] md:w-[200px] lg:w-[240px] h-auto lg:h-[60px] cursor-pointer"
        />
      </Link>

      {/* Search Bar */}
      {/* order-3 pushes the search bar to its own row on small screens,
          lg:order-none puts it back in the middle on large screens */}
     <SearchBar />

      {/* Right Side Icons + Button */}
      <div className="flex items-center gap-4 md:gap-5 shrink-0">

        {/* Account Icon */}
        <Link href="/account" className="text-[#98022e] hover:opacity-80 transition-opacity" title='Account'>
          <User size={30} className="md:w-[34px] md:h-[34px]" strokeWidth={1} />
        </Link>

        {/* Wishlist Icon with count badge */}
        <Link href="/wishlist" className="relative text-[#98022e] hover:opacity-80 transition-opacity" title='Wishlist'>
          <Heart size={30} className="md:w-[34px] md:h-[34px]" strokeWidth={1} />
          <span className="absolute -top-2 -right-2 bg-[#98022e] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
            {wishlistCount}
          </span>
        </Link>

        {/* Bulk Orders Form Button - text hides on smaller screens, icon stays */}
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