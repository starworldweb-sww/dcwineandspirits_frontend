"use client";

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Search, X, Mic } from 'lucide-react';
import PhoneLeftMenu from '../phone-components/PhoneLeftMenu';
import { useSearchAllProducts } from "@/app/api/hooks/useSearchAllProducts";
import { decodeHtml } from '@/libs/decodeHtml';

// ======================== CONSTANTS ========================
const DEBOUNCE_DELAY = 400;
const DROPDOWN_VISIBLE_LIMIT = 4;
const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_PRODUCTION_IMAGE_URL;

// ======================== VOICE SEARCH HOOK (same as desktop SearchBar se) ========================
function useVoiceSearch({ lang = "en-IN" } = {}) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [voiceError, setVoiceError] = useState(null);
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      typeof window !== "undefined" &&
      (window.SpeechRecognition || window.webkitSpeechRecognition);
    setIsSupported(Boolean(SpeechRecognition));
  }, []);

  const startListening = useCallback(() => {
    const SpeechRecognition =
      typeof window !== "undefined" &&
      (window.SpeechRecognition || window.webkitSpeechRecognition);

    if (!SpeechRecognition) {
      setVoiceError("Voice search is not supported in this browser");
      return;
    }

    setVoiceError(null);
    setTranscript("");

    const recognition = new SpeechRecognition();
    recognition.lang = lang;
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
    };

    recognition.onerror = (event) => {
      if (event.error === "not-allowed" || event.error === "permission-denied") {
        setVoiceError("Mic permission denied. Please allow microphone access.");
      } else if (event.error === "no-speech") {
        setVoiceError("Didn't catch that. Try again.");
      } else {
        setVoiceError("Voice search failed. Try again.");
      }
      setIsListening(false);
    };

    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
  }, [lang]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
  }, []);

  return {
    isListening,
    transcript,
    voiceError,
    isSupported,
    startListening,
    stopListening,
  };
}

const MobileNavbar = () => {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  const cartCount = 0;

  useEffect(() => {
    setIsClient(true)
  }, [])
  // -------------------------------------------------------------
  // SEARCH TOGGLE STATE
  // -------------------------------------------------------------
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // 1) Search input + debounce state
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchWrapperRef = useRef(null);
  const searchInputRef = useRef(null);

  // 2) Voice search hook attach kiya
  const {
    isListening,
    transcript,
    voiceError,
    isSupported: isVoiceSupported,
    startListening,
    stopListening,
  } = useVoiceSearch({ lang: "en-IN" });

  // 2a. Voice error input ke andar overlay ki tarah dikhega aur 2 second
  // baad khud gayab ho jayega.
  const [showVoiceError, setShowVoiceError] = useState(false);
  useEffect(() => {
    if (!voiceError) return;
    setShowVoiceError(true);
    const timer = setTimeout(() => setShowVoiceError(false), 2000);
    return () => clearTimeout(timer);
  }, [voiceError]);

  // 3) Real API call - dropdown suggestions ke liye
  const { data, isLoading, isFetching } = useSearchAllProducts(
    { data: debouncedValue, page: 1, limit: 8 },
    { enabled: debouncedValue.length > 0 }
  );

  const results = data?.data ?? [];
  const total = data?.total ?? 0;
  const visibleResults = useMemo(
    () => results.slice(0, DROPDOWN_VISIBLE_LIMIT),
    [results]
  );

  // NOTE: Ghost-text autocomplete (halka grey overlay text jo input ke
  // andar aage se dikhta tha) hata diya gaya hai — user ko wo overlapping/
  // garbled lag raha tha. Dropdown suggestions (neeche wali list) rakhi hai.

  // 5) Debounce - typing rukne ke 400ms baad hi API call trigger hogi
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(searchQuery.trim());
    }, DEBOUNCE_DELAY);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // 6) Debounced value aane pe dropdown khol do
  useEffect(() => {
    setShowSuggestions(debouncedValue.length > 0);
  }, [debouncedValue]);

  // 7) Voice se jo bola gaya text mila usse input mein daal do
  useEffect(() => {
    if (!transcript) return;
    setSearchQuery(transcript);
    searchInputRef.current?.focus();
  }, [transcript]);

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
    setDebouncedValue("");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setShowSuggestions(false);
    router.push(`/productsDynamic?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  // 8) Escape se dropdown band karna (Tab/ArrowRight ghost-accept logic hata diya, ghost text hi nahi hai ab)
  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setShowSuggestions(false);
      searchInputRef.current?.blur();
    }
  };

  const handleResultClick = () => {
    setShowSuggestions(false);
  };

  // 9) Input clear (X icon jo sirf text hatata hai, poora search band nahi karta)
  const handleClearText = () => {
    setSearchQuery("");
    setDebouncedValue("");
    searchInputRef.current?.focus();
  };

  const handleMicClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  // 10) Matching text ko bold/highlight karna results mein
  const highlightMatch = (text, query) => {
    if (!query || !text) return text;
    const idx = text.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return text;
    return (
      <>
        {text.slice(0, idx)}
        <span className="font-bold text-[#98022e]">
          {text.slice(idx, idx + query.length)}
        </span>
        {text.slice(idx + query.length)}
      </>
    );
  };

  // 11) Loading state ke liye skeleton rows
  const SkeletonLoader = () => (
    <div className="p-3 space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-3 animate-pulse">
          <div className="w-10 h-10 bg-gray-200 rounded-md shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="sticky top-0 z-50 lg:hidden w-full bg-white flex items-center justify-between gap-3 px-3 py-3 shadow-sm">

      {/* =============================================================
          LOGO
      ============================================================= */}

      {/* Full/wide logo */}
      <Link
        href="/"
        title="DC Wine & Spirits"
        className={`shrink-0 items-center ${isSearchOpen ? "hidden md:flex" : "flex"
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
        className={`shrink-0 items-center md:hidden ${isSearchOpen ? "flex" : "hidden"
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
          - Ghost-text autocomplete hata diya (garbled/overlapping lag raha tha)
          - Dropdown suggestions (product list) rakhi hai
      ============================================================= */}
      <div
        ref={searchWrapperRef}
        className={`flex-1 min-w-0 relative ${isSearchOpen ? "flex" : "hidden md:flex"
          }`}
      >
        <form onSubmit={handleSearchSubmit} className="w-full flex items-center gap-2">
          <div className="relative flex-1 min-w-0 flex items-center border border-gray-300 focus-within:border-[#98022e] rounded px-3 py-2 bg-white h-[40px]">

            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => {
                if (searchQuery.trim().length > 0) setShowSuggestions(true);
              }}
              placeholder={isListening ? "Listening..." : "Search products..."}
              autoComplete="off"
              spellCheck="false"
              className="relative flex-1 min-w-0 text-sm text-gray-700 outline-none placeholder:text-gray-400 bg-transparent"
            />

            {/* Text clear button - sirf text hatata hai, search box open hi rehta hai */}
            {searchQuery && (
              <button
                type="button"
                onClick={handleClearText}
                aria-label="Clear text"
                className="shrink-0 flex items-center justify-center w-6 h-6 text-gray-400 hover:text-gray-600 transition-colors mr-1"
              >
                <X size={14} />
              </button>
            )}

            {/* Voice search mic button */}
            {isVoiceSupported && (
              <button
                type="button"
                onClick={handleMicClick}
                title={isListening ? "Stop listening" : "Search by voice"}
                aria-label={isListening ? "Stop listening" : "Search by voice"}
                className={`relative shrink-0 flex items-center justify-center w-6 h-6 mr-1 transition-colors ${isListening ? "text-red-500" : "text-gray-400 hover:text-gray-600"
                  }`}
              >
                {isListening && (
                  <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-30 animate-ping" />
                )}
                <Mic size={16} className="relative" />
              </button>
            )}

            <button type="submit" aria-label="Search" className="text-[#98022e] shrink-0 flex items-center">
              <Search size={18} strokeWidth={2} />
            </button>

            {/* Voice error - input box ke andar overlay ki tarah dikhta hai,
                2 second baad khud gayab ho jaata hai */}
            {showVoiceError && voiceError && (
              <div className="absolute inset-0 flex items-center px-3 bg-white rounded pointer-events-none">
                <span className="text-xs text-red-500 truncate">{voiceError}</span>
              </div>
            )}

            {/* Suggestions Dropdown - product results list, input box ke andar hi */}
            {showSuggestions && (
              <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-white border border-gray-200 rounded shadow-md z-50 max-h-72 overflow-y-auto">
                {(isLoading || isFetching) ? (
              <SkeletonLoader />
            ) : results.length === 0 ? (
              <div className="p-4 text-sm text-gray-500">
                No results found for &quot;{debouncedValue}&quot;
              </div>
            ) : (
              <>
                <ul className="divide-y divide-gray-100">
                  {visibleResults.map((product) => (
                    <li key={product.product_id}>
                      <Link
                        href={`/${product.slug}/`}
                        onClick={handleResultClick}
                        className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 transition-colors"
                      >
                        {/* Product Image */}
                        {product.image && (
                          <div className="relative w-10 h-10 shrink-0 bg-gray-50 rounded overflow-hidden">
                            <Image
                              src={`${IMAGE_BASE_URL}${product.image}`}
                              alt={product.name || ""}
                              fill
                              className="object-contain"
                              sizes="40px"
                            />
                          </div>
                        )}

                        {/* Product Info with Highlighted Text */}
                        <div className="min-w-0 flex-1">
                          <p className="text-sm text-gray-800 truncate">
                            {highlightMatch(decodeHtml(product.name), debouncedValue)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {product.special_price ? (
                              <>
                                <span className="line-through mr-1">
                                  ${product.price}
                                </span>
                                <span className="text-[#98022e] font-medium">
                                  ${product.special_price}
                                </span>
                              </>
                            ) : (
                              <span>${product.price}</span>
                            )}
                          </p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>

                {/* View All Button */}
                {total > DROPDOWN_VISIBLE_LIMIT && (
                  <Link
                    href={`/productsDynamic?search=${encodeURIComponent(debouncedValue)}`}
                    onClick={handleResultClick}
                    className="block text-center text-sm text-[#98022e] font-medium py-2.5 border-t border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    View all {total} results
                  </Link>
                )}
              </>
            )}
              </div>
            )}
          </div>

          {/* Close button - sirf phone ke liye. */}
          <button
            type="button"
            onClick={handleCloseSearch}
            aria-label="Close search"
            className="md:hidden shrink-0 w-[36px] h-[40px] flex items-center justify-center text-gray-500 hover:text-[#98022e] transition-colors"
          >
            <X size={20} strokeWidth={2} />
          </button>
        </form>
      </div>

      {/* Spacer */}
      {!isSearchOpen && <div className="flex-1 md:hidden" />}

      {/* =============================================================
          RIGHT SIDE - Search icon (phone only) + Cart + Menu
      ============================================================= */}
      <div
        className={`items-center gap-2 shrink-0 h-[40px] ${isSearchOpen ? "hidden md:flex" : "flex"
          }`}
      >

        {/* Search toggle icon - sirf phone ke liye */}
        {isClient && <button
          type="button"
          onClick={handleOpenSearch}
          aria-label="Open search"
          className="md:hidden w-[36px] h-[40px] flex items-center justify-center text-[#98022e] hover:opacity-80 transition-opacity"
        >
          <Search size={22} strokeWidth={1.5} />
        </button>
        }
        {/* Cart Icon with badge */}
        <Link
          href="/account/cart"
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