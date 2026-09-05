"use client";

import { Search, Mic, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useSearchAllProducts } from "@/app/api/hooks/useSearchAllProducts";
import { decodeHtml } from "@/libs/decodeHtml";


const ROTATING_WORDS = [
  "wine",
  "champagne gift baskets",
  "veuve clicquot",
  "godiva",
  "caymus",
  "birthday gifts",
  "dom perignon",
];

const STATIC_PREFIX = "Search for";

const TYPING_SPEED = 80;
const DELETING_SPEED = 40;
const PAUSE_AFTER_TYPE = 1400;
const PAUSE_AFTER_DELETE = 300;

const DEBOUNCE_DELAY = 400;
const DROPDOWN_VISIBLE_LIMIT = 4;

const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_PRODUCTION_IMAGE_URL;


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

// ======================== MAIN COMPONENT ========================
const SearchBar = () => {
  const router = useRouter();
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);

  // ---------- State ----------
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [debouncedValue, setDebouncedValue] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Rotating placeholder state
  const [wordIndex, setWordIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  // Voice search
  const {
    isListening,
    transcript,
    voiceError,
    isSupported: isVoiceSupported,
    startListening,
    stopListening,
  } = useVoiceSearch({ lang: "en-IN" });

  // ---------- Local error with auto‑dismiss after 3s ----------
  const [displayedError, setDisplayedError] = useState(null);
  const errorTimeoutRef = useRef(null);

  useEffect(() => {
    // Clear any existing timeout
    if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);

    if (voiceError) {
      setDisplayedError(voiceError);
      errorTimeoutRef.current = setTimeout(() => {
        setDisplayedError(null);
      }, 3000);
    } else {
      setDisplayedError(null);
    }

    return () => {
      if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);
    };
  }, [voiceError]);

  // ---------- API hook ----------
  const { data, isLoading, isFetching } = useSearchAllProducts(
    { data: debouncedValue, page: 1, limit: 8 },
    { enabled: debouncedValue.length > 0 }
  );

  // Derived data
  const results = data?.data ?? [];
  const total = data?.total ?? 0;
  const visibleResults = useMemo(
    () => results.slice(0, DROPDOWN_VISIBLE_LIMIT),
    [results]
  );

  // ---------- Ghost suggestion ----------
  const ghostSuggestion = useMemo(() => {
    if (!inputValue) return "";
    const match = results.find((p) =>
      p.name?.toLowerCase().startsWith(inputValue.toLowerCase())
    );
    return match?.name ?? "";
  }, [inputValue, results]);

  const ghostRemainder = ghostSuggestion
    ? ghostSuggestion.slice(inputValue.length)
    : "";

  // ---------- Effects ----------

  // Rotating placeholder animation
  const showAnimatedPlaceholder =
    inputValue.length === 0 && !isFocused && !isListening;

  useEffect(() => {
    if (!showAnimatedPlaceholder) return;

    const currentWord = ROTATING_WORDS[wordIndex];
    let timeout;

    if (!isDeleting && displayedText.length < currentWord.length) {
      timeout = setTimeout(() => {
        setDisplayedText(currentWord.slice(0, displayedText.length + 1));
      }, TYPING_SPEED);
    } else if (!isDeleting && displayedText.length === currentWord.length) {
      timeout = setTimeout(() => setIsDeleting(true), PAUSE_AFTER_TYPE);
    } else if (isDeleting && displayedText.length > 0) {
      timeout = setTimeout(() => {
        setDisplayedText(currentWord.slice(0, displayedText.length - 1));
      }, DELETING_SPEED);
    } else if (isDeleting && displayedText.length === 0) {
      timeout = setTimeout(() => {
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % ROTATING_WORDS.length);
      }, PAUSE_AFTER_DELETE);
    }

    return () => clearTimeout(timeout);
  }, [displayedText, isDeleting, wordIndex, showAnimatedPlaceholder]);

  // Debounce input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(inputValue.trim());
    }, DEBOUNCE_DELAY);
    return () => clearTimeout(timer);
  }, [inputValue]);

  // Voice transcript → set input & trigger search
  useEffect(() => {
    if (!transcript) return;
    setInputValue(transcript);
    setIsFocused(true);
    inputRef.current?.focus();
    // Optionally, directly set debounced value for instant search
    // setDebouncedValue(transcript.trim());
  }, [transcript]);

  // Click outside → close dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Open dropdown when debounced value is present
  useEffect(() => {
    setIsDropdownOpen(debouncedValue.length > 0);
  }, [debouncedValue]);

  // ---------- Handlers ----------
  const handleSearch = useCallback(() => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    router.push(`/products-dynamic?search=${encodeURIComponent(trimmed)}`);
    setIsDropdownOpen(false);
  }, [inputValue, router]);

  const handleKeyDown = useCallback(
    (e) => {
      const cursorAtEnd = e.target.selectionStart === inputValue.length;

      // Accept ghost suggestion on Tab or Right Arrow (only when cursor at end)
      if (
        (e.key === "Tab" || e.key === "ArrowRight") &&
        ghostRemainder &&
        cursorAtEnd
      ) {
        e.preventDefault();
        setInputValue(ghostSuggestion);
        return;
      }

      // Search on Enter
      if (e.key === "Enter") {
        e.preventDefault();
        handleSearch();
      }

      // Close dropdown on Escape
      if (e.key === "Escape") {
        setIsDropdownOpen(false);
        inputRef.current?.blur();
      }
    },
    [ghostRemainder, ghostSuggestion, handleSearch, inputValue.length]
  );

  const handleResultClick = useCallback(() => {
    setIsDropdownOpen(false);
  }, []);

  const handleClear = useCallback(() => {
    setInputValue("");
    setDebouncedValue("");
    inputRef.current?.focus();
  }, []);

  const handleMicClick = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (isListening) {
        stopListening();
      } else {
        startListening();
      }
    },
    [isListening, startListening, stopListening]
  );

  // ---------- Helper: Highlight matching text ----------
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

  // ---------- Skeleton Loader ----------
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

  // ---------- Determine input padding based on icons ----------
  let inputPaddingClass = "pr-5"; // default: no voice, no clear
  if (isVoiceSupported && inputValue) {
    inputPaddingClass = "pr-[90px]"; // space for both clear and mic
  } else if (isVoiceSupported) {
    inputPaddingClass = "pr-11"; // space for mic only (~44px)
  }

  // ---------- Render ----------
  return (
    <>
      <div
        ref={wrapperRef}
        className="relative order-3 lg:order-none w-full lg:flex-1 lg:max-w-[635px]"
      >
        {/* Search Input Container */}
        <div className="relative flex items-center border border-gray-300 rounded-full overflow-hidden h-[38px] md:h-[44px]">
          {/* Ghost text overlay (behind input) */}
          {ghostRemainder && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 flex items-center px-5 text-sm whitespace-pre"
            >
              <span className="invisible">{inputValue}</span>
              <span className="text-gray-400">{ghostRemainder}</span>
            </div>
          )}

          {/* Main Input */}
          <input
            ref={inputRef}
            type="text"
            name="search"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              setIsFocused(true);
              if (inputValue.trim().length > 0) setIsDropdownOpen(true);
            }}
            onBlur={() => setIsFocused(false)}
            autoComplete="off"
            spellCheck="false"
            dir="auto"
            className={`relative w-full h-full pl-5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none bg-transparent ${inputPaddingClass}`}
          />

          {/* Animated Placeholder (when no input, not focused, not listening) */}
          {showAnimatedPlaceholder && (
            <span className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-sm text-gray-400 flex items-center gap-1">
              {STATIC_PREFIX}
              <span>{displayedText}</span>
              <span className="ml-0.5 w-[1px] h-[14px] bg-gray-400 animate-caret" />
            </span>
          )}

          {/* Listening indicator */}
          {isListening && (
            <span className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-sm text-gray-400">
              Listening...
            </span>
          )}

          {/* Clear Button (X) - appears only when input has value */}
          {inputValue && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-[80px] md:right-[88px] top-1/2 -translate-y-1/2 flex items-center justify-center w-7 h-7 rounded-full text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}

          {/* Voice Search Button - always visible if supported */}
          {isVoiceSupported && (
            <button
              type="button"
              onClick={handleMicClick}
              title={isListening ? "Stop listening" : "Search by voice"}
              className={`absolute right-[44px] md:right-[52px] top-1/2 -translate-y-1/2 flex items-center justify-center w-7 h-7 rounded-full transition-colors cursor-pointer ${
                isListening
                  ? "text-red-500"
                  : "text-gray-400 hover:text-gray-600"
              }`}
              aria-label={isListening ? "Stop listening" : "Search by voice"}
            >
              {isListening && (
                <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-30 animate-ping" />
              )}
              <Mic size={16} className="relative" />
            </button>
          )}

          {/* Search Button (always visible) */}
          <button
            type="button"
            onClick={handleSearch}
            className="shrink-0 bg-[#98022e] hover:bg-[#7e1a3c] text-white h-full aspect-square flex items-center justify-center transition-colors cursor-pointer"
            title="Search"
            aria-label="Search"
          >
            <Search size={18} />
          </button>
        </div>

        {/* Voice Error Message - uses displayedError which auto‑clears after 3s */}
        {displayedError && (
          <p className="absolute left-5 top-[calc(100%+4px)] text-xs text-red-500 z-10">
            {displayedError}
          </p>
        )}

        {/* Dropdown Results */}
        {isDropdownOpen && (
          <div className="absolute left-0 right-0 top-[calc(100%+8px)] bg-white border border-gray-200 rounded-2xl shadow-lg max-h-[420px] overflow-y-auto z-50">
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
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors"
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
                    href={`/products-dynamic?search=${encodeURIComponent(debouncedValue)}`}
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

      {/* Global styles for caret animation */}
      <style jsx>{`
        .animate-caret {
          animation: caretBlink 800ms steps(1) infinite;
        }
        @keyframes caretBlink {
          0%,
          50% {
            opacity: 1;
          }
          50.01%,
          100% {
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
};

export default SearchBar;