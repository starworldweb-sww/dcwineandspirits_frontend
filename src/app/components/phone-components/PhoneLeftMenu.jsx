"use client";
import { Menu, X, ChevronDown, Search, LogIn, UserPlus, Phone, Download, User, LogOut } from "lucide-react";
import React, { useState, useEffect, useMemo } from "react";
import { useMobileCategory } from "@/app/api/hooks/useMobileCategory"; // apna actual path daal dena
import { useUser, useLogout } from "@/app/api/hooks/useAuth"; // PhoneHeader wala hi auth hook — login state yahin se milega
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
// HELPER: Search query ke hisaab se menu tree ko filter karta hai
// - Agar item ka apna title match kare, toh uske saare children
//   bhi (unfiltered) dikhaye jaate hain
// - Agar sirf koi descendant match kare, toh sirf wahi matching
//   descendants dikhte hain (pruned tree)
// ============================================================
const filterMenuTree = (items, query) => {
  if (!query) return items;
  const q = query.toLowerCase();

  return items.reduce((acc, item) => {
    const titleMatches = decodeHtml(item.title).toLowerCase().includes(q);
    const childMatches = item.children ? filterMenuTree(item.children, query) : [];

    if (titleMatches) {
      acc.push({ ...item, children: item.children || [] });
    } else if (childMatches.length > 0) {
      acc.push({ ...item, children: childMatches });
    }
    return acc;
  }, []);
};

// ============================================================
// COMPONENT: MenuNode
// Recursive <li> row — kitni bhi nesting depth API se aaye,
// yeh khud ko baar baar call karke handle kar leta hai.
//
// Accordion animation ab CSS grid-template-rows trick use karti
// hai (0fr <-> 1fr) — max-height hack se zyada smooth aur
// content ki actual height ke hisaab se accurate hoti hai, kitni
// bhi lambi list ho.
//
// SEO/Accessibility notes:
// - <ul>/<li> ka use karke browser aur crawlers ko clear
//   hierarchy milti hai (plain <div> stack se better hai)
// - aria-expanded batata hai screen readers ko ki submenu
//   khula hai ya band
// ============================================================
const MenuNode = ({ item, path, depth, openItems, toggleItem, closeMenu, isSearching }) => {
  const hasChildren = item.children && item.children.length > 0;
  // Search active hone par sab matching branches force-open rehte hain
  const isOpen = isSearching ? hasChildren : openItems.has(path);
  const submenuId = `submenu-${path}`;

  return (
    <li className={depth === 0 ? "border-b border-gray-100" : ""}>
      {/* ---------- ROW: link + expand/collapse button ---------- */}
      <div className={`w-full flex items-center justify-between px-5 ${depth === 0 ? "py-3" : "py-1"} `}>
        <Link
          href={getItemHref(item)}
          onClick={!hasChildren ? closeMenu : undefined}
          style={{ paddingLeft: depth > 0 ? depth * 12 : 0 }}
          className={`flex-1 text-[#2c3e50] transition-colors duration-200 hover:text-[#98022e] ${
            depth === 0
              ? "font-bold text-[15px]"
              : "font-font text-[14px] text-gray-600"
          } {}`}
        >
          {decodeHtml(item.title)}
        </Link>

        {/* Search ke dauraan sab kuch already open hai, isliye toggle button
            chhupa dete hain taaki confusing na lage */}
        {hasChildren && !isSearching && (
          <button
            type="button"
            onClick={() => toggleItem(path)}
            aria-expanded={isOpen}
            aria-controls={submenuId}
            aria-label={isOpen ? `Collapse ${item.title} menu` : `Expand ${item.title} menu`}
            className="shrink-0 p-1.5 -mr-1.5 rounded-full active:bg-gray-100 transition-colors duration-200"
          >
            <ChevronDown
              size={16}
              strokeWidth={2}
              className={`text-[#2c3e50] transition-transform duration-300 ease-in-out ${
                isOpen ? "rotate-180" : "rotate-0"
              }`}
            />
          </button>
        )}
      </div>

      {/* ---------- SUBMENU: grid-rows trick se smooth expand/collapse ---------- */}
      {hasChildren && (
        <div
          className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
            isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          }`}
        >
          <div id={submenuId} className="overflow-hidden">
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
                  isSearching={isSearching}
                />
              ))}
            </ul>
          </div>
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

  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading } = useMobileCategory();
  const menuItems = data?.data?.menu || [];
  const heading = data?.data?.heading || "MENU";

  // Auth state — PhoneHeader jaisa hi pattern: user object aur logout mutation
  const { data: user, isLoading: isUserLoading } = useUser();
  const logoutMutation = useLogout();
  const isLoggedIn = !!user;

  const isSearching = searchQuery.trim().length > 0;

  const filteredMenuItems = useMemo(
    () => filterMenuTree(menuItems, searchQuery.trim()),
    [menuItems, searchQuery],
  );

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

  // Logout par: menu bhi band ho jaye aur mutation trigger ho jaye
  const handleLogout = () => {
    closeMenu();
    logoutMutation.mutate();
  };

  // Menu band hone par search reset ho jaye, taaki agli baar khulne pe
  // poora tree fresh dikhe
  useEffect(() => {
    if (!isMenuOpen) {
      setSearchQuery("");
    }
  }, [isMenuOpen]);

  // Menu khule hone par background scroll lock — smoother, distraction-free feel
  useEffect(() => {
    if (isMenuOpen) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [isMenuOpen]);

  // Escape key se bhi menu close ho jaye
  useEffect(() => {
    if (!isMenuOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") closeMenu();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isMenuOpen]);

  return (
    <div>
      {/* ---------- HAMBURGER BUTTON: menu open/close trigger ---------- */}
      <button
        type="button"
        onClick={() => setIsMenuOpen((prev) => !prev)}
        aria-expanded={isMenuOpen}
        aria-controls="phone-left-menu-drawer"
        className="w-full h-full flex items-center justify-center text-[#98022e] hover:opacity-80 active:scale-90 transition-all duration-200"
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
        className={`fixed inset-0 bg-black/50 backdrop-blur-[2px] z-40 transition-opacity duration-300 ease-in-out ${
          isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />

      {/* ---------- DRAWER PANEL: left se slide hoke aata hai ---------- */}
      <div
        id="phone-left-menu-drawer"
        className={`fixed top-0 left-0 h-full w-[85%] max-w-[360px] bg-white z-50 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* ---- Header bar ---- */}
        <div className="flex items-center justify-between bg-[#98022e] px-4 py-3 shrink-0">
          <span className="font-bold text-sm tracking-wide uppercase text-white">
            MENU
          </span>
          <button
            type="button"
            onClick={closeMenu}
            aria-label="Close menu"
            className="active:scale-90 transition-transform duration-200"
          >
            <X size={22} className="text-white" strokeWidth={2} />
          </button>
        </div>

        {/* ---- Quick search: category names ko client-side filter karta hai ---- */}
        <div className="px-4 py-3 border-b border-gray-100 shrink-0">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search categories..."
              aria-label="Search categories"
              className="w-full bg-gray-50 border border-gray-200 rounded-full pl-9 pr-3 py-2 text-[14px] text-[#2c3e50] outline-none transition-all duration-200 focus:border-[#98022e] focus:ring-4 focus:ring-[#98022e]/10 focus:bg-white"
            />
          </div>
        </div>

        {/* ---- Menu list: semantic <nav> + <ul> for SEO/accessibility ---- */}
        <nav className="flex-1 overflow-y-auto" aria-label="Mobile navigation">
          {isLoading ? (
            <p className="px-5 py-6 text-[14px] text-gray-500">Loading menu...</p>
          ) : filteredMenuItems.length === 0 ? (
            <p className="px-5 py-6 text-[14px] text-gray-500">
              No categories found for &quot;{searchQuery}&quot;.
            </p>
          ) : (
            <ul key={searchQuery}>
              {filteredMenuItems.map((item, index) => (
                <MenuNode
                  key={index}
                  item={item}
                  path={`${index}`}
                  depth={0}
                  openItems={openItems}
                  toggleItem={toggleItem}
                  closeMenu={closeMenu}
                  isSearching={isSearching}
                />
              ))}
            </ul>
          )}
        </nav>

        {/* ---- Bottom action bar: Login/Register (logged out) ya
            Account/Logout (logged in), phone, bulk order ---- */}
        <div className="shrink-0 border-t border-gray-200 bg-white px-4 py-3 space-y-2.5">
          <div className="flex items-center gap-2">
            {isLoggedIn ? (
              // ---- LOGGED IN: "My Account" (naam ke saath) + "Logout" ----
              <>
                <Link
                  href="/account"
                  onClick={closeMenu}
                  className="flex-1 flex items-center justify-center gap-1.5 border border-[#98022e] text-[#98022e] text-[13px] font-semibold uppercase tracking-wide py-2 rounded-sm transition-all duration-200 hover:bg-[#98022e] hover:text-white active:scale-[0.97]"
                >
                  <User size={14} />
                  {/* firstname aane tak generic "My Account" dikhta rahega */}
                  {user?.firstname ? `Hi, ${user.firstname}` : "My Account"}
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={logoutMutation.isPending}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-[#98022e] text-white text-[13px] font-semibold uppercase tracking-wide py-2 rounded-sm transition-all duration-200 hover:bg-[#7a0225] active:scale-[0.97] disabled:opacity-50"
                >
                  <LogOut size={14} />
                  {logoutMutation.isPending ? "Logging out..." : "Logout"}
                </button>
              </>
            ) : (
              // ---- LOGGED OUT: "Login" + "Register" (original behaviour) ----
              <>
                <Link
                  href="/account/login/"
                  onClick={closeMenu}
                  className="flex-1 flex items-center justify-center gap-1.5 border border-[#98022e] text-[#98022e] text-[13px] font-semibold uppercase tracking-wide py-2 rounded-sm transition-all duration-200 hover:bg-[#98022e] hover:text-white active:scale-[0.97]"
                >
                  <LogIn size={14} />
                  Login
                </Link>
                <Link
                  href="/register/"
                  onClick={closeMenu}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-[#98022e] text-white text-[13px] font-semibold uppercase tracking-wide py-2 rounded-sm transition-all duration-200 hover:bg-[#7a0225] active:scale-[0.97]"
                >
                  <UserPlus size={14} />
                  Register
                </Link>
              </>
            )}
          </div>

          <a
            href="tel:+12024598489"
            className="flex items-center gap-2 text-[13px] text-gray-700 transition-colors duration-200 hover:text-[#98022e]"
          >
            <Phone size={14} className="text-[#98022e] shrink-0" />
            (202) 459-8489
          </a>

          <a
            href="/bulk-order-form.xlsx"
            download="bulk-order-form.xlsx"
            className="flex items-center gap-2 text-[13px] text-gray-700 transition-colors duration-200 hover:text-[#98022e]"
          >
            <Download size={14} className="text-[#98022e] shrink-0" />
            Download Bulk Order Form
          </a>
        </div>
      </div>
    </div>
  );
};

export default PhoneLeftMenu;