"use client";
import { Menu, X, Plus, Minus } from "lucide-react";
import React, { useState } from "react";
import { useMobileCategory } from "@/app/api/hooks/useMobileCategory"; // apna actual path daal dena
import Link from "next/link";

// Builds a link for a menu item — custom type uses custom_url, otherwise seo_url
const getItemHref = (item) => {
  if (item.type === "custom") return item.custom_url || "#";
  if (item.seo_url) return `/${item.seo_url}`;
  return item.custom_url || "#";
};

// Recursive accordion row — handles unlimited nesting depth from the API
const MenuNode = ({ item, path, depth, openItems, toggleItem, closeMenu }) => {
  const hasChildren = item.children && item.children.length > 0;
  const isOpen = openItems.has(path);

  return (
    <div className={depth === 0 ? "border-b border-gray-100" : ""}>
      <div className="w-full flex items-center justify-between px-5 py-3">
        <Link
          href={getItemHref(item)}
          onClick={!hasChildren ? closeMenu : undefined}
          style={{ paddingLeft: depth > 0 ? depth * 12 : 0 }}
          className={`flex-1 text-[#2c3e50] ${
            depth === 0 ? "font-bold text-[15px]" : "font-font text-[14px] text-gray-600"
          }`}
        >
          {item.title}
        </Link>

        {hasChildren && (
          <button
            onClick={() => toggleItem(path)}
            aria-label={isOpen ? "Collapse" : "Expand"}
            className="shrink-0 border rounded-full border-[#2c3e50] py-[1px] px-[1px]"
          >
            {isOpen ? (
              <Minus size={14} className="text-[#2c3e50]" strokeWidth={2} />
            ) : (
              <Plus size={14} className="text-[#2c3e50]" strokeWidth={2} />
            )}
          </button>
        )}
      </div>

      {hasChildren && (
        <div
          className={`overflow-hidden transition-all duration-300 ${
            isOpen ? "max-h-[3000px]" : "max-h-0"
          }`}
        >
          <div className="pb-1">
            {item.children.map((child, index) => (
              <MenuNode
                key={`${path}-${index}`}
                item={child}
                path={`${path}-${index}`}
                depth={depth + 1}
                openItems={openItems}
                toggleItem={toggleItem}
                closeMenu={closeMenu}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const PhoneLeftMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Set-based state - isse multiple accordion items ek saath khule reh sakte hain
  const [openItems, setOpenItems] = useState(new Set());

  const { data, isLoading } = useMobileCategory();
  const menuItems = data?.data?.menu || [];
  const heading = data?.data?.heading || "MENU";

  const toggleItem = (path) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <div>
      {/* MENU OPENER BUTTON */}
      <button
        onClick={() => setIsMenuOpen((prev) => !prev)}
        className="w-full h-full flex items-center justify-center text-[#98022e] hover:opacity-80 transition-opacity"
        aria-label="Toggle menu"
      >
        {isMenuOpen ? (
          <X size={22} strokeWidth={1.5} />
        ) : (
          <Menu size={22} strokeWidth={1.5} />
        )}
      </button>

      {/* BACKDROP - click karne pe menu close ho jayega */}
      <div
        onClick={closeMenu}
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />

      {/* DRAWER PANEL - left se slide hota hai */}
      <div
        className={`fixed top-0 left-0 h-full w-[85%] max-w-[360px] bg-white z-50 flex flex-col transition-transform duration-300 ease-in-out ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* HEADER BAR */}
        <div className="flex items-center justify-between bg-[#98022e] px-4 py-2 shrink-0">
          <span className=" font-bold text-sm tracking-wide uppercase text-white">
            MENU
          </span>
          <button onClick={closeMenu} aria-label="Close menu">
            <X size={22} className="text-white" strokeWidth={2} />
          </button>
        </div>

        {/* MENU ITEMS LIST - scrollable agar content lamba ho */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <p className="px-5 py-6 text-[14px] text-gray-500">Loading menu...</p>
          ) : (
            menuItems.map((item, index) => (
              <MenuNode
                key={index}
                item={item}
                path={`${index}`}
                depth={0}
                openItems={openItems}
                toggleItem={toggleItem}
                closeMenu={closeMenu}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PhoneLeftMenu;