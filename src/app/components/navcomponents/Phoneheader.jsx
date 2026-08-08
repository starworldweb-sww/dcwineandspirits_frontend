"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Hind } from "next/font/google";
import { User, Package, ChevronDown, LogOut } from "lucide-react";
import WavingEmoji from "./WavingEmoji";
import { useUser, useLogout } from "@/app/api/hooks/useAuth"; // apna actual path daal dena

const hind = Hind({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

const PhoneHeader = () => {
  const { data: user, isLoading } = useUser();
  const logoutMutation = useLogout();
  const isLoggedIn = !!user;

  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Good morning";
    if (hour >= 12 && hour < 17) return "Good afternoon";
    if (hour >= 17 && hour < 21) return "Good evening";
    return "Good night";
  };

  const handleLogout = () => {
    setIsProfileOpen(false);
    logoutMutation.mutate();
  };

  return (
    <div
      className={`${hind.className} w-full bg-black flex items-center justify-between py-1.5 px-4 md:flex lg:hidden relative border-b border-white/5`}
    >
      {/* LEFT */}
      <div className="flex items-center gap-4">
        {isLoading ? (
          <div className="flex items-center gap-2 text-white/60">
            <div className="w-6 h-6 rounded-full bg-white/10 animate-pulse" />
            <div className="w-16 h-3 rounded bg-white/10 animate-pulse" />
          </div>
        ) : isLoggedIn ? (
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen((prev) => !prev)}
              className="flex items-center gap-2 rounded-full pl-1 pr-2.5 py-0.5 hover:bg-white/5 transition-colors duration-200"
            >
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-white/10 text-white shrink-0">
                <WavingEmoji isLoggedIn={isLoggedIn} size={13} />
              </div>

              <div className="flex flex-col items-start leading-none gap-0.5">
                <span className="text-[0.62rem] text-white/50 font-normal leading-none">
                  {getGreeting()}
                </span>
                <span className="text-[0.78rem] text-white font-semibold leading-none">
                  {user?.firstname}
                </span>
              </div>

              <ChevronDown
                size={14}
                strokeWidth={2}
                className={`text-white/60 transition-transform duration-200 ${
                  isProfileOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isProfileOpen && (
              <div className="absolute top-full left-0 mt-2 w-44 bg-white border border-gray-100 z-60 rounded-lg overflow-hidden shadow-xl shadow-black/20">
                <Link
                  href="/account"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <User size={14} strokeWidth={2} />
                  My Account
                </Link>
                <div className="h-px bg-gray-100" />
                <button
                  onClick={handleLogout}
                  disabled={logoutMutation.isPending}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-60"
                >
                  <LogOut size={14} strokeWidth={2} />
                  {logoutMutation.isPending ? "Logging out..." : "Logout"}
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            href="/account/login"
            className="flex items-center gap-1.5 text-white/90 hover:text-white transition-colors duration-200"
          >
            <User size={16} strokeWidth={2} />
            <p className="text-[0.8rem] font-medium">Login</p>
          </Link>
        )}
      </div>

      {/* RIGHT */}
      <div>
        <Link
          href="/track-order"
          className="flex items-center gap-1.5 text-white/90 hover:text-white transition-colors duration-200"
        >
          <Package size={16} strokeWidth={2} />
          <p className="text-[0.8rem] font-medium">Track Order</p>
        </Link>
      </div>
    </div>
  );
};

export default PhoneHeader;