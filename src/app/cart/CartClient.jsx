"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Home, Plus, Minus, RefreshCw, X, ShoppingBag, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import ProductsHeader from "@/app/components/TittleAndBreadcrumb";
import { useGetCartList } from "@/app/api/hooks/cart/useGetCartList";
import { decodeHtml } from "@/libs/decodeHtml";
import { useupdatedCart } from "@/app/api/hooks/cart/useUpdatedCart";
import { useRemoveFromCart } from "@/app/api/hooks/cart/useRemoveFromCart";
import { useCountryget } from "@/app/api/hooks/customerAddress/useCountryget";
import { useZoneget } from "@/app/api/hooks/customerAddress/useZoneget";
import { shippingRateService } from "@/app/api/services/shippingRateService";

const ACCENT = "#98022e";
const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_BASE_URL || "";
const PAGE_LIMIT = 12;

const breadcrumbs = [
  { label: "Shopping Cart", href: "/cart" },
];

const CartClient = () => {
  // 1. Pagination state — current page number
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, isError, isFetching } = useGetCartList(currentPage, PAGE_LIMIT);
  const updatedCartMut = useupdatedCart();
  const removeCartMut = useRemoveFromCart();
  const { data: countries = [] } = useCountryget();
  const { mutateAsync: fetchZonesAsync, isPending: isZonesLoading } = useZoneget();

  const [items, setItems] = useState([]);
  const [openSection, setOpenSection] = useState("shipping");

  const [selectedCountryId, setSelectedCountryId] = useState("223");
  const [selectedZoneId, setSelectedZoneId] = useState("");
  const [zones, setZones] = useState([]);
  const [estimatedShipping, setEstimatedShipping] = useState(null);
  const [isQuoteLoading, setIsQuoteLoading] = useState(false);
  const [quoteRequested, setQuoteRequested] = useState(false);
  const [selectedShippingOption, setSelectedShippingOption] = useState(null);

  useEffect(() => {
    const list = data?.items || [];
    setItems(
      list.map((item) => {
        const product = item.product || {};
        const price = product.special_price ?? product.price ?? 0;
        return {
          id: item.cart_id,
          image: product.image
            ? `${IMAGE_BASE_URL}/${product.image}`
            : "/products/placeholder.webp",
          name: product.name,
          model: product.model ?? product.sku ?? String(product.product_id ?? ""),
          qty: item.quantity ?? 1,
          slug: product?.slug,
          unitPrice: parseFloat(price) || 0,
          selectedOptions: item.selected_options || [],
        };
      })
    );
  }, [data]);

  // 2. Total pages from API response, fallback to 1
  const totalPages = data?.totalPages || 1;
  const totalCartItems = data?.total || 0;

  // 3. Page change handler — clamps between 1 and totalPages, scrolls to top of cart list
  const goToPage = (nextPage) => {
    if (nextPage < 1 || nextPage > totalPages || nextPage === currentPage) return;
    setCurrentPage(nextPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleSection = (section) =>
    setOpenSection((prev) => (prev === section ? null : section));

  useEffect(() => {
    if (!selectedCountryId) {
      setZones([]);
      setSelectedZoneId("");
      return;
    }
    let cancelled = false;
    const loadZones = async () => {
      try {
        const zoneList = await fetchZonesAsync(selectedCountryId);
        if (!cancelled) {
          setZones(zoneList || []);
          setSelectedZoneId("");
        }
      } catch (e) {
        console.warn("Failed to load zones:", e.message);
        if (!cancelled) setZones([]);
      }
    };
    loadZones();
    return () => {
      cancelled = true;
    };
  }, [selectedCountryId, fetchZonesAsync]);

  const handleGetQuote = async () => {
    if (!selectedCountryId) {
      toast.error("Please select a country");
      return;
    }
    if (!selectedZoneId) {
      toast.error("Please select a region/state");
      return;
    }

    const totalQty = items.reduce((sum, item) => sum + item.qty, 0);
    setIsQuoteLoading(true);
    setQuoteRequested(true);
    setSelectedShippingOption(null);
    try {
      const result = await shippingRateService.getShippingRate(
        selectedCountryId,
        selectedZoneId,
        totalQty || 1
      );
      if (result) {
        setEstimatedShipping(result);
        const allMatches = result.allMatches || [];
        const defaultOption = allMatches.length
          ? allMatches[0]
          : { title: result.matchedCharge || "Standard Shipping", price: result.price };
        setSelectedShippingOption(defaultOption);
        toast.success(
          allMatches.length > 1
            ? `${allMatches.length} shipping options available`
            : `Shipping estimate: $${result.price?.toFixed(2)}`
        );
      } else {
        setEstimatedShipping(null);
        toast.error("No shipping rate found for this location");
      }
    } catch (e) {
      setEstimatedShipping(null);
      toast.error(e?.response?.data?.message || "Failed to fetch shipping rate");
    } finally {
      setIsQuoteLoading(false);
    }
  };

  const updateQty = (id, delta) => {
    const target = items.find((item) => item.id === id);
    if (!target) return;

    const newQty = Math.max(1, target.qty + delta);

    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, qty: newQty } : item))
    );

    updatedCartMut.mutate({ cart_id: id, quantity: newQty });
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    removeCartMut.mutate(id);
  };

  const subTotal = items.reduce((sum, item) => sum + item.unitPrice * item.qty, 0);
  const taxRate = 0.0625;
  const tax = subTotal * taxRate;
  const shippingCost = selectedShippingOption?.price ?? estimatedShipping?.price ?? 0;
  const total = subTotal + tax + shippingCost;

  // 4. Reusable pagination bar — shown below both desktop table and mobile cards
  const PaginationBar = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
        <span className="text-[12px] font-hind-madurai text-[#888]">
          Page {currentPage} of {totalPages} &middot; {totalCartItems} item(s)
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1 || isFetching}
            className="flex items-center justify-center w-8 h-8 border border-[#d9d9d9] rounded-[3px] hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            title="Previous page"
          >
            <ChevronLeft size={14} />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => goToPage(pageNum)}
              disabled={isFetching}
              className={`min-w-[32px] h-8 px-2 text-[13px] font-hind-madurai rounded-[3px] transition-colors disabled:cursor-not-allowed cursor-pointer ${
                pageNum === currentPage
                  ? "text-white"
                  : "border border-[#d9d9d9] hover:bg-gray-50"
              }`}
              style={pageNum === currentPage ? { backgroundColor: ACCENT } : undefined}
            >
              {pageNum}
            </button>
          ))}

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages || isFetching}
            className="flex items-center justify-center w-8 h-8 border border-[#d9d9d9] rounded-[3px] hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            title="Next page"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="font-['cambriaregular'] text-[#333333] w-full">
      {ProductsHeader ? (
        <ProductsHeader categoryName="Shopping Cart" breadcrumbs={breadcrumbs} />
      ) : (
        <div className="bg-[#f5f5f5] py-10 text-center border-b border-gray-200">
          <h1 className="text-[32px] font-hind-madurai font-normal">
            Shopping Cart
          </h1>
          <div className="w-14 h-[2px] bg-[#333] mx-auto mt-2 mb-4" />
          <div className="flex items-center justify-center gap-1.5 text-sm text-[#666]">
            <Home size={14} />
            <span>/ Shopping Cart</span>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row lg:items-start lg:gap-6 2xl:gap-8 w-full px-3 lg:px-3 2xl:px-32 mt-6 lg:mt-10 mb-14">
        {/* LEFT: Cart Items */}
        <div className="flex-1 min-w-0 w-full">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-[#f8f8f8] rounded-[4px]">
              <p className="text-[15px] font-hind-madurai text-[#666]">
                Loading your cart...
              </p>
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-[#f8f8f8] rounded-[4px]">
              <p className="text-[15px] font-hind-madurai text-[#666]">
                Something went wrong while loading your cart.
              </p>
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-[#f8f8f8] rounded-[4px]">
              <ShoppingBag size={40} className="text-gray-300 mb-3" />
              <p className="text-[15px] font-hind-madurai text-[#666]">
                Your shopping cart is empty.
              </p>
            </div>
          ) : (
            <>
              {/* DESKTOP TABLE — hidden on mobile */}
              <div className="hidden md:block w-full overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-[#f2f2f2] text-left">
                      <th className="px-4 py-3 text-[13px] font-hind-madurai font-semibold uppercase tracking-wide text-[#333]">
                        Image
                      </th>
                      <th className="px-4 py-3 text-[13px] font-hind-madurai font-semibold uppercase tracking-wide text-[#333]">
                        Product Name
                      </th>
                      <th className="px-4 py-3 text-[13px] font-hind-madurai font-semibold uppercase tracking-wide text-[#333]">
                        Model
                      </th>
                      <th className="px-4 py-3 text-[13px] font-hind-madurai font-semibold uppercase tracking-wide text-[#333]">
                        Quantity
                      </th>
                      <th className="px-4 py-3 text-[13px] font-hind-madurai font-semibold uppercase tracking-wide text-[#333]">
                        Unit Price
                      </th>
                      <th className="px-4 py-3 text-[13px] font-hind-madurai font-semibold uppercase tracking-wide text-[#333]">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id} className="border-b border-gray-100">
                        <td className="px-4 py-4 w-20">
                          <Image
                            src={`${process.env.NEXT_PUBLIC_PRODUCTION_IMAGE_URL}${item?.image}`}
                            alt={item.name}
                            width={64}
                            height={64}
                            className="object-contain w-16 h-16"
                          />
                        </td>
                        <td className="px-4 py-4">
                          <div>
                            <Link
                              href={`/${item.slug}`}
                              className="text-[14px] font-hind-madurai font-medium hover:opacity-80 transition-opacity"
                              style={{ color: ACCENT }}
                            >
                              {decodeHtml(item.name)}
                            </Link>

                            {item.selectedOptions?.length > 0 && (
                              <div className="mt-1 space-y-0.5">
                                {item.selectedOptions.map((option) => (
                                  <div
                                    key={option.option_id}
                                    className="text-[12px] text-[#777] font-hind-madurai"
                                  >
                                    <span className="font-semibold">{option.option_name}:</span>{" "}
                                    {option.value}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-[14px] font-hind-madurai text-[#555]">
                          {item.model}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center border border-[#d9d9d9] rounded-[3px] overflow-hidden">
                              <input
                                type="text"
                                readOnly
                                value={item.qty}
                                className="w-10 text-center text-[14px] py-1.5 outline-none"
                              />
                              <div className="flex flex-col border-l border-[#d9d9d9]">
                                <button
                                  onClick={() => updateQty(item.id, 1)}
                                  className="px-1.5 hover:bg-gray-100 transition-colors"
                                >
                                  <Plus size={10} />
                                </button>
                                <button
                                  onClick={() => updateQty(item.id, -1)}
                                  className="px-1.5 border-t border-[#d9d9d9] hover:bg-gray-100 transition-colors"
                                >
                                  <Minus size={10} />
                                </button>
                              </div>
                            </div>
                            <button
                              title="Update cart"
                              disabled={updatedCartMut.isPending}
                              className="flex items-center justify-center w-9 h-9 bg-black text-white hover:bg-[#1a1a1a] transition-colors disabled:opacity-50"
                            >
                              <RefreshCw size={14} />
                            </button>
                            <button
                              title="Remove item"
                              onClick={() => removeItem(item.id)}
                              disabled={removeCartMut.isPending}
                              className="flex items-center justify-center w-9 h-9 bg-black text-white hover:bg-[#1a1a1a] transition-colors disabled:opacity-50"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-[14px] font-hind-madurai">
                          ${item.unitPrice.toFixed(2)}
                        </td>
                        <td className="px-4 py-4 text-[14px] font-hind-madurai font-semibold">
                          ${(item.unitPrice * item.qty).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <PaginationBar />
              </div>

              {/* MOBILE CARDS — hidden on desktop */}
              <div className="md:hidden flex flex-col gap-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3 border border-gray-100 rounded-[6px] p-3 bg-white shadow-sm"
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={72}
                      height={72}
                      className="object-contain w-[72px] h-[72px] shrink-0 rounded"
                    />

                    <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                      <Link
                        href={`/${item.slug}`}
                        className="text-[14px] font-hind-madurai font-medium leading-snug"
                        style={{ color: ACCENT }}
                      >
                        {decodeHtml(item.name)}
                      </Link>
                      {item.selectedOptions?.length > 0 && (
                        <div className="mt-1 space-y-0.5">
                          {item.selectedOptions.map((option) => (
                            <div
                              key={option.option_id}
                              className="text-[12px] text-[#777] font-hind-madurai"
                            >
                              <span className="font-semibold">{option.option_name}:</span>{" "}
                              {option.value}
                            </div>
                          ))}
                        </div>
                      )}

                      <span className="text-[12px] font-hind-madurai text-[#888]">
                        Model: {item.model}
                      </span>

                      <div className="flex items-center justify-between mt-1.5">
                        <div className="flex items-center border border-[#d9d9d9] rounded-[3px] overflow-hidden">
                          <button
                            onClick={() => updateQty(item.id, -1)}
                            className="px-2.5 py-1.5 hover:bg-gray-100 transition-colors"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-8 text-center text-[13px]">
                            {item.qty}
                          </span>
                          <button
                            onClick={() => updateQty(item.id, 1)}
                            className="px-2.5 py-1.5 border-l border-[#d9d9d9] hover:bg-gray-100 transition-colors"
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        <button
                          title="Remove item"
                          onClick={() => removeItem(item.id)}
                          disabled={removeCartMut.isPending}
                          className="flex items-center justify-center w-8 h-8 bg-black text-white rounded-[3px] disabled:opacity-50"
                        >
                          <X size={13} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-1 pt-1.5 border-t border-gray-100">
                        <span className="text-[12px] font-hind-madurai text-[#888]">
                          ${item.unitPrice.toFixed(2)} each
                        </span>

                        <span className="text-[14px] font-hind-madurai font-semibold">
                          ${(item.unitPrice * item.qty).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                <PaginationBar />
              </div>
            </>
          )}
        </div>

        {/* RIGHT: Summary Sidebar */}
        <div className="w-full lg:w-[340px] shrink-0 mt-8 lg:mt-0">
          <div className="bg-[#f7f7f7] rounded-[4px] p-6">
            <h2 className="text-[18px] font-hind-madurai font-semibold text-[#333] pb-3 mb-3 border-b border-[#333]">
              What would you like to do next?
            </h2>

            {[
              { key: "shipping", label: "Estimate Shipping & Taxes" },
            ].map((section) => (
              <div key={section.key} className="border-b border-gray-200">
                <button
                  onClick={() => toggleSection(section.key)}
                  className="w-full flex items-center justify-between py-3.5 text-[13px] font-hind-madurai font-semibold uppercase tracking-wide text-[#555] hover:text-[#333] transition-colors"
                >
                  {section.label}
                  <span className="flex items-center justify-center w-5 h-5 border border-gray-400 rounded-sm text-[14px] leading-none">
                    {openSection === section.key ? "−" : "+"}
                  </span>
                </button>
                {openSection === section.key && (
                  <div className="pb-4 text-[13px] font-hind-madurai text-[#666]">
                    {section.key === "shipping" && (
                      <div className="space-y-3">
                        <p className="mb-2">Enter your destination to estimate shipping & taxes.</p>

                        <div>
                          <label className="block text-[12px] font-semibold uppercase mb-1 text-[#555]">
                            Country
                          </label>
                          <select
                            value={selectedCountryId}
                            onChange={(e) => {
                              setSelectedCountryId(String(e.target.value));
                              setEstimatedShipping(null);
                              setQuoteRequested(false);
                              setSelectedShippingOption(null);
                            }}
                            disabled
                            className="w-full border border-[#d9d9d9] rounded-[3px] px-3 py-2 text-[13px] outline-none focus:border-[#98022e] bg-gray-100 cursor-not-allowed text-[#555]"
                          >
                            <option value="">--- Please Select Country ---</option>
                            {countries.map((c) => (
                              <option key={c.country_id} value={c.country_id}>
                                {c.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-[12px] font-semibold uppercase mb-1 text-[#555]">
                            Region / State
                          </label>
                          <select
                            value={selectedZoneId}
                            onChange={(e) => {
                              setSelectedZoneId(e.target.value);
                              setEstimatedShipping(null);
                              setQuoteRequested(false);
                              setSelectedShippingOption(null);
                            }}
                            disabled={!selectedCountryId || isZonesLoading}
                            className="w-full border border-[#d9d9d9] rounded-[3px] px-3 py-2 text-[13px] outline-none focus:border-[#98022e] bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                          >
                            <option value="">
                              {!selectedCountryId
                                ? "--- Please Select Country First ---"
                                : isZonesLoading
                                  ? "Loading zones..."
                                  : zones.length === 0
                                    ? "--- No zones available ---"
                                    : "--- Please Select Region ---"}
                            </option>
                            {zones.map((z) => (
                              <option key={z.zone_id} value={z.zone_id}>
                                {z.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <button
                          onClick={handleGetQuote}
                          disabled={isQuoteLoading || !selectedCountryId || !selectedZoneId}
                          className="w-full bg-black text-white text-[12px] font-semibold uppercase tracking-wider py-2.5 rounded-[3px] hover:bg-[#1a1a1a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          {isQuoteLoading && <Loader2 size={14} className="animate-spin" />}
                          {isQuoteLoading ? "Fetching Quotes..." : "Get Quotes"}
                        </button>

                        {quoteRequested && !isQuoteLoading && (
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            {estimatedShipping ? (
                              <div className="space-y-2">
                                {(() => {
                                  const allMatches = estimatedShipping.allMatches || [];
                                  if (allMatches.length > 1) {
                                    return (
                                      <div className="space-y-2">
                                        <p className="text-[12px] text-[#888] mb-1">
                                          Please select a shipping method:
                                        </p>
                                        {allMatches.map((opt) => {
                                          const isSelected =
                                            selectedShippingOption?.title === opt.title &&
                                            Number(selectedShippingOption?.price) === Number(opt.price);
                                          return (
                                            <label
                                              key={`${opt.title}-${opt.price}`}
                                              className={`flex items-start justify-between gap-3 p-3 border rounded-[3px] cursor-pointer transition-colors ${
                                                isSelected
                                                  ? "border-[#98022e] bg-[#fff5f7]"
                                                  : "border-gray-200 bg-white hover:bg-gray-50"
                                              }`}
                                            >
                                              <div className="flex items-start gap-2">
                                                <input
                                                  type="radio"
                                                  name="cartShippingOption"
                                                  checked={isSelected}
                                                  onChange={() =>
                                                    setSelectedShippingOption({
                                                      title: opt.title,
                                                      price: opt.price,
                                                    })
                                                  }
                                                  className="mt-1 accent-[#98022e]"
                                                />
                                                <div>
                                                  <p className="text-[13px] font-semibold text-[#333]">
                                                    {opt.title}
                                                  </p>
                                                </div>
                                              </div>
                                              <span
                                                className="text-[14px] font-bold whitespace-nowrap"
                                                style={{ color: ACCENT }}
                                              >
                                                ${Number(opt.price).toFixed(2)}
                                              </span>
                                            </label>
                                          );
                                        })}
                                      </div>
                                    );
                                  }
                                  const optTitle =
                                    selectedShippingOption?.title ||
                                    estimatedShipping.matchedCharge ||
                                    "Standard Shipping";
                                  const optPrice =
                                    selectedShippingOption?.price ?? estimatedShipping.price ?? 0;
                                  return (
                                    <div className="flex items-start justify-between gap-2">
                                      <div>
                                        <p className="text-[13px] font-semibold text-[#333]">
                                          {optTitle}
                                        </p>
                                      </div>
                                      <span
                                        className="text-[14px] font-bold whitespace-nowrap"
                                        style={{ color: ACCENT }}
                                      >
                                        ${Number(optPrice).toFixed(2)}
                                      </span>
                                    </div>
                                  );
                                })()}
                              </div>
                            ) : (
                              <p className="text-[12px] text-orange-600">
                                No shipping quotes available for the selected location.
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            <div className="mt-5 bg-white rounded-[4px] overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
                <span className="text-[13px] font-hind-madurai font-semibold uppercase text-[#333]">
                  Sub-Total:
                </span>
                <span className="text-[14px] font-hind-madurai">
                  ${subTotal.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 bg-[#fafafa]">
                <span className="text-[13px] font-hind-madurai font-semibold uppercase text-[#333]">
                  Tax ({(taxRate * 100).toFixed(2)}%):
                </span>
                <span className="text-[14px] font-hind-madurai">
                  ${tax.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
                <div className="flex flex-col">
                  <span className="text-[13px] font-hind-madurai font-semibold uppercase text-[#333]">
                    Shipping:
                  </span>
                  {quoteRequested &&
                    estimatedShipping &&
                    selectedShippingOption?.title && (
                      <span className="text-[11px] font-hind-madurai text-[#888] mt-0.5">
                        {selectedShippingOption.title}
                      </span>
                    )}
                </div>
                <span className="text-[14px] font-hind-madurai">
                  {quoteRequested && estimatedShipping
                    ? `$${Number(shippingCost).toFixed(2)}`
                    : quoteRequested
                      ? "N/A"
                      : "---"}
                </span>
              </div>
              <div className="flex items-center justify-between px-5 py-4">
                <span className="text-[14px] font-hind-madurai font-bold uppercase text-[#333]">
                  Total:
                </span>
                <span
                  className="text-[15px] font-hind-madurai font-bold"
                  style={{ color: ACCENT }}
                >
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>
            <a href="/checkout">
              <button className="w-full cursor-pointer mt-5 bg-black text-white text-[13px] font-hind-madurai font-semibold tracking-[1.5px] uppercase py-3.5 hover:bg-[#1a1a1a] transition-colors">
                Proceed to Checkout
              </button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartClient;