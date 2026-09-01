"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

function setCookie(name, value, days = 365) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

function getCookie(name) {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

export default function AgeVerificationGate({ onClose }) {
  const [mounted, setMounted] = useState(false);
  const [show, setShow] = useState(false);
  const [denied, setDenied] = useState(false);

  useEffect(() => {
    setMounted(true);
    const verified = getCookie("ageVerified");
    if (verified !== "true") {
      setShow(true);
    }
  }, []);

  const handleAllow = () => {
    setCookie("ageVerified", "true", 365);
    setShow(false); // ✅ CRITICAL FIX: Hide the popup
    if (onClose) onClose(); // Notify parent
  };

  const handleDeny = () => {
    setDenied(true);
  };

  if (!mounted || !show) return null;

  return (
    <>
      {/* Blur overlay */}
      <div className="fixed inset-0 z-[9998] backdrop-blur-[3px] bg-black/20 pointer-events-none" />

      {/* Popup */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
        <div className="relative w-full max-w-[400px] px-8 pt-9 pb-8 text-center bg-white shadow-xl rounded-lg border border-gray-100">
          {!denied ? (
            <>
              <div className="mb-5 flex justify-center">
                <Image
                  src="/dc-wine_logo-360x90.webp"
                  alt="DC Wine & Spirits"
                  width={160}
                  height={40}
                  className="object-contain"
                />
              </div>

              <h2 className="font-['cambriaregular',Cambria,Georgia,serif] text-[19px] text-[#1a1a1a] font-bold mb-2">
                Age Verification
              </h2>

              <p className="text-[13px] text-gray-500 leading-relaxed mb-6">
                This website features wine and spirits. <br />
                You must be 21 years of age or older to enter.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={handleAllow}
                  className="flex-1 py-3 rounded-sm bg-[#98022e] text-white text-[12px] font-bold tracking-[0.12em] uppercase cursor-pointer hover:bg-black transition-colors"
                >
                  Yes, I Am 21+
                </button>
                <a
                  type="button"
                  href="https://www.google.com/search?q=dc+wine+and+spirits"
                  
                  onClick={handleDeny}
                  className="flex-1 py-3 rounded-sm bg-white text-gray-400 text-[12px] tracking-[0.12em] uppercase border border-gray-200 cursor-pointer hover:border-gray-400 hover:text-black transition-colors"
                >
                  No, I Am Not
                </a>
              </div>

              <p className="text-[11px] text-gray-400 leading-relaxed mt-5">
                By selecting "Yes", you confirm that you are at least 21 years
                old and legally permitted to purchase alcohol in your region.
              </p>
            </>
          ) : (
            <div className="flex flex-col items-center gap-3 py-4">
              <div className="w-11 h-11 rounded-full border border-[#98022e] flex items-center justify-center text-[#98022e] text-lg">
                ✕
              </div>
              <p className="font-['cambriaregular',Cambria,Georgia,serif] text-[18px] font-bold text-[#1a1a1a]">
                Access Restricted
              </p>
              <p className="text-[12px] text-gray-400 leading-relaxed">
                You must be 21 or older to enter this site. <br />
                Please return when you are of legal drinking age.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}