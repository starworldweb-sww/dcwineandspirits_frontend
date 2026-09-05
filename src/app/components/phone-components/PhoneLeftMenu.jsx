"use client";
import {
  Menu,
  X,
  ChevronDown,
  Search,
  LogIn,
  UserPlus,
  Phone,
  Download,
  User,
  LogOut,
} from "lucide-react";
import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useDeferredValue,
} from "react";
import { useMobileCategory } from "@/app/api/hooks/useMobileCategory";
import { useUser, useLogout } from "@/app/api/hooks/useAuth";
import Link from "next/link";
import { decodeHtml } from "@/libs/decodeHtml";

// ============================================================
// HELPER: Menu item ka link banata hai
// ============================================================
const getItemHref = (item) => {
  if (item.type === "custom") return item.custom_url || "#";
  if (item.seo_url) return `/${item.seo_url}`;
  return item.custom_url || "#";
};

// ============================================================
// HELPER: Item ka koi real/valid link hai ya nahi
// ============================================================
const hasRealLink = (item) => {
  if (item.type === "custom") return !!item.custom_url;
  return !!(item.seo_url || item.custom_url);
};

// ============================================================
// HELPER: Search query ke hisaab se menu tree ko filter karta hai
// ============================================================
const filterMenuTree = (items, query) => {
  if (!query) return items;
  const q = query.toLowerCase();

  return items.reduce((acc, item) => {
    const titleMatches = decodeHtml(item.title).toLowerCase().includes(q);
    const childMatches = item.children
      ? filterMenuTree(item.children, query)
      : [];

    if (titleMatches) {
      acc.push({ ...item, children: item.children || [] });
    } else if (childMatches.length > 0) {
      acc.push({ ...item, children: childMatches });
    }
    return acc;
  }, []);
};

// ============================================================
// HELPER: Matching text ko highlight karta hai (bold + accent color)
// ============================================================
const highlightMatch = (text, query) => {
  if (!query) return decodeHtml(text);

  const decoded = decodeHtml(text);
  const lowerText = decoded.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const matchIndex = lowerText.indexOf(lowerQuery);

  if (matchIndex === -1) return decoded;

  const before = decoded.slice(0, matchIndex);
  const match = decoded.slice(matchIndex, matchIndex + query.length);
  const after = decoded.slice(matchIndex + query.length);

  return (
    <>
      {before}
      <mark className="bg-[#98022e]/15 text-[#98022e] font-semibold rounded-sm">
        {match}
      </mark>
      {after}
    </>
  );
};

// ============================================================
// COMPONENT: MenuNode
// ============================================================
const MenuNode = ({
  item,
  path,
  depth,
  openItems,
  toggleItem,
  closeMenu,
  isSearching,
  searchQuery,
}) => {
  const hasChildren = item.children && item.children.length > 0;
  const isOpen = isSearching ? hasChildren : openItems.has(path);
  const submenuId = `submenu-${path}`;
  const hasLink = hasRealLink(item);

  const isToggleRow = hasChildren && !isSearching;
  const handleRowClick = () => {
    if (isToggleRow) toggleItem(path);
  };

  const handleLinkClick = (e) => {
    e.stopPropagation();
    closeMenu();
  };

  const labelClassName = `${!hasLink || !isToggleRow ? "flex-1" : ""} text-[#2c3e50] transition-colors duration-200 ${
    hasLink ? "hover:text-[#98022e]" : ""
  } ${depth === 0 ? "font-bold text-[15px]" : "font-font text-[14px] text-gray-600"}`;

  const label = isSearching
    ? highlightMatch(item.title, searchQuery)
    : decodeHtml(item.title);

  return (
    <li className={depth === 0 ? "border-b border-gray-100" : ""}>
      <div
        onClick={handleRowClick}
        className={`w-full flex items-center justify-between px-5 ${depth === 0 ? "py-3" : "py-1"} ${
          isToggleRow ? "cursor-pointer" : ""
        }`}
      >
        {hasLink ? (
          <Link
            href={getItemHref(item)}
            onClick={handleLinkClick}
            style={{ paddingLeft: depth > 0 ? depth * 12 : 0 }}
            className={labelClassName}
          >
            {label}
          </Link>
        ) : (
          <span
            style={{ paddingLeft: depth > 0 ? depth * 12 : 0 }}
            className={labelClassName}
          >
            {label}
          </span>
        )}

        {hasChildren && !isSearching && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleItem(path);
            }}
            aria-expanded={isOpen}
            aria-controls={submenuId}
            aria-label={
              isOpen
                ? `Collapse ${item.title} menu`
                : `Expand ${item.title} menu`
            }
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
                  searchQuery={searchQuery}
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
// ============================================================
const PhoneLeftMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Set-based state initialized with "0" so the first category is open by default
  const [openItems, setOpenItems] = useState(() => new Set(["0"]));

  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef(null);
  const deferredSearchQuery = useDeferredValue(searchQuery);

  const { data, isLoading } = useMobileCategory();
  const menuItems = data?.data?.menu || [];

  const { data: user } = useUser();
  const logoutMutation = useLogout();
  const isLoggedIn = !!user;

  const isSearching = deferredSearchQuery.trim().length > 0;

  const filteredMenuItems = useMemo(
    () => filterMenuTree(menuItems, deferredSearchQuery.trim()),
    [menuItems, deferredSearchQuery],
  );

  const resultCount = useMemo(() => {
    const countLeaves = (items) =>
      items.reduce((sum, item) => {
        if (item.children && item.children.length > 0) {
          return sum + countLeaves(item.children);
        }
        return sum + 1;
      }, 0);
    return countLeaves(filteredMenuItems);
  }, [filteredMenuItems]);

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

  const handleLogout = () => {
    closeMenu();
    logoutMutation.mutate();
  };

  // Menu khulne par search reset aur pehli category ko dubara open state par set karna
  useEffect(() => {
    if (isMenuOpen) {
      setOpenItems(new Set(["0"]));
      setSearchQuery("");
    }
  }, [isMenuOpen]);

  // Background scroll lock
  useEffect(() => {
    if (isMenuOpen) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [isMenuOpen]);

  // Escape key support
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
      <button
        type="button"
        onClick={() => setIsMenuOpen((prev) => !prev)}
        aria-expanded={isMenuOpen}
        aria-controls="phone-left-menu-drawer"
        className="w-full h-full flex items-center justify-center text-[#98022e] hover:opacity-80 active:scale-90 transition-all duration-200"
        aria-label="Toggle menu"
      >
        {isMenuOpen ? (
          <X size={26} strokeWidth={1.5} />
        ) : (
          <Menu size={26} strokeWidth={1.5} />
        )}
      </button>

      <div
        onClick={closeMenu}
        aria-hidden="true"
        className={`fixed inset-0 bg-black/50 backdrop-blur-[2px] z-40 transition-opacity duration-300 ease-in-out ${
          isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />

      <div
        id="phone-left-menu-drawer"
        className={`fixed top-0 left-0 h-full w-[85%] max-w-[360px] bg-white z-50 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
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

        <div className="px-4 py-3 border-b border-gray-100 shrink-0">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search categories..."
              aria-label="Search categories"
              className="w-full bg-gray-50 border border-gray-200 rounded-full pl-9 pr-9 py-2 text-[14px] text-[#2c3e50] outline-none transition-all duration-200 focus:border-[#98022e] focus:ring-4 focus:ring-[#98022e]/10 focus:bg-white"
            />

            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  searchInputRef.current?.focus();
                }}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#98022e] transition-colors duration-200"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {isSearching && !isLoading && (
            <p className="text-[12px] text-gray-500 mt-1.5 px-1">
              {resultCount} {resultCount === 1 ? "result" : "results"} found
            </p>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto" aria-label="Mobile navigation">
          {isLoading ? (
            <p className="px-5 py-6 text-[14px] text-gray-500">
              Loading menu...
            </p>
          ) : filteredMenuItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-5 py-10 text-center">
              <Search size={28} className="text-gray-300 mb-2" />
              <p className="text-[14px] text-gray-500 mb-3">
                No categories found for &quot;{searchQuery}&quot;.
              </p>
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="text-[13px] font-semibold text-[#98022e] hover:underline"
              >
                Clear search
              </button>
            </div>
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
                  searchQuery={deferredSearchQuery.trim()}
                />
              ))}
            </ul>
          )}
        </nav>

        <div className="shrink-0 border-t border-gray-200 bg-white px-4 py-3 space-y-2.5">
          <div className="flex items-center gap-2">
            {isLoggedIn ? (
              <>
                <Link
                  href="/account"
                  onClick={closeMenu}
                  className="flex-1 flex items-center justify-center gap-1.5 border border-[#98022e] text-[#98022e] text-[13px] font-semibold uppercase tracking-wide py-2 rounded-sm transition-all duration-200 hover:bg-[#98022e] hover:text-white active:scale-[0.97]"
                >
                  <User size={14} />
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
                  href="/register"
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