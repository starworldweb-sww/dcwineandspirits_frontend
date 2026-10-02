"use client";

import { useEffect, useRef } from "react";

const ReadingProgress = () => {
  const progressRef = useRef(null);

  useEffect(() => {
    let rafId = null;

    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight;
      const viewportHeight = window.innerHeight;

      const maxScroll = scrollHeight - viewportHeight;

      const progress =
        maxScroll > 0 ? Math.min(1, scrollTop / maxScroll) : 0;

      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${progress})`;
      }

      rafId = null;
    };

    const handleScroll = () => {
      if (rafId !== null) return;

      rafId = window.requestAnimationFrame(updateProgress);
    };

    updateProgress();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);

      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, []);

  return (
    <div
      className="
        fixed inset-x-0 top-0
        z-[9999]
        h-[3px]
        pointer-events-none
        overflow-visible
      "
      aria-hidden="true"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-black/[0.04]" />

      {/* Progress */}
      <div
        ref={progressRef}
        className="
          relative
          h-full
          w-full
          origin-left
          will-change-transform
        "
        style={{
          transform: "scaleX(0)",
          background: "linear-gradient(90deg, #98022e, #c20b43)",
          boxShadow: "0 0 8px rgba(152, 2, 46, 0.45)",
        }}
      >
        {/* Glow at the tip */}
    
      </div>
    </div>
  );
};

export default ReadingProgress;
