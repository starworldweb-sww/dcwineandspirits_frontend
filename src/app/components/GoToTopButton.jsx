"use client";

import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";

export default function GoToTopButton() {
  const [show, setShow] = useState(false);

  const scrollTop = () => {
    // 1. Agar user ne OS mein "reduce motion" ON kiya hai to smooth animation skip karo
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      // Shows the button once the user scrolls down 300px
      setShow(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <button
      type="button"
      onClick={scrollTop}
      aria-label="Go to top of page"
      title="Go to top"
      style={{ pointerEvents: show ? "auto" : "none" }}
      className={`fixed cursor-pointer flex items-center justify-center bottom-10 right-4 z-[9999] size-12 rounded-md bg-blue-700 hover:bg-blue-800 text-white transition-all duration-500 motion-reduce:transition-none shadow-md
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-900
      ${
        show
          ? "opacity-100 translate-y-0 visible"
          : "opacity-0 translate-y-4 invisible"
      }`}
    >
      <ChevronUp size={24} strokeWidth={2.5} aria-hidden="true" />
    </button>
  );
}