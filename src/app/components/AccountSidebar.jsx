"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

// --- BRAND ACCENT ---
const ACCENT = "#8c1a3c";

const sidebarLinks = [
  { href: "/account", label: "My Account" },
  { href: "/account/address", label: "Address Book" },
  { href: "/account/wishlist", label: "Wishlist" },
  { href: "/account/order", label: "Order History" },
 
];

const AccountSidebar = () => {
  return (
    <div className="w-full lg:w-[260px] shrink-0 mt-10 lg:mt-0">
      <div className="bg-[#eeeeee] rounded-[4px] p-5">
        <ul>
          {sidebarLinks.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className="group flex items-center gap-1.5 py-2.5 text-[15px] font-sarabun text-[#333333] transition-colors duration-300"
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
  );
};

export default AccountSidebar;