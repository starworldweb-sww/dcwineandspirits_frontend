"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Hind } from "next/font/google";

import WavingEmoji from "./WavingEmoji";
import { useUser, useLogout } from "@/app/api/hooks/useAuth";
import { WiSunset } from "react-icons/wi";
import { GiNightSleep } from "react-icons/gi";

import {
  User,
  Package,
  ChevronDown,
  LogOut,
  Sunrise,
  Sun,
} from "lucide-react";

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
    if (hour >= 5 && hour < 12)
      return { text: "Good morning", Icon: Sunrise, color: "text-amber-400" };
    if (hour >= 12 && hour < 17)
      return { text: "Good afternoon", Icon: Sun, color: "text-yellow-400" };
    if (hour >= 17 && hour < 21)
      return { text: "Good evening", Icon: WiSunset, color: "text-orange-400" };
    return { text: "Good night", Icon: GiNightSleep, color: "text-indigo-300" };
  };

  const handleLogout = () => {
    setIsProfileOpen(false);
    logoutMutation.mutate();
  };

  const {
    text: greetingText,
    Icon: GreetingIcon,
    color: greetingColor,
  } = getGreeting();

  return (
    // HEIGHT FIX: py-2 -> py-1.5 taaki overall bar thodi compact ho
    <div
      className={`${hind.className} w-full bg-black flex items-center justify-between py-1.5 px-4 md:flex lg:hidden relative border-b border-white/10`}
    >
      {/* LEFT — Track Order */}
      <div>
        <Link
          href="/track-order"
          className="flex items-center gap-1.5 text-white/85 hover:text-white transition-colors duration-200 group"
        >
          <p className="text-[0.8rem] font-medium">Track Order</p>
          {/* HEIGHT FIX: w-7 h-7 -> w-6 h-6 */}
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white/[0.07] group-hover:bg-white/[0.12] transition-colors shrink-0">
            <Package size={13} strokeWidth={2} />
          </span>
        </Link>
      </div>

      {/* RIGHT — profile / login. min-w fixed rakha hai taaki loading -> loaded
          switch pe width change na ho aur LEFT wala Track Order shift na kare (CLS fix) */}
      <div className="flex items-center justify-end min-w-[140px]">
        {isLoading ? (
          <div className="flex items-center gap-2 text-white/60">
            <div className="w-6 h-6 rounded-full bg-white/10 animate-pulse shrink-0" />
            <div className="flex flex-col gap-1">
              <div className="w-14 h-2 rounded bg-white/10 animate-pulse" />
              <div className="w-20 h-2.5 rounded bg-white/10 animate-pulse" />
            </div>
          </div>
        ) : isLoggedIn ? (
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen((prev) => !prev)}
              className="flex items-center gap-2.5 rounded-full pl-1 pr-3 py-0.5 bg-white/[0.07] active:bg-white/10 transition-colors duration-200"
            >
              {/* HEIGHT FIX: w-7 h-7 -> w-6 h-6 */}
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-[#8c1a3c] to-[#5e0f28] text-white shrink-0 ring-1 ring-white/10">
                <WavingEmoji isLoggedIn={isLoggedIn} size={12} />
              </div>
              <div className="flex flex-col items-start leading-none gap-1">
                <span className="flex items-center gap-1 text-[0.6rem] text-white/45 font-medium leading-none tracking-wide uppercase">
                  <GreetingIcon
                    size={10}
                    strokeWidth={2.5}
                    className={greetingColor}
                  />
                  {greetingText}
                </span>
                <span className="text-[0.82rem] text-white leading-none tracking-tight">
                  {user?.firstname}
                </span>
              </div>
              <ChevronDown
                size={14}
                strokeWidth={2.25}
                className={`text-white/50 transition-transform duration-300 ease-out shrink-0 ${
                  isProfileOpen ? "rotate-180 text-white/80" : ""
                }`}
              />
            </button>

            {isProfileOpen && (
              <>
                {/* backdrop taaki outside click pe close ho jaye */}
                <div
                  className="fixed inset-0 z-50"
                  onClick={() => setIsProfileOpen(false)}
                />
                <div className="absolute top-full right-0 mt-3 w-42 bg-white z-[60] rounded-xl overflow-hidden shadow-2xl shadow-black/30 origin-top-right animate-in fade-in slide-in-from-top-1 duration-150 shadow-[0px_4px_52px_18px_rgba(0,_0,_0,_0.1)] border-2 border-black/15">
                  <Link
                    href="/account"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-3 text-sm text-gray-700 hover:bg-[#8c1a3c]/5 hover:text-[#8c1a3c] transition-colors"
                  >
                    <User size={15} strokeWidth={2} />
                    <span className="font-medium">My Account</span>
                  </Link>
                  <div className="h-px bg-gray-100 mx-2" />
                  <button
                    onClick={handleLogout}
                    disabled={logoutMutation.isPending}
                    className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                  >
                    <LogOut size={15} strokeWidth={2} />
                    <span className="font-medium">
                      {logoutMutation.isPending ? "Logging out..." : "Logout"}
                    </span>
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <Link
            href="/account/login"
            className="flex items-center gap-1.5 text-white/85 hover:text-white transition-colors duration-200 group"
          >
            {/* HEIGHT FIX: w-7 h-7 -> w-6 h-6 */}
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white/[0.07] group-hover:bg-white/[0.12] transition-colors shrink-0">
              <User size={13} strokeWidth={2} />
            </span>
            <p className="text-[0.8rem] font-medium">Login</p>
          </Link>
        )}
      </div>
    </div>
  );
};

export default PhoneHeader;