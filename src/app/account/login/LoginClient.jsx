//@ts-nocheck
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import ProductsHeader from "@/app/components/TittleAndBreadcrumb";


// --- BRAND ACCENT ---
const ACCENT = "#8c1a3c";

const sidebarLinks = [
  { href: "/account", label: "My Account" },
  { href: "/account/address", label: "Address Book" },
  { href: "/account/wishlist", label: "Wishlist" },
  { href: "/account/order", label: "Order History" },
  { href: "/account/transactions", label: "Transactions" },
];

const breadcrumbs = [
  { label: "Home", href: "/" },
  { label: "Account", href: "/account" },
  { label: "Login", href: "/account/login" },
];

// --- SHARED INPUT STYLE ---
const inputClass =
  "w-full bg-white border border-[#d9d9d9] rounded-[3px] px-3 py-2.5 text-[14px] text-[#333333] placeholder:text-[#9a9a9a] outline-none transition-colors duration-200 focus:border-[#8c1a3c] focus:ring-1 focus:ring-[#8c1a3c]/30";

const LoginClient = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    // static UI only — no API wiring
  };

  return (
    <div className="font-['cambriaregular'] text-[#333333] w-full">
      <ProductsHeader categoryName="Account Login" breadcrumbs={breadcrumbs} />

      <div className="flex flex-col lg:flex-row lg:items-start lg:gap-6 2xl:gap-8 w-full px-3 lg:px-3 2xl:px-32 mt-10 mb-14">
        {/* New Customer */}
        <div className="flex-1 min-w-0 w-full bg-[#eeeeee] rounded-[4px] p-6 md:p-8">
          <h2 className="text-[20px] font-hind-madurai font-semibold text-[#333333] pb-3 mb-4 border-b border-[#333333] inline-block">
            New Customer
          </h2>
          <p className="text-[14px] leading-[1.7] font-hind-madurai text-[#444444] mb-8">
            By creating an account you will be able to shop faster, be up to
            date on an order&apos;s status, and keep track of the orders you
            have previously made.
          </p>
          <Link href="/account/register">
            <button className="w-full bg-black text-white text-[13px] font-hind-madurai font-semibold tracking-[1.5px] uppercase py-3.5 transition-colors duration-300 hover:bg-[#1a1a1a] cursor-pointer">
              Continue
            </button>
          </Link>
        </div>

        {/* Returning Customer */}
        <div className="flex-1 min-w-0 w-full bg-[#eeeeee] rounded-[4px] p-6 md:p-8">
          <h2 className="text-[20px] font-hind-madurai font-semibold text-[#333333] pb-3 mb-5 border-b border-[#333333] inline-block">
            Returning Customer
          </h2>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] sm:items-center gap-1.5 sm:gap-4">
              <label className="text-[14px] font-hind-madurai text-[#333333]">
                E-Mail Address
              </label>
              <input
                type="email"
                placeholder="E-Mail Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] sm:items-center gap-1.5 sm:gap-4">
              <label className="text-[14px] font-hind-madurai text-[#333333]">
                Password
              </label>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
              />
            </div>

            <Link
              href="/account/forgotten-password"
              className="text-[13.5px] font-hind-madurai transition-opacity duration-200 hover:opacity-80 -mt-1 cursor-pointer"
              style={{ color: ACCENT }}
            >
              Forgotten Password
            </Link>

            <button
              type="submit"
              className="w-full bg-black text-white text-[13px] font-hind-madurai font-semibold tracking-[1.5px] uppercase py-3.5 mt-3 transition-colors duration-300 hover:bg-[#1a1a1a] cursor-pointer"
            >
              Login
            </button>
          </form>
        </div>

        {/* Right Column: Sidebar */}
        <div className="w-full lg:w-[260px] shrink-0">
          <div className="bg-[#eeeeee] rounded-[4px] p-5">
            <ul>
              {sidebarLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-1.5 py-2.5 text-[15px] font-hind-madurai text-[#333333] transition-colors duration-300"
                  >
                    <ChevronRight
                      size={16}
                      className="shrink-0 transition-transform duration-300 group-hover:translate-x-0.5"
                      style={{ color: ACCENT }}
                    />
                    <span className="transition-colors duration-300 group-hover:text-[#8c1a3c]">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginClient;