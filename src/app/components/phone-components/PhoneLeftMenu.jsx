"use client";
import { Menu, X, Plus, Minus } from "lucide-react";
import React, { useState } from "react";
import { useMobileCategory } from "@/app/api/hooks/useMobileCategory"; // apna actual path daal dena
import Link from "next/link";
import { decodeHtml } from "@/libs/decodeHtml";

// ============================================================
// HELPER: Menu item ka link banata hai
// - "custom" type wale items ke liye custom_url use hota hai
// - baaki sabke liye seo_url (SEO friendly slug) use hota hai
// ============================================================
const getItemHref = (item) => {
  if (item.type === "custom") return item.custom_url || "#";
  if (item.seo_url) return `/${item.seo_url}`;
  return item.custom_url || "#";
};

// ============================================================
// COMPONENT: MenuNode
// Recursive <li> row — kitni bhi nesting depth API se aaye,
// yeh khud ko baar baar call karke handle kar leta hai.
//
// SEO/Accessibility notes:
// - <ul>/<li> ka use karke browser aur crawlers ko clear
//   hierarchy milti hai (plain <div> stack se better hai)
// - aria-expanded batata hai screen readers ko ki submenu
//   khula hai ya band
// ============================================================
const MenuNode = ({ item, path, depth, openItems, toggleItem, closeMenu }) => {
  const hasChildren = item.children && item.children.length > 0;
  const isOpen = openItems.has(path);
  const submenuId = `submenu-${path}`;

  return (
    <li className={depth === 0 ? "border-b border-gray-100" : ""}>
      {/* ---------- ROW: link + expand/collapse button ---------- */}
      <div className={`w-full flex items-center justify-between px-5 ${depth === 0 ? "py-3" : "py-1"} `}>
        <Link
          href={getItemHref(item)}
          onClick={!hasChildren ? closeMenu : undefined}
          style={{ paddingLeft: depth > 0 ? depth * 12 : 0 }}
          className={`flex-1 text-[#2c3e50] ${
            depth === 0
              ? "font-bold text-[15px]"
              : "font-font text-[14px] text-gray-600"
          } {}`}
        >
          {decodeHtml(item.title)}
        </Link>

        {hasChildren && (
          <button
            type="button"
            onClick={() => toggleItem(path)}
            aria-expanded={isOpen}
            aria-controls={submenuId}
            aria-label={isOpen ? `Collapse ${item.title} menu` : `Expand ${item.title} menu`}
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

      {/* ---------- SUBMENU: nested <ul>, sirf tabhi render hoga jab children ho ---------- */}
      {hasChildren && (
        <div
          id={submenuId}
          className={`overflow-hidden transition-all duration-300 ${
            isOpen ? "max-h-[3000px]" : "max-h-0"
          }`}
        >
          <ul className="pb-1">
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
          </ul>
        </div>
      )}
    </li>
  );
};

// ============================================================
// COMPONENT: PhoneLeftMenu
// Mobile drawer menu — hamburger button + left se slide hone
// wala panel, jisme poora menu tree ul/li ke form mein render
// hota hai.
// ============================================================
const PhoneLeftMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Set-based state — isse multiple accordion items ek saath khule reh sakte hain
  const [openItems, setOpenItems] = useState(new Set());

  const { data, isLoading } = useMobileCategory();
  const menuItems = data?.data?.menu || [];
  const heading = data?.data?.heading || "MENU";

  // Kisi bhi node ka open/close state toggle karta hai
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
      {/* ---------- HAMBURGER BUTTON: menu open/close trigger ---------- */}
      <button
        type="button"
        onClick={() => setIsMenuOpen((prev) => !prev)}
        aria-expanded={isMenuOpen}
        aria-controls="phone-left-menu-drawer"
        className="w-full h-full flex items-center justify-center text-[#98022e] hover:opacity-80 transition-opacity"
        aria-label="Toggle menu"
      >
        {isMenuOpen ? (
          <X size={22} strokeWidth={1.5} />
        ) : (
          <Menu size={22} strokeWidth={1.5} />
        )}
      </button>

      {/* ---------- BACKDROP: click karne se menu close ho jayega ---------- */}
      <div
        onClick={closeMenu}
        aria-hidden="true"
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />

      {/* ---------- DRAWER PANEL: left se slide hoke aata hai ---------- */}
      <div
        id="phone-left-menu-drawer"
        className={`fixed top-0 left-0 h-full w-[85%] max-w-[360px] bg-white z-50 flex flex-col transition-transform duration-300 ease-in-out ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* ---- Header bar ---- */}
        <div className="flex items-center justify-between bg-[#98022e] px-4 py-3 shrink-0">
          <span className="font-bold text-sm tracking-wide uppercase text-white">
            MENU
          </span>
          <button type="button" onClick={closeMenu} aria-label="Close menu">
            <X size={22} className="text-white" strokeWidth={2} />
          </button>
        </div>

        {/* ---- Menu list: semantic <nav> + <ul> for SEO/accessibility ---- */}
        <nav className="flex-1 overflow-y-auto" aria-label="Mobile navigation">
          {isLoading ? (
            <p className="px-5 py-6 text-[14px] text-gray-500">Loading menu...</p>
          ) : (
            <ul>
              {menuItems.map((item, index) => (
                <MenuNode
                  key={index}
                  item={item}
                  path={`${index}`}
                  depth={0}
                  openItems={openItems}
                  toggleItem={toggleItem}
                  closeMenu={closeMenu}
                />
              ))}
            </ul>
          )}
        </nav>
      </div>
    </div>
  );
};

export default PhoneLeftMenu;