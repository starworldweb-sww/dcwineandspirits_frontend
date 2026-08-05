"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Hind } from "next/font/google";
import { User, Package, ChevronDown, LogOut } from "lucide-react";
import WavingEmoji from "./WavingEmoji";

// Loads the "Hind" font from Google Fonts.
// Applied on the outer wrapper div, so all text inside uses it automatically.
const hind = Hind({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

const PhoneHeader = () => {
  // 1. MOCK LOGIN STATE
  // Abhi ke liye ye 2 lines hi tumhara "auth" hain, taaki UI test ho sake.
  // Baad me jab real useUser/useLogout hook ready ho, isko unse replace karna.
  const [isLoggedIn, setIsLoggedIn] = useState(true); // true kar ke test karo
  const mockUser = { name: "Aditya" }; // yahan naam change kar ke dekh sakte ho

  // 2. Profile dropdown open/close state (jab user login hai tab use hoga)
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Fake logout - abhi sirf state false kar deta hai
  const handleLogout = () => {
    setIsProfileOpen(false);
    setIsLoggedIn(false);
   
  };

  return (
    // NOTE: h-[4vh] hata diya - viewport-relative height chhote devices pe unreliable ho sakti hai
    // isliye py-2 use kiya, content ke hisaab se height apne aap set hogi
    <div
      className={`${hind.className} w-full bg-black flex items-center justify-between py-2 px-3 md:flex lg:hidden relative`}
    >
      {/* LEFT - Login (agar login nahi hai) ya User ka naam (agar login hai) */}
      <div className="flex items-center gap-3">
        {isLoggedIn ? (
          // ---- LOGGED IN: user ka naam + waving emoji dikhao, click pe dropdown khule ----
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen((prev) => !prev)}
              className="flex items-center gap-1 text-white hover:text-gray-300 transition-colors"
            >
              <User size={16} strokeWidth={2} />
              <p className="text-[0.8rem]">Hi, {mockUser?.name}</p>
              <ChevronDown
                size={14}
                strokeWidth={2}
                className={`transition-transform ${isProfileOpen ? "rotate-180" : ""}`}
              />
            </button>

            {/* Dropdown - Account link + Logout */}
            {isProfileOpen && (
              <div className="absolute top-full left-0 mt-2 w-40 bg-white border border-gray-100 z-60 rounded-sm overflow-hidden shadow-[-3px_12px_20px_-9px_rgba(0,_0,_0,_0.8)]">
                <Link
                  href="/account"
                  onClick={() => setIsProfileOpen(false)}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  My Account
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors"
                >
                  <LogOut size={14} strokeWidth={2} />
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          // ---- LOGGED OUT: sirf Login link dikhao ----
          // NOTE: abhi ke liye click karne pe bhi login "on" kar denge (testing ke liye),
          // asli app me ye ek normal <Link href="/login"> hi rahega jo login page pe le jaayega
          <button
            onClick={() => setIsLoggedIn(true)}
            className="flex items-center gap-1 text-white hover:text-gray-300 transition-colors"
          >
            <User size={16} strokeWidth={2} />
            <p className="text-[0.8rem]">Login</p>
          </button>
        )}
      </div>

      {/* RIGHT - Track Order (replace/extend as needed) */}
      <div>
        <Link
          href="/track-order"
          className="flex items-center gap-1 text-white hover:text-gray-300 transition-colors"
        >
          <Package size={16} strokeWidth={2} />
          <p className="text-[0.8rem]">Track Order</p>
        </Link>
      </div>
    </div>
  );
};

export default PhoneHeader;
