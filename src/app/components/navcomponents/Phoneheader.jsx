"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Hind } from "next/font/google";
import { User, Package, ChevronDown, LogOut } from "lucide-react";
import WavingEmoji from "./WavingEmoji";
import { useUser, useLogout } from "@/app/api/hooks/useAuth"; // apna actual path daal dena

// Loads the "Hind" font from Google Fonts.
// Applied on the outer wrapper div, so all text inside uses it automatically.
const hind = Hind({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

const PhoneHeader = () => {
  // Real auth state — profile data cookie ke basis pe fetch hoti hai
  const { data: user, isLoading } = useUser();
  const logoutMutation = useLogout();
  const isLoggedIn = !!user;

  // Profile dropdown open/close state (jab user login hai tab use hoga)
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = () => {
    setIsProfileOpen(false);
    logoutMutation.mutate();
  };

  return (
    // NOTE: h-[4vh] hata diya - viewport-relative height chhote devices pe unreliable ho sakti hai
    // isliye py-2 use kiya, content ke hisaab se height apne aap set hogi
    <div
      className={`${hind.className} w-full bg-black flex items-center justify-between py-2 px-3 md:flex lg:hidden relative`}
    >
      {/* LEFT - Login (agar login nahi hai) ya User ka naam (agar login hai) */}
      <div className="flex items-center gap-3">
        {isLoading ? (
          // ---- LOADING: profile check ho raha hai ----
          <div className="flex items-center gap-1 text-white">
            <User size={16} strokeWidth={2} />
            <p className="text-[0.8rem]">...</p>
          </div>
        ) : isLoggedIn ? (
          // ---- LOGGED IN: user ka naam + waving emoji dikhao, click pe dropdown khule ----
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen((prev) => !prev)}
              className="flex items-center gap-1 text-white hover:text-gray-300 transition-colors"
            >
              <User size={16} strokeWidth={2} />
              <p className="text-[0.8rem]">Hi, {user?.firstname}</p>
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
                  disabled={logoutMutation.isPending}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors disabled:opacity-60"
                >
                  <LogOut size={14} strokeWidth={2} />
                  {logoutMutation.isPending ? "Logging out..." : "Logout"}
                </button>
              </div>
            )}
          </div>
        ) : (
          // ---- LOGGED OUT: Login page pe le jaayega ----
          <Link
            href="/account/login"
            className="flex items-center gap-1 text-white hover:text-gray-300 transition-colors"
          >
            <User size={16} strokeWidth={2} />
            <p className="text-[0.8rem]">Login</p>
          </Link>
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