"use client";

import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";

export default function GoToTopButton() {
  const [show, setShow] = useState(false);

  const scrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
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
      onClick={scrollTop}
      style={{ pointerEvents: show ? "auto" : "none" }}
      className={`fixed cursor-pointer flex items-center justify-center bottom-10 right-4 z-[9999] size-12 rounded-md bg-blue-300 text-white transition-all duration-500 shadow-md
      ${
        show
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4"
      }`}
    >
      <ChevronUp size={24} strokeWidth={2.5} />
    </button>
  );
}