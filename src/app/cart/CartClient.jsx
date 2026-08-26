"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Home, Plus, Minus, RefreshCw, X, ShoppingBag, Loader2, ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import { toast } from "sonner";
import ProductsHeader from "@/app/components/TittleAndBreadcrumb";
import { useGetCartList } from "@/app/api/hooks/cart/useGetCartList";
import { decodeHtml } from "@/libs/decodeHtml";
import { useupdatedCart } from "@/app/api/hooks/cart/useUpdatedCart";
import { useRemoveFromCart } from "@/app/api/hooks/cart/useRemoveFromCart";
import { useClearCart } from "@/app/api/hooks/cart/useClearCart";
import { useCountryget } from "@/app/api/hooks/customerAddress/useCountryget";
import { useZoneget } from "@/app/api/hooks/customerAddress/useZoneget";
import { shippingRateService } from "@/app/api/services/shippingRateService";
import { useUser } from "../api/hooks/useAuth";


const ACCENT = "#98022e";
// Single source of truth for image host — pick whichever env var is actually populated.
const IMAGE_BASE_URL =
  process.env.NEXT_PUBLIC_PRODUCTION_IMAGE_URL ||
  process.env.NEXT_PUBLIC_IMAGE_BASE_URL ||
  "";
const PAGE_LIMIT = 12;

const breadcrumbs = [{ label: "Shopping Cart", href: "/cart" }];

const buildImageUrl = (path) => {
  if (!path) return "/products/placeholder.webp";
  const needsSlash = !path.startsWith("/") && !IMAGE_BASE_URL.endsWith("/");
  return `${IMAGE_BASE_URL}${needsSlash ? "/" : ""}${path}`;
};

const CartClient = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, isError, isFetching } = useGetCartList(currentPage, PAGE_LIMIT);
  const updatedCartMut = useupdatedCart();
  const removeCartMut = useRemoveFromCart();
  const clearCartMut = useClearCart();
  const { data: countries = [] } = useCountryget();
  const { mutateAsync: fetchZonesAsync, isPending: isZonesLoading } = useZoneget();
  const { sessionId, customerId } = useUser();

  const [items, setItems] = useState([]);
  const [openSection, setOpenSection] = useState("shipping");

  const [selectedCountryId, setSelectedCountryId] = useState("223");
  const [selectedZoneId, setSelectedZoneId] = useState("");
  const [zones, setZones] = useState([]);
  const [estimatedShipping, setEstimatedShipping] = useState(null);
  const [isQuoteLoading, setIsQuoteLoading] = useState(false);
  const [quoteRequested, setQuoteRequested] = useState(false);
  const [selectedShippingOption, setSelectedShippingOption] = useState(null);

  // Per-row pending ids so one item's action doesn't disable every row's buttons
  const [pendingQtyIds, setPendingQtyIds] = useState(new Set());
  const [pendingRemoveIds, setPendingRemoveIds] = useState(new Set());

  // Clear-cart confirmation modal
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    const list = data?.items || [];
    setItems(
      list.map((item) => {
        const product = item.product || {};
        const price = product.special_price ?? product.price ?? 0;
        return {
          id: item.cart_id,
          image: buildImageUrl(product.image),
          name: product.name,
          model: product.model ?? product.sku ?? String(product.product_id ?? ""),
          qty: item.quantity ?? 1,
          slug: product?.slug,
          unitPrice: parseFloat(price) || 0,
          selectedOptions: item.selected_options || [],
          stock: product.quantity ?? null, // cap qty if the API returns available stock
        };
      })
    );
  }, [data]);

  const totalPages = data?.totalPages || 1;
  const totalCartItems = data?.total || 0;

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

  // Optimistic qty update with rollback on failure
  const updateQty = (id, delta) => {
    const target = items.find((item) => item.id === id);
    if (!target) return;

    const proposedQty = target.qty + delta;
    const maxQty = target.stock ?? Infinity;

    if (proposedQty > maxQty) {
      toast.error(`Only ${maxQty} left in stock`);
      return;
    }

    const newQty = Math.max(1, proposedQty);
    const prevQty = target.qty;

    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, qty: newQty } : item))
    );
    setPendingQtyIds((prev) => new Set(prev).add(id));

    updatedCartMut.mutate(
      { cart_id: id, quantity: newQty },
      {
        onError: () => {
          setItems((prev) =>
            prev.map((item) => (item.id === id ? { ...item, qty: prevQty } : item))
          );
          toast.error("Couldn't update quantity — please try again");
        },
        onSettled: () => {
          setPendingQtyIds((prev) => {
            const next = new Set(prev);
            next.delete(id);
            return next;
          });
        },
      }
    );
  };

  // Optimistic remove with rollback
  const removeItem = (id) => {
    const removedItem = items.find((item) => item.id === id);
    const removedIndex = items.findIndex((item) => item.id === id);
    if (!removedItem) return;

    setItems((prev) => prev.filter((item) => item.id !== id));
    setPendingRemoveIds((prev) => new Set(prev).add(id));

    removeCartMut.mutate(id, {
      onSuccess: () => {
        toast.success(`${decodeHtml(removedItem.name)} removed from cart`);
      },
      onError: () => {
        setItems((prev) => {
          const next = [...prev];
          next.splice(removedIndex, 0, removedItem);
          return next;
        });
        toast.error("Couldn't remove item — please try again");
      },
      onSettled: () => {
        setPendingRemoveIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      },
    });
  };

  // Clear entire cart
  const handleClearCart = () => {
    clearCartMut.mutate(
      { sessionId, customerId: customerId || 0 },
      {
        onSuccess: () => {
          setItems([]);
          setEstimatedShipping(null);
          setSelectedShippingOption(null);
          setQuoteRequested(false);
          setShowClearConfirm(false);
          
        },
        onError: (error) => {
          toast.error(error?.response?.data?.message || "Failed to clear cart");
          setShowClearConfirm(false);
        },
      }
    );
  };

  const subTotal = items.reduce((sum, item) => sum + item.unitPrice * item.qty, 0);
  const taxRate = 0.0625;
  const tax = subTotal * taxRate;
  const shippingCost = selectedShippingOption?.price ?? estimatedShipping?.price ?? 0;
  const total = subTotal + tax + shippingCost;

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
            aria-label="Previous page"
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
              aria-label={`Go to page ${pageNum}`}
              aria-current={pageNum === currentPage ? "page" : undefined}
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
            aria-label="Next page"
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
          <h1 className="text-[32px] font-hind-madurai font-normal">Shopping Cart</h1>
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
            <div className="flex flex-col gap-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="flex gap-3 border border-gray-100 rounded-[6px] p-3 bg-white animate-pulse"
                >
                  <div className="w-16 h-16 bg-gray-200 rounded shrink-0" />
                  <div className="flex-1 flex flex-col gap-2 justify-center">
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                    <div className="h-3 bg-gray-200 rounded w-1/4" />
                  </div>
                </div>
              ))}
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
              <p className="text-[15px] font-hind-madurai text-[#666] mb-4">
                Your shopping cart is empty.
              </p>
              <Link
                href="/"
                className="text-[13px] font-hind-madurai font-semibold uppercase tracking-wide text-white px-5 py-2.5 rounded-[3px]"
                style={{ backgroundColor: ACCENT }}
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <>
              {/* Empty cart trigger */}
              <div className="flex justify-end mb-3">
                <button
                  onClick={() => setShowClearConfirm(true)}
                  className="text-[12px] font-hind-madurai font-semibold uppercase tracking-wide text-[#888] hover:text-[#98022e] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 size={13} />
                  Empty Cart
                </button>
              </div>

              {/* DESKTOP TABLE — hidden on mobile */}
              <div className="hidden md:block w-full overflow-x-auto relative">
                {isFetching && (
                  <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10">
                    <Loader2 size={22} className="animate-spin text-gray-500" />
                  </div>
                )}
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
                    {items.map((item) => {
                      const qtyPending = pendingQtyIds.has(item.id);
                      const removePending = pendingRemoveIds.has(item.id);
                      const atMax = item.stock != null && item.qty >= item.stock;
                      return (
                        <tr key={item.id} className="border-b border-gray-100">
                          <td className="px-4 py-4 w-20">
                            <Image
                              src={item.image}
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
                              {atMax && (
                                <div className="text-[11px] text-orange-600 mt-1">
                                  Max stock reached
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
                                  aria-label={`Quantity for ${item.name}`}
                                  className="w-10 text-center text-[14px] py-1.5 outline-none"
                                />
                                <div className="flex flex-col border-l border-[#d9d9d9]">
                                  <button
                                    onClick={() => updateQty(item.id, 1)}
                                    disabled={qtyPending || atMax}
                                    aria-label={`Increase quantity for ${item.name}`}
                                    className="px-1.5 hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                  >
                                    <Plus size={10} />
                                  </button>
                                  <button
                                    onClick={() => updateQty(item.id, -1)}
                                    disabled={qtyPending || item.qty <= 1}
                                    aria-label={`Decrease quantity for ${item.name}`}
                                    className="px-1.5 border-t border-[#d9d9d9] hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                  >
                                    <Minus size={10} />
                                  </button>
                                </div>
                              </div>
                              <button
                                title="Update cart"
                                aria-label={`Sync quantity for ${item.name}`}
                                onClick={() =>
                                  updatedCartMut.mutate({ cart_id: item.id, quantity: item.qty })
                                }
                                disabled={qtyPending}
                                className="flex items-center justify-center w-9 h-9 bg-black text-white hover:bg-[#1a1a1a] transition-colors disabled:opacity-50"
                              >
                                {qtyPending ? (
                                  <Loader2 size={14} className="animate-spin" />
                                ) : (
                                  <RefreshCw size={14} />
                                )}
                              </button>
                              <button
                                title="Remove item"
                                aria-label={`Remove ${item.name} from cart`}
                                onClick={() => removeItem(item.id)}
                                disabled={removePending}
                                className="flex items-center justify-center w-9 h-9 bg-black text-white hover:bg-[#1a1a1a] transition-colors disabled:opacity-50 cursor-pointer active:-98"
                              >
                                {removePending ? (
                                  <Loader2 size={14} className="animate-spin" />
                                ) : (
                                  <X size={14} />
                                )}
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
                      );
                    })}
                  </tbody>
                </table>

                <PaginationBar />
              </div>

              {/* MOBILE CARDS — hidden on desktop */}
              <div className="md:hidden flex flex-col gap-4">
                {items.map((item) => {
                  const qtyPending = pendingQtyIds.has(item.id);
                  const removePending = pendingRemoveIds.has(item.id);
                  const atMax = item.stock != null && item.qty >= item.stock;
                  return (
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
                        {atMax && (
                          <span className="text-[11px] text-orange-600">Max stock reached</span>
                        )}

                        <div className="flex items-center justify-between mt-1.5">
                          <div className="flex items-center border border-[#d9d9d9] rounded-[3px] overflow-hidden">
                            <button
                              onClick={() => updateQty(item.id, -1)}
                              disabled={qtyPending || item.qty <= 1}
                              aria-label={`Decrease quantity for ${item.name}`}
                              className="px-2.5 py-1.5 hover:bg-gray-100 transition-colors disabled:opacity-40"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="w-8 text-center text-[13px]">
                              {qtyPending ? (
                                <Loader2 size={12} className="animate-spin mx-auto" />
                              ) : (
                                item.qty
                              )}
                            </span>
                            <button
                              onClick={() => updateQty(item.id, 1)}
                              disabled={qtyPending || atMax}
                              aria-label={`Increase quantity for ${item.name}`}
                              className="px-2.5 py-1.5 border-l border-[#d9d9d9] hover:bg-gray-100 transition-colors disabled:opacity-40"
                            >
                              <Plus size={12} />
                            </button>
                          </div>

                          <button
                            title="Remove item"
                            aria-label={`Remove ${item.name} from cart`}
                            onClick={() => removeItem(item.id)}
                            disabled={removePending}
                            className="flex items-center justify-center w-8 h-8 bg-black text-white rounded-[3px] disabled:opacity-50"
                          >
                            {removePending ? (
                              <Loader2 size={13} className="animate-spin" />
                            ) : (
                              <X size={13} />
                            )}
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
                  );
                })}

                <PaginationBar />
              </div>
            </>
          )}
        </div>

        {/* RIGHT: Summary Sidebar */}
        <div className="w-full lg:w-[340px] shrink-0 mt-8 lg:mt-0 lg:sticky lg:top-24 lg:self-start">
          <div className="bg-[#f7f7f7] rounded-[4px] p-6">
            <h2 className="text-[18px] font-hind-madurai font-semibold text-[#333] pb-3 mb-3 border-b border-[#333]">
              What would you like to do next?
            </h2>

            {[{ key: "shipping", label: "Estimate Shipping & Taxes" }].map((section) => (
              <div key={section.key} className="border-b border-gray-200">
                <button
                  onClick={() => toggleSection(section.key)}
                  aria-expanded={openSection === section.key}
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
                          <p className="text-[11px] text-[#999] mt-1">
                            Currently shipping to the United States only.
                          </p>
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
                <span className="text-[14px] font-hind-madurai">${subTotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 bg-[#fafafa]">
                <span className="text-[13px] font-hind-madurai font-semibold uppercase text-[#333]">
                  Tax ({(taxRate * 100).toFixed(2)}%):
                </span>
                <span className="text-[14px] font-hind-madurai">${tax.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
                <div className="flex flex-col">
                  <span className="text-[13px] font-hind-madurai font-semibold uppercase text-[#333]">
                    Shipping:
                  </span>
                  {quoteRequested && estimatedShipping && selectedShippingOption?.title && (
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
                <span className="text-[15px] font-hind-madurai font-bold" style={{ color: ACCENT }}>
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

      {/* Clear cart confirmation modal */}
      {showClearConfirm && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4"
          onClick={() => !clearCartMut.isPending && setShowClearConfirm(false)}
        >
          <div
            className="bg-white rounded-[6px] p-6 max-w-sm w-full shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-[16px] font-hind-madurai font-semibold text-[#333] mb-2">
              Empty your cart?
            </h3>
            <p className="text-[13px] font-hind-madurai text-[#666] mb-5">
              This will remove all items from your cart. This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowClearConfirm(false)}
                disabled={clearCartMut.isPending}
                className="px-4 py-2 text-[13px] font-hind-madurai font-semibold border border-[#d9d9d9] rounded-[3px] hover:bg-gray-50 transition-colors disabled:opacity-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleClearCart}
                disabled={clearCartMut.isPending}
                className="px-4 py-2 text-[13px] font-hind-madurai font-semibold text-white rounded-[3px] transition-colors disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                style={{ backgroundColor: ACCENT }}
              >
                {clearCartMut.isPending && <Loader2 size={14} className="animate-spin" />}
                {clearCartMut.isPending ? "Clearing..." : "Yes, Empty Cart"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartClient;