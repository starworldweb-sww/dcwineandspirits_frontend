"use client";

import { useRouter } from "next/navigation";
import React, { useRef, useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Award, ShoppingCart, Percent, Loader2 } from "lucide-react";
import { useHomePageProducts } from "@/app/api/Hooks/category/useHomePageProducts"; // apna actual path check kar lena
import { decodeHtml } from "@/libs/decodeHtml";

const IMAGE_BASE_URL =
  process.env.NEXT_PUBLIC_PRODUCTION_IMAGE_URL ||
  "https://www.admin.dcwineandspirits.com/image/"; // apne project ke actual base URL se replace karo

// Backend title jaisa "Bestsellers" / "New Arrivals" / "Special Deals" milta hai,
// isse hum icon assign kar rahe hain (tab id ke liye title hi use kar rahe hain)
const TAB_ICONS = {
  "Bestsellers": Award,
  "New Arrivals": ShoppingCart,
  "Special Deals": Percent,
};

// ---------------------------------------------------------------------------
// COMPONENT
// ---------------------------------------------------------------------------
const HomeProductSlider = () => {
  const router = useRouter();
  const scrollRef = useRef(null);

  const { data, isLoading, isError } = useHomePageProducts();

  // API se items (tabs) nikalna: data.sections[0].items[]
  const items = data?.sections?.[0]?.items || [];

  const [activeTab, setActiveTab] = useState(null);

  // Jab data aa jaye, pehla tab default active kar do
  const currentTab = activeTab || items[0]?.title || null;

  const activeItem = useMemo(
    () => items.find((item) => item.title === currentTab),
    [items, currentTab]
  );

  const products = activeItem?.products || [];

  // SCROLL HANDLERS
  const scrollByAmount = (amount) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
    }
  };

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    alert(`Added ${decodeHtml(product.name)} to cart!`);
    // TODO: yahan apna actual add-to-cart mutation call karo
  };

  if (isLoading) {
    return (
      <div className="w-full bg-[#fcfcfc] py-16 flex justify-center">
        <Loader2 className="animate-spin text-[#98022e]" size={28} />
      </div>
    );
  }

  if (isError || items.length === 0) {
    return null; // ya koi fallback UI dikha sakte ho
  }

  return (
    <div className="w-full bg-[#fcfcfc] py-8 md:py-10 font-sans">

      {/* -------------------------------------------------------------------
          TABS
          MOBILE: ab ek proper horizontal slider hai - justify-start + scroll,
          taaki jo tab fit na ho wo swipe se dikhe, cramped centered na lage
      ------------------------------------------------------------------- */}
      <div className="w-full mb-6 md:mb-8">
        <div className="flex justify-start sm:justify-center px-3 md:px-12 lg:px-16 2xl:px-32">
          <div className="flex gap-6 md:gap-14 items-center overflow-x-auto no-scrollbar w-full sm:w-auto sm:min-w-max border-b-1 border-gray-200">
            {items.map((item) => {
              const isActive = currentTab === item.title;
              const Icon = TAB_ICONS[item.title] || Award;
              return (
                <button
                  key={item.title}
                  onClick={() => setActiveTab(item.title)}
                  className={`relative flex items-center gap-2 pb-3 shrink-0 whitespace-nowrap transition-colors duration-200 cursor-pointer rounded-none ${
                    isActive ? "text-[#98022e]" : "text-black hover:text-[#98022e]"
                  }`}
                  style={{
                    fontFamily: "'Sumana', serif",
                    fontSize: "16px",
                    fontWeight: 700,
                  }}
                >
                  <Icon size={18} strokeWidth={2.5} className="md:w-5 md:h-5" />
                  <span className="md:text-[20px] uppercase">{item.title}</span>

                  {isActive && (
                    <div className="absolute -bottom-[1px] left-0 w-full h-[2px] bg-[#98022e]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------------------
          PRODUCTS CAROUSEL
          MOBILE: har card full-width (container padding minus) - isse ek
          time pe sirf ek hi product dikhega, snap-mandatory se swipe karte
          hi agla product clean center/start pe aa jayega
      ------------------------------------------------------------------- */}
      <div className="max-w-screen-2xl mx-auto px-3 md:px-12 lg:px-16 2xl:px-32 relative group">

        {/* LEFT ARROW - mobile pe hidden hi rahega, swipe se hi chalega */}
        <button
          onClick={() => scrollByAmount(-300)}
          className="hidden md:flex absolute left-2 lg:left-4 2xl:left-16 top-1/2 -translate-y-1/2 w-9 h-10 bg-[#343a40] text-white items-center justify-center z-10 cursor-pointer shadow-md rounded-none hover:bg-black transition-colors"
          aria-label="Scroll left"
        >
          <ChevronLeft size={24} />
        </button>

        {/* SCROLL CONTAINER */}
        <div
          ref={scrollRef}
          className="flex flex-nowrap gap-4 md:gap-6 overflow-x-auto pb-6 no-scrollbar snap-x snap-mandatory md:snap-none"
        >
          {products.length > 0 ? (
            products.map((item) => (
              <div
                key={item.id}
                onClick={() => router.push(`/${item.seo_url}`)}
                // MOBILE: w-full (container ka poora width le lega, minus padding)
                // isse exactly ek product frame me fit hoga. md aur upar fixed 243px.
                className="w-full sm:w-[243px] flex-shrink-0 flex flex-col bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer snap-center sm:snap-start relative rounded-none"
              >
                {/* IMAGE */}
                <div className="w-full sm:w-[243px] h-[260px] sm:h-[240px] flex items-center justify-center p-4 relative bg-[#f9f9f9]">
                  <img
                    src={`${IMAGE_BASE_URL}${item.image}`}
                    alt={decodeHtml(item.name)}
                    loading="lazy"
                    className="max-h-full max-w-full object-contain mix-blend-multiply"
                  />
                </div>

                {/* PRODUCT INFO */}
                <div className="w-full sm:w-[243px] flex flex-col items-center justify-between p-5 text-center min-h-[151px]">

                  <div className="flex flex-col gap-2 w-full items-center">
                    {/* NAME */}
                    <h3 className="text-[#333] text-[14px] font-medium leading-snug line-clamp-2 min-h-[40px]">
                      {decodeHtml(item.name)}
                    </h3>

                    {/* PRICE */}
                    <div className="flex items-center justify-center gap-2 mt-1">
                      {item.special_price ? (
                        <>
                          <span className="text-[#98022e] text-[15px]">
                            ${Number(item.special_price).toFixed(2)}
                          </span>
                          <span className="text-gray-500 line-through text-[13px]">
                            ${Number(item.price).toFixed(2)}
                          </span>
                        </>
                      ) : (
                        <span className="text-gray-600 text-[15px]">
                          ${Number(item.price).toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* ADD TO CART BUTTON */}
                  <button
                    onClick={(e) => handleAddToCart(e, item)}
                    className="w-4/5 mt-4 bg-black text-white py-2.5 text-[13px] font-[Cambria,Georgia,serif] font-bold tracking-widest uppercase hover:bg-gray-800 transition-colors rounded-none cursor-pointer"
                  >
                    ADD TO CART
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="w-full text-center py-20 text-gray-400 font-sans">
              No products found in this category.
            </div>
          )}
        </div>

        {/* RIGHT ARROW */}
        <button
          onClick={() => scrollByAmount(300)}
          className="hidden md:flex absolute right-2 lg:right-4 2xl:right-16 top-1/2 -translate-y-1/2 w-9 h-10 bg-[#343a40] text-white items-center justify-center z-10 cursor-pointer shadow-md rounded-none hover:bg-black transition-colors"
          aria-label="Scroll right"
        >
          <ChevronRight size={24} />
        </button>

      </div>
    </div>
  );
};

export default HomeProductSlider;