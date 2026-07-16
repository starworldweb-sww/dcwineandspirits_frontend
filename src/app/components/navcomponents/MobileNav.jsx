"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Search, X } from 'lucide-react';
import PhoneLeftMenu from '../phone-components/PhoneLeftMenu';

const MobileNavbar = () => {
  const router = useRouter();

  const cartCount = 0;

  // -------------------------------------------------------------
  // SEARCH TOGGLE STATE
  // Ye state sirf PHONE width (md se neeche) pe matter karta hai.
  // Tablet/iPad (md aur upar) pe search hamesha khula hi rahega,
  // isse ignore kar denge - niche classes me "md:" prefix se
  // hum manually force kar rahe hain ki tablet pe sab kuch dikhe.
  // -------------------------------------------------------------
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchWrapperRef = useRef(null);
  const searchInputRef = useRef(null);

  const MOCK_SUGGESTIONS = [
    "Veuve Clicquot Champagne",
    "Dom Perignon",
    "Caymus Wine",
    "Moet & Chandon",
  ];

  const filteredSuggestions = searchQuery.trim()
    ? MOCK_SUGGESTIONS.filter((item) =>
        item.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  // Suggestions dropdown ko bahar click karne pe band karna
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchWrapperRef.current && !searchWrapperRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => document.removeEventListener("click", handleClickOutside, true);
  }, []);

  // Phone pe search icon click - search bar open karo + input pe focus le jao
  const handleOpenSearch = () => {
    setIsSearchOpen(true);
    setTimeout(() => searchInputRef.current?.focus(), 50);
  };

  // Phone pe "X" click - search band karo, query bhi clear kar do
  const handleCloseSearch = () => {
    setIsSearchOpen(false);
    setShowSuggestions(false);
    setSearchQuery("");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setShowSuggestions(false);
    router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    router.push(`/search?q=${encodeURIComponent(suggestion)}`);
  };

  return (
    <div className="sticky top-0 z-50 lg:hidden w-full bg-white flex items-center justify-between gap-3 px-3 py-3 shadow-sm">

      {/* =============================================================
          LOGO
          - Phone, search band: FULL logo dikhega
          - Phone, search khula: CHHOTA icon logo dikhega
          - Tablet (md aur upar): hamesha FULL logo, state se koi farak nahi padta
      ============================================================= */}

      {/* Full/wide logo */}
      <Link
        href="/"
        title="DC Wine & Spirits"
        className={`shrink-0 items-center ${
          isSearchOpen ? "hidden md:flex" : "flex"
        }`}
      >
        <Image
          src="/dc-wine_logo-360x90.webp"
          alt="DC Wine & Spirits"
          width={150}
          height={38}
          className="object-contain w-[130px] h-auto cursor-pointer"
        />
      </Link>

      {/* Compact/icon logo - sirf phone pe dikhega jab search khula ho */}
      <Link
        href="/"
        title="DC Wine & Spirits"
        className={`shrink-0 items-center md:hidden ${
          isSearchOpen ? "flex" : "hidden"
        }`}
      >
        <Image
          src="/dc-wine_logo_mobile.jpg"
          alt="DC Wine & Spirits"
          width={36}
          height={36}
          className="object-contain w-[34px] h-[34px] cursor-pointer"
        />
      </Link>

      {/* =============================================================
          SEARCH BAR
          - Phone, search band: dikhta hi nahi (spacer div uski jagah leta hai)
          - Phone, search khula: poora expand hota hai, saath me "X" close button
          - Tablet (md aur upar): hamesha dikhega, "X" button yahan zaroorat
            nahi hai isliye md:hidden laga diya hai usme
      ============================================================= */}
      <div
        ref={searchWrapperRef}
        className={`flex-1 min-w-0 relative ${
          isSearchOpen ? "flex" : "hidden md:flex"
        }`}
      >
        <form onSubmit={handleSearchSubmit} className="w-full flex items-center gap-2">
          <div className="flex-1 min-w-0 flex items-center border border-gray-300 focus-within:border-[#98022e] rounded px-3 py-2 bg-white h-[40px]">
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Search products..."
              className="flex-1 min-w-0 text-sm text-gray-700 outline-none placeholder:text-gray-400"
            />
            <button type="submit" aria-label="Search" className="text-[#98022e] shrink-0 flex items-center">
              <Search size={18} strokeWidth={2} />
            </button>
          </div>

          {/* Close button - sirf phone ke liye. Tablet pe search hamesha
              khula rehta hai isliye ise band karne ki zaroorat nahi. */}
          <button
            type="button"
            onClick={handleCloseSearch}
            aria-label="Close search"
            className="md:hidden shrink-0 w-[36px] h-[40px] flex items-center justify-center text-gray-500 hover:text-[#98022e] transition-colors"
          >
            <X size={20} strokeWidth={2} />
          </button>
        </form>

        {/* Suggestions Dropdown */}
        {showSuggestions && filteredSuggestions.length > 0 && (
          <div className="absolute top-full left-0 w-full bg-white border border-gray-200 border-t-0 shadow-md z-50 max-h-60 overflow-y-auto">
            {filteredSuggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Spacer - jab phone pe search band ho, tab search bar ki jagah
          ye khaali jagah bhar deta hai. Tablet pe search hamesha dikhta
          hai isliye is spacer ki zaroorat nahi (md:hidden). */}
      {!isSearchOpen && <div className="flex-1 md:hidden" />}

      {/* =============================================================
          RIGHT SIDE - Search icon (phone only) + Cart + Menu
          - Phone, search khula: sirf yehi block poora hide ho jayega
            (kyunki search input already "X" close button de raha hai)
          - Tablet (md aur upar): Cart aur Menu hamesha dikhenge,
            search-toggle icon ki zaroorat nahi (md:hidden)
      ============================================================= */}
      <div
        className={`items-center gap-2 shrink-0 h-[40px] ${
          isSearchOpen ? "hidden md:flex" : "flex"
        }`}
      >

        {/* Search toggle icon - sirf phone ke liye */}
        <button
          type="button"
          onClick={handleOpenSearch}
          aria-label="Open search"
          className="md:hidden w-[36px] h-[40px] flex items-center justify-center text-[#98022e] hover:opacity-80 transition-opacity"
        >
          <Search size={22} strokeWidth={1.5} />
        </button>

        {/* Cart Icon with badge */}
        <Link
          href="/cart"
          className="relative w-[36px] h-[40px] flex items-center justify-center text-[#98022e] hover:opacity-80 transition-opacity"
          title="Cart"
        >
          <ShoppingCart size={22} strokeWidth={1.5} />
          {cartCount > 0 && (
            <span className="absolute top-0 right-0 bg-[#98022e] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </Link>

        {/* Menu Opener */}
        <div className="w-[36px] h-[40px] flex items-center justify-center">
          <PhoneLeftMenu />
        </div>

      </div>

    </div>
  );
};

export default MobileNavbar;