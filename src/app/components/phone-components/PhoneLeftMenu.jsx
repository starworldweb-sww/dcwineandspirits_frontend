"use client";
import { Menu, X, Plus, Minus } from 'lucide-react';
import React, { useState } from 'react';

// MOCK DATA - baad me API se replace karna
const MENU_ITEMS = [
  {
    id: "gift-baskets",
    label: "Gift Baskets",
    isNew: true,
    expandable: true,
    subItems: ["Wine Gift Baskets", "Champagne Gift Baskets", "Whiskey Gift Baskets", "Corporate Gift Baskets"],
  },
  {
    id: "gifts-by-occasion",
    label: "Gifts By Occasion",
    expandable: true,
    subItems: ["Birthday", "Anniversary", "Congratulations", "Thank You", "Housewarming"],
  },
  {
    id: "gifts-by-recipient",
    label: "Gifts By Recipient",
    expandable: true,
    subItems: ["For Him", "For Her", "For Boss", "For Client"],
  },
  {
    id: "gifts-by-price",
    label: "Gifts By Price",
    expandable: true,
    subItems: ["Under $50", "$50 - $100", "$100 - $200", "$200+"],
  },
  {
    id: "gifts-by-origin",
    label: "Gifts By Origin",
    expandable: true,
    subItems: ["France", "Italy", "USA", "Spain"],
  },
  {
    id: "personalized-gifts",
    label: "Personalized Gifts",
    expandable: false, // NOTE: screenshot me isme "+" nahi tha - ye direct link hai
  },
  {
    id: "premium-selection",
    label: "Premium Selection",
    expandable: true,
    subItems: ["Rare Finds", "Limited Edition", "Collector's Choice"],
  },
  {
    id: "top-locations",
    label: "Top Locations We Serve",
    expandable: true,
    subItems: ["Washington DC", "Virginia", "Maryland"],
  },
];

const PhoneLeftMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Set-based state - isse multiple accordion items ek saath khule reh sakte hain
  const [openItems, setOpenItems] = useState(new Set());

  const toggleItem = (id) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <div>
      {/* MENU OPENER BUTTON
          NOTE: icon size 28 -> 22 kiya (Cart icon 22px se match karne ke liye)
          aur flex items-center justify-center add kiya taaki parent ke
          fixed w-[36px] h-[40px] box ke andar ye exactly center rahe */}
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
        <div className="flex items-center justify-between bg-[#98022e] px-4 py-4 shrink-0">
          <span className="text-white font-bold text-sm tracking-wide">MENU</span>
          <button onClick={closeMenu} aria-label="Close menu">
            <X size={22} className="text-white" strokeWidth={2} />
          </button>
        </div>

        {/* MENU ITEMS LIST - scrollable agar content lamba ho */}
        <div className="flex-1 overflow-y-auto">
          {MENU_ITEMS.map((item) => {
            const isOpen = openItems.has(item.id);
            return (
              <div key={item.id} className="border-b border-gray-100">
                <button
                  onClick={() => item.expandable && toggleItem(item.id)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left"
                >
                  <span className="flex items-center gap-2 text-[#2c3e50] font-semibold text-[15px]">
                    {item.label}
                    {item.isNew && (
                      <span className="bg-[#98022e] text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                        NEW
                      </span>
                    )}
                  </span>

                  {item.expandable && (
                    isOpen ? (
                      <Minus size={18} className="text-[#2c3e50] shrink-0" strokeWidth={2} />
                    ) : (
                      <Plus size={18} className="text-[#2c3e50] shrink-0" strokeWidth={2} />
                    )
                  )}
                </button>

                {/* SUB-ITEMS - accordion content */}
                {item.expandable && (
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      isOpen ? "max-h-96" : "max-h-0"
                    }`}
                  >
                    <div className="pb-2">
                      {item.subItems.map((sub, index) => (
                        <a
                          key={index}
                          href="#"
                          className="block px-8 py-2 text-[14px] text-gray-600 hover:text-[#98022e] transition-colors"
                        >
                          {sub}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PhoneLeftMenu;