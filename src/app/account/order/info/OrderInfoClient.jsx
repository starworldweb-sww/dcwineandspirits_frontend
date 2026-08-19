"use client";

import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ShoppingBag, RotateCcw } from "lucide-react";
import ProductsHeader from "@/app/components/TittleAndBreadcrumb";
import AccountSidebar from "@/app/components/AccountSidebar";
import { useOrderInfo } from "@/app/api/hooks/order/useGetOrderInfo";
import { decodeHtml } from "@/libs/decodeHtml";

const ACCENT = "#8c1a3c";

const formatDate = (isoString) => {
  if (!isoString) return "-";
  const d = new Date(isoString);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};

const SectionHeader = ({ children }) => (
  <div className="bg-[#eeeeee] px-5 py-3.5">
    <h3 className="text-[14px] font-hind-madurai font-bold uppercase tracking-[0.5px] text-[#333333]">
      {children}
    </h3>
  </div>
);

const OrderInfoClient = () => {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");

  // Extra safety: if orderId is missing, show error (no UI change)
  if (!orderId) {
    return (
      <div className="font-['cambriaregular'] text-[#333333] w-full">
        <ProductsHeader categoryName="Order Details" />
        <div className="px-3 lg:px-3 2xl:px-32 mt-10 mb-14">
          <p className="text-[14px] font-hind-madurai text-red-600">
            Order ID is missing.
          </p>
        </div>
      </div>
    );
  }

  const { data, isLoading, isError, error } = useOrderInfo(orderId);
  console.log(data)
  const order = data?.data;

  if (isLoading) {
    return (
      <div className="font-['cambriaregular'] text-[#333333] w-full">
        <ProductsHeader categoryName="Order Details" />
        <div className="px-3 lg:px-3 2xl:px-32 mt-10 mb-14">
          <p className="text-[14px] font-hind-madurai text-[#333333]">
            Loading order details...
          </p>
        </div>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="font-['cambriaregular'] text-[#333333] w-full">
        <ProductsHeader categoryName="Order Details" />
        <div className="px-3 lg:px-3 2xl:px-32 mt-10 mb-14">
          <p className="text-[14px] font-hind-madurai text-red-600">
            {error?.response?.data?.message || "Failed to load order details."}
          </p>
        </div>
      </div>
    );
  }

  const { order_details, payment_address, shipping_address, products, totals, order_history } = order;

  // Dummy handlers (you can replace with actual logic later)
  const handleAddToCart = (product) => {
    console.log("Add to cart:", product);
  };

  const handleReorder = (product) => {
    console.log("Reorder:", product);
  };

  return (
    <div className="font-['cambriaregular'] text-[#333333] w-full">
      <ProductsHeader categoryName="Order Details" />

      <div className="flex flex-col lg:flex-row lg:items-start lg:gap-6 2xl:gap-8 w-full px-3 lg:px-3 2xl:px-32 mt-10 mb-14">
        <div className="flex-1 min-w-0 w-full">
          <div className="border border-[#e5e5e5] rounded-[4px] overflow-hidden">
            <SectionHeader>Order Details</SectionHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-5 py-6">
              <div className="text-[14px] font-hind-madurai text-[#333333] space-y-1.5">
                <p><span className="font-bold text-[16px]">Order ID: </span>#{order_details.order_id}</p>
                <p><span className="font-bold text-[16px]">Date Added: </span>{formatDate(order_details.date_added)}</p>
              </div>
              <div className="text-[14px] font-hind-madurai text-[#333333] space-y-1.5">
                <p><span className="font-bold text-[16px]">Payment Method: </span>{order_details.payment_method}</p>
                <p><span className="font-bold text-[16px]">Shipping Method: </span>{order_details.shipping_method}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2">
              <SectionHeader>Payment Address</SectionHeader>
              <SectionHeader>Shipping Address</SectionHeader>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-5 py-6">
              <div className="text-[14px] font-hind-madurai text-[#333333] space-y-1">
                <p>{payment_address.firstname} {payment_address.lastname}</p>
                <p>{payment_address.address_1}</p>
                {payment_address.address_2 && <p>{payment_address.address_2}</p>}
                <p>{payment_address.city}, {payment_address.zone} {payment_address.postcode}</p>
                <p>{payment_address.country}</p>
              </div>
              <div className="text-[14px] font-hind-madurai text-[#333333] space-y-1">
                <p>{shipping_address.firstname} {shipping_address.lastname}</p>
                <p>{shipping_address.address_1}</p>
                {shipping_address.address_2 && <p>{shipping_address.address_2}</p>}
                <p>{shipping_address.city}, {shipping_address.zone} {shipping_address.postcode}</p>
                <p>{shipping_address.country}</p>
              </div>
            </div>

            {/* Products Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse min-w-[640px]">
                <thead>
                  <tr className="bg-[#eeeeee]">
                    <th className="text-left text-[14px] font-hind-madurai font-bold uppercase tracking-[0.5px] text-[#333333] px-5 py-3.5">Product Name</th>
                    <th className="text-left text-[13px] font-hind-madurai font-bold uppercase tracking-[0.5px] text-[#333333] px-5 py-3.5">Model</th>
                    <th className="text-left text-[13px] font-hind-madurai font-bold uppercase tracking-[0.5px] text-[#333333] px-5 py-3.5">Quantity</th>
                    <th className="text-right text-[13px] font-hind-madurai font-bold uppercase tracking-[0.5px] text-[#333333] px-5 py-3.5">Price</th>
                    <th className="text-right text-[13px] font-hind-madurai font-bold uppercase tracking-[0.5px] text-[#333333] px-5 py-3.5">Total</th>
                    <th className="px-5 py-3.5 w-[100px]" />
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.order_product_id} className="border-t border-[#eeeeee]">
                      <td className="px-5 py-4 text-[14px] font-hind-madurai text-[#333333]">
                        {product.slug ? (
                          <Link href={`/${product.slug}`} style={{ color: ACCENT }}>
                            {decodeHtml(product.name)}
                          </Link>
                        ) : (
                          product.name
                        )}
                        {product.options?.length > 0 && (
                          <div className="text-[12px] text-[#666666] mt-1">
                            {product.options.map((opt, i) => (
                              <div key={i}>{opt.name}: {opt.value}</div>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-4 text-[14px] font-hind-madurai text-[#666666]">{product.model}</td>
                      <td className="px-5 py-4 text-[14px] font-hind-madurai text-[#333333]">{product.quantity}</td>
                      <td className="px-5 py-4 text-[14px] font-hind-madurai text-[#333333] text-right">${Number(product.price).toFixed(2)}</td>
                      <td className="px-5 py-4 text-[14px] font-hind-madurai text-[#333333] text-right">${Number(product.total).toFixed(2)}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleAddToCart(product)}
                            className="w-8 h-8 flex items-center justify-center rounded-[3px] bg-black text-white hover:bg-[#1a1a1a] transition-colors duration-300 cursor-pointer"
                            aria-label="Add to cart"
                          >
                            <ShoppingBag size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleReorder(product)}
                            className="w-8 h-8 flex items-center justify-center rounded-[3px] bg-black text-white hover:bg-[#1a1a1a] transition-colors duration-300 cursor-pointer"
                            aria-label="Reorder"
                          >
                            <RotateCcw size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="bg-[#f5f5f6]">
              {totals.map((t, idx) => (
                <div
                  key={idx}
                  className={`flex justify-between px-5 py-3 text-[14px] font-hind-madurai font-bold text-[#333333] ${
                    idx === totals.length - 1 ? "border-t border-[#e5e5e5]" : ""
                  }`}
                >
                  <span>{t.title}</span>
                  <span>${Number(t.value).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Order History */}
          <h2 className="text-[20px] font-hind-madurai font-semibold text-[#333333] pb-1 mb-4 border-b border-[#8c1a3c] inline-block mt-10">
            Order History
          </h2>

          <div className="border border-[#e5e5e5] rounded-[4px] overflow-hidden">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#eeeeee]">
                  <th className="text-left text-[13px] font-hind-madurai font-bold uppercase tracking-[0.5px] text-[#333333] px-5 py-3.5">Date Added</th>
                  <th className="text-left text-[13px] font-hind-madurai font-bold uppercase tracking-[0.5px] text-[#333333] px-5 py-3.5">Status</th>
                  <th className="text-left text-[13px] font-hind-madurai font-bold uppercase tracking-[0.5px] text-[#333333] px-5 py-3.5">Comment</th>
                </tr>
              </thead>
              <tbody>
                {order_history?.length > 0 ? (
                  order_history.map((entry, idx) => (
                    <tr key={idx} className={idx % 2 === 1 ? "bg-[#fafafa]" : "bg-white"}>
                      <td className="px-5 py-4 text-[14px] font-hind-madurai text-[#333333]">{formatDate(entry.date_added)}</td>
                      <td className="px-5 py-4 text-[14px] font-hind-madurai text-[#333333]">{entry.status}</td>
                      <td className="px-5 py-4 text-[14px] font-hind-madurai text-[#666666]">{entry.comment || "-"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="px-5 py-4 text-[14px] font-hind-madurai text-[#666666] text-center">No history available.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <Link href="/account/order">
            <button
              type="button"
              className="w-full bg-black text-white text-[13px] font-hind-madurai font-semibold tracking-[1.5px] uppercase py-3.5 mt-6 transition-colors duration-300 hover:bg-[#1a1a1a] cursor-pointer"
            >
              Continue
            </button>
          </Link>
        </div>

        <AccountSidebar />
      </div>
    </div>
  );
};

export default OrderInfoClient;