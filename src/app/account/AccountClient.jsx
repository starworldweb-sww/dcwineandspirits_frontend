//@ts-nocheck
"use client";

import React from "react";
import Link from "next/link";
import {
  ChevronRight,
  Pencil,
  Lock,
  IdCard,
  HeartOff,
  ClipboardList,
  CloudDownload,
  PiggyBank,
  Undo2,
  RefreshCcw,
  History,
} from "lucide-react";
import ProductsHeader from "../components/TittleAndBreadcrumb";

// --- BRAND ACCENT ---
const ACCENT = "#8c1a3c";

// --- SECTION DIVIDER ---
const SectionDivider = () => (
  <div className="relative w-full h-[1px] mt-2 mb-6 bg-transparent">
    <div
      className="absolute left-0 top-[-1px] h-[2px] w-16"
      style={{ backgroundColor: ACCENT }}
    />
  </div>
);

// --- STATIC DATA ---
const accountCards = [
  { href: "/account/edit", icon: Pencil, label: "Edit your account information" },
  { href: "/account/password", icon: Lock, label: "Change your password" },
  { href: "/account/address", icon: IdCard, label: "Modify your address book entries" },
  { href: "/account/wishlist", icon: HeartOff, label: "Modify your wish list" },
];

const orderCards = [
  { href: "/account/order", icon: ClipboardList, label: "View your order history" },
  { href: "/account/downloads", icon: CloudDownload, label: "Downloads" },
  { href: "/account/rewards", icon: PiggyBank, label: "Your Reward Points" },
  { href: "/account/return-product", icon: Undo2, label: "View your return requests" },
  { href: "/account/transactions", icon: RefreshCcw, label: "Your Transactions" },
  { href: "/account/recurring-payments", icon: History, label: "Recurring payments" },
];

const sidebarLinks = [
  { href: "/account", label: "My Account" },
  { href: "/account/address", label: "Address Book" },
  { href: "/account/wishlist", label: "Wishlist" },
  { href: "/account/order", label: "Order History" },
  { href: "/account/transactions", label: "Transactions" },
];

// --- REUSABLE CARD ---
const AccountCard = ({ href, icon: Icon, label }) => (
  <Link href={href} className="block h-full">
    <div className="group relative h-full overflow-hidden bg-white border border-[#e5e5e5] rounded-[6px] p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 hover:-translate-y-[3px] hover:border-[#e5e5e5] hover:shadow-[0_16px_40px_-12px_rgba(140,26,60,0.18)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8c1a3c]/40">
      {/* top accent line, grows in on hover */}
      <span
        className="absolute top-0 left-1/2 h-[2px] w-0 -translate-x-1/2 transition-all duration-300 ease-out group-hover:w-full"
        style={{ backgroundColor: ACCENT }}
      />

      <div
        className="mb-4 w-14 h-14 rounded-full flex items-center justify-center ring-1 ring-inset transition-all duration-300 group-hover:scale-105"
        style={{
          backgroundColor: `${ACCENT}12`,
          boxShadow: `inset 0 0 0 1px ${ACCENT}26`,
        }}
      >
        <Icon
          size={22}
          strokeWidth={1.75}
          style={{ color: ACCENT }}
          className="transition-transform duration-300"
        />
      </div>

      <p className="text-[13.5px] font-hind-madurai font-medium text-[#333333] leading-snug tracking-[0.1px] group-hover:text-[#1f1f1f]">
        {label}
      </p>
    </div>
  </Link>
);

const AccountClient = () => {
  return (
    <div className="font-['cambriaregular'] text-[#333333] w-full">
      <ProductsHeader categoryName="My Account"/>
      <div className="flex flex-col lg:flex-row lg:items-start lg:gap-6 2xl:gap-8 w-full px-3 lg:px-3 2xl:px-32 mt-6">
        {/* Left Column */}
        <div className="flex-1 min-w-0 w-full">
          {/* MY ACCOUNT */}
          <h2 className="text-[26px] tracking-[0.2px] font-hind-madurai">My Account</h2>
          <SectionDivider />

          <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-4 auto-rows-fr">
            {accountCards.map((card) => (
              <AccountCard key={card.label} {...card} />
            ))}
          </div>

          {/* MY ORDERS */}
          <h2 className="text-[26px] tracking-[0.2px] mt-10 font-hind-madurai">My Orders</h2>
          <SectionDivider />

          <div className="grid grid-cols-2 sm:grid-cols-3 2xl:grid-cols-5 gap-4 auto-rows-fr">
            {orderCards.map((card) => (
              <AccountCard key={card.label} {...card} />
            ))}
          </div>
        </div>

        {/* Right Column: Sidebar */}
        <div className="hidden lg:block lg:h-auto lg:w-[1px] lg:bg-[#e3e3e3] self-stretch" />
        <div className="w-full lg:w-[260px] shrink-0">
          <div className="bg-white border border-[#e5e5e5] rounded-[6px] p-5 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
            <ul className="divide-y divide-[#eeeeee]">
              {sidebarLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-1.5 py-3 text-[15px] text-[#333333] transition-colors duration-300 focus-visible:outline-none focus-visible:text-[#8c1a3c]"
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

export default AccountClient;