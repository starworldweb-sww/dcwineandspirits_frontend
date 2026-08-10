"use client";

import React from "react";
import Link from "next/link";
import { ShoppingBag, RotateCcw } from "lucide-react";
import ProductsHeader from "@/app/components/TittleAndBreadcrumb";
import AccountSidebar from "@/app/components/AccountSidebar"; // apna actual path daal dena

// --- BRAND ACCENT ---
const ACCENT = "#8c1a3c";

const breadcrumbs = [
  { label: "Home", href: "/" },
  { label: "Account", href: "/account" },
  { label: "Order History", href: "/account/order" },
  { label: "Order Details", href: "/account/order/18537" },
];

// --- STATIC ORDER DATA ---
const order = {
  id: "18537",
  dateAdded: "04/05/2026",
  paymentMethod: "Credit / Debit Card",
  shippingMethod: "Standard Delivery $20/item (Delivery may take 2 to 3 days)",
  paymentAddress: {
    name: "Sunil Kumar",
    line1: "wrewr",
    line2: "ewrewr, Virginia 234234",
    country: "United States",
  },
  shippingAddress: {
    name: "Sunil Kumar",
    line1: "wrewr",
    line2: "ewrewr, Virginia 234234",
    country: "United States",
  },
  products: [
    {
      name: "Moet & Chandon Brut Imperial Champagne And Flutes Gift Set",
      model: "dcgb391",
      quantity: 1,
      price: 129.0,
      total: 129.0,
    },
  ],
  subTotal: 129.0,
  shippingCost: 20.0,
  tax: 9.31,
  taxRate: "6.25%",
  grandTotal: 158.31,
  history: [
    { date: "04/05/2026", status: "Processed", comment: "" },
    { date: "04/05/2026", status: "Processed", comment: "" },
  ],
};

// --- SECTION HEADER ---
const SectionHeader = ({ children }) => (
  <div className="bg-[#eeeeee] px-5 py-3.5">
    <h3 className="text-[14px] font-hind-madurai font-bold uppercase tracking-[0.5px] text-[#333333]">
      {children}
    </h3>
  </div>
);

const OrderInfoClient = () => {
  return (
    <div className="font-['cambriaregular'] text-[#333333] w-full">
      <ProductsHeader categoryName="Order Details"  />

      <div className="flex flex-col lg:flex-row lg:items-start lg:gap-6 2xl:gap-8 w-full px-3 lg:px-3 2xl:px-32 mt-10 mb-14">
        {/* Order Details */}
        <div className="flex-1 min-w-0 w-full">
          <div className="border border-[#e5e5e5] rounded-[4px] overflow-hidden">
            {/* Order Details */}
            <SectionHeader>Order Details</SectionHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-5 py-6">
              <div className="text-[14px] font-hind-madurai text-[#333333] space-y-1.5">
                <p>
                  <span className="font-bold text-[16px]">Order ID: </span>#{order.id}
                </p>
                <p>
                  <span className="font-bold text-[16px]">Date Added: </span>
                  {order.dateAdded}
                </p>
              </div>
              <div className="text-[14px] font-hind-madurai text-[#333333] space-y-1.5">
                <p>
                  <span className="font-bold text-[16px]">Payment Method: </span>
                  {order.paymentMethod}
                </p>
                <p>
                  <span className="font-bold text-[16px]">Shipping Method: </span>
                  {order.shippingMethod}
                </p>
              </div>
            </div>

            {/* Payment / Shipping Address */}
            <div className="grid grid-cols-1 md:grid-cols-2">
              <SectionHeader>Payment Address</SectionHeader>
              <SectionHeader>Shipping Address</SectionHeader>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-5 py-6">
              <div className="text-[14px] font-hind-madurai text-[#333333] space-y-1">
                <p>{order.paymentAddress.name}</p>
                <p>{order.paymentAddress.line1}</p>
                <p>{order.paymentAddress.line2}</p>
                <p>{order.paymentAddress.country}</p>
              </div>
              <div className="text-[14px] font-hind-madurai text-[#333333] space-y-1">
                <p>{order.shippingAddress.name}</p>
                <p>{order.shippingAddress.line1}</p>
                <p>{order.shippingAddress.line2}</p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </div>

            {/* Products Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse min-w-[640px]">
                <thead>
                  <tr className="bg-[#eeeeee]">
                    <th className="text-left text-[14px] font-hind-madurai font-bold uppercase tracking-[0.5px] text-[#333333] px-5 py-3.5">
                      Product Name
                    </th>
                    <th className="text-left text-[13px] font-hind-madurai font-bold uppercase tracking-[0.5px] text-[#333333] px-5 py-3.5">
                      Model
                    </th>
                    <th className="text-left text-[13px] font-hind-madurai font-bold uppercase tracking-[0.5px] text-[#333333] px-5 py-3.5">
                      Quantity
                    </th>
                    <th className="text-right text-[13px] font-hind-madurai font-bold uppercase tracking-[0.5px] text-[#333333] px-5 py-3.5">
                      Price
                    </th>
                    <th className="text-right text-[13px] font-hind-madurai font-bold uppercase tracking-[0.5px] text-[#333333] px-5 py-3.5">
                      Total
                    </th>
                    <th className="px-5 py-3.5 w-[100px]" />
                  </tr>
                </thead>
                <tbody>
                  {order.products.map((product, idx) => (
                    <tr key={idx} className="border-t border-[#eeeeee]">
                      <td className="px-5 py-4 text-[14px] font-hind-madurai text-[#333333]">
                        {product.name}
                      </td>
                      <td className="px-5 py-4 text-[14px] font-hind-madurai text-[#666666]">
                        {product.model}
                      </td>
                      <td className="px-5 py-4 text-[14px] font-hind-madurai text-[#333333]">
                        {product.quantity}
                      </td>
                      <td className="px-5 py-4 text-[14px] font-hind-madurai text-[#333333] text-right">
                        ${product.price.toFixed(2)}
                      </td>
                      <td className="px-5 py-4 text-[14px] font-hind-madurai text-[#333333] text-right">
                        ${product.total.toFixed(2)}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            className="w-8 h-8 flex items-center justify-center rounded-[3px] bg-black text-white hover:bg-[#1a1a1a] transition-colors duration-300 cursor-pointer"
                            aria-label="Add to cart"
                          >
                            <ShoppingBag size={14} />
                          </button>
                          <button
                            type="button"
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
              <div className="flex justify-between px-5 py-3 text-[14px] font-hind-madurai font-bold text-[#333333]">
                <span>Sub-Total</span>
                <span>${order.subTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between px-5 py-3 text-[14px] font-hind-madurai font-bold text-[#333333]">
                <span>Standard Delivery $20/item (Delivery may take 2 to 3 days)</span>
                <span>${order.shippingCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between px-5 py-3 text-[14px] font-hind-madurai font-bold text-[#333333]">
                <span>Tax ({order.taxRate})</span>
                <span>${order.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between px-5 py-3 text-[14px] font-hind-madurai font-bold text-[#333333] border-t border-[#e5e5e5]">
                <span>Total</span>
                <span>${order.grandTotal.toFixed(2)}</span>
              </div>
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
                  <th className="text-left text-[13px] font-hind-madurai font-bold uppercase tracking-[0.5px] text-[#333333] px-5 py-3.5">
                    Date Added
                  </th>
                  <th className="text-left text-[13px] font-hind-madurai font-bold uppercase tracking-[0.5px] text-[#333333] px-5 py-3.5">
                    Status
                  </th>
                  <th className="text-left text-[13px] font-hind-madurai font-bold uppercase tracking-[0.5px] text-[#333333] px-5 py-3.5">
                    Comment
                  </th>
                </tr>
              </thead>
              <tbody>
                {order.history.map((entry, idx) => (
                  <tr
                    key={idx}
                    className={idx % 2 === 1 ? "bg-[#fafafa]" : "bg-white"}
                  >
                    <td className="px-5 py-4 text-[14px] font-hind-madurai text-[#333333]">
                      {entry.date}
                    </td>
                    <td className="px-5 py-4 text-[14px] font-hind-madurai text-[#333333]">
                      {entry.status}
                    </td>
                    <td className="px-5 py-4 text-[14px] font-hind-madurai text-[#666666]">
                      {entry.comment || "-"}
                    </td>
                  </tr>
                ))}
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

        {/* Right Column: Sidebar */}
        <AccountSidebar />
      </div>
    </div>
  );
};

export default OrderInfoClient;