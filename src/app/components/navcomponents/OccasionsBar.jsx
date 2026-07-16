"use client";

import React from "react";
import Link from "next/link";
import { Gem, GraduationCap, Gift, Cake, Martini, Home } from "lucide-react";

// Each occasion link: label, href, icon, and whether it's the active/highlighted one.
// Swap `active` based on the current route if you want this to be dynamic.
const OCCASIONS = [
  { label: "Wedding Gifts", href: "/wedding-gifts", icon: Gem, active: true },
  { label: "Graduation Gifts", href: "/graduation-gifts", icon: GraduationCap },
  { label: "Congratulations Gifts", href: "/congratulations-gifts", icon: Gift },
  { label: "Birthday Gifts", href: "/birthday-gifts", icon: Cake },
  { label: "Anniversary Gifts", href: "/anniversary-gifts", icon: Martini },
  { label: "Housewarming Gifts", href: "/housewarming-gifts", icon: Home },
];

const OccasionBar = () => {
  return (
    <div className="w-full bg-[#f2f2f2] border-y border-gray-200 px-3 2xl:px-32 hidden md:block">
      <div className="flex items-center justify-center flex-wrap gap-x-3 gap-y-2 py-2 2xl:py-3">
        {OCCASIONS.map(({ label, href, icon: Icon, active }, index) => (
          <React.Fragment key={label}>
            <Link
              href={href}
              className={`flex items-center gap-2 text-[14px] font-serif tracking-wide uppercase whitespace-nowrap transition-colors ${
                active ? "text-[#98022e]" : "text-[#2b2b2b] hover:text-[#98022e]"
              }`}
            >
              <Icon size={16} strokeWidth={1.5} className={active ? "text-[#98022e]" : "text-[#98022e]"} />
              {label}
            </Link>

            {/* Divider between items, skipped after the last one */}
            {index < OCCASIONS.length - 1 && (
              <span className="hidden sm:block h-4 w-px bg-gray-300" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default OccasionBar;