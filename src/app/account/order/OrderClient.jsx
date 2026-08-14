"use client";

import React from "react";
import Link from "next/link";
import { Eye } from "lucide-react";
import ProductsHeader from "@/app/components/TittleAndBreadcrumb";
import AccountSidebar from "@/app/components/AccountSidebar"; 

// --- BRAND ACCENT ---
const ACCENT = "#8c1a3c";

const breadcrumbs = [
  { label: "Home", href: "/" },
  { label: "Account", href: "/account" },
  { label: "Order History", href: "/account/order" },
];

const tableHeaders = [
  "Order ID",
  "Customer",
  "No. of Products",
  "Status",
  "Total",
  "Tracking Number",
  "Date Added",
];

const orders = [
  {
    order_id: 18537,
    customer: "Sunil Kumar",
    productCount: 1,
    status: "Processed",
    total: 158.31,
    trackingNumber: "",
    dateAdded: "04/05/2026",
  },
  {
    order_id: 13789,
    customer: "Sunil Kumar",
    productCount: 1,
    status: "Refunded",
    total: 41.44,
    trackingNumber: "",
    dateAdded: "21/09/2025",
  },
  {
    order_id: 609,
    customer: "Sunil Kumar",
    productCount: 1,
    status: "Delivered",
    total: 115.75,
    trackingNumber: "",
    dateAdded: "20/04/2023",
  },
  {
    order_id: 600,
    customer: "Sunil Kumar",
    productCount: 1,
    status: "Refunded",
    total: 115.75,
    trackingNumber: "",
    dateAdded: "19/04/2023",
  },
  {
    order_id: 596,
    customer: "Sunil Kumar",
    productCount: 1,
    status: "Refunded",
    total: 62.63,
    trackingNumber: "",
    dateAdded: "18/04/2023",
  },
  {
    order_id: 1,
    customer: "Sunil Kumar",
    productCount: 1,
    status: "Canceled",
    total: 106.0,
    trackingNumber: "",
    dateAdded: "14/11/2022",
  },
];

const OrderClient = () => {
  const totalOrders = orders.length;
  const totalPages = 1;
  const showingFrom = totalOrders === 0 ? 0 : 1;
  const showingTo = totalOrders;

  return (
    <div className="font-['cambriaregular'] text-[#333333] w-full">
      <ProductsHeader categoryName="Order History" />

      <div className="flex flex-col lg:flex-row lg:items-start lg:gap-6 2xl:gap-8 w-full px-3 lg:px-3 2xl:px-32 mt-10 mb-14">
        {/* Orders Table */}
        <div className="flex-1 min-w-0 w-full">
          <div className="w-full overflow-x-auto rounded-[4px] border border-[#e5e5e5]">
            <table className="w-full border-collapse min-w-[760px]">
              <thead>
                <tr className="bg-[#eeeeee]">
                  {tableHeaders.map((header) => (
                    <th
                      key={header}
                      className="text-left text-[12.5px] font-hind-madurai font-bold uppercase tracking-[0.5px] text-[#333333] px-4 py-3.5 whitespace-nowrap"
                    >
                      {header}
                    </th>
                  ))}
                  <th className="px-4 py-3.5 w-[60px]" />
                </tr>
              </thead>
              <tbody>
                {orders.map((order, idx) => (
                  <tr
                    key={order.order_id}
                    className={idx % 2 === 1 ? "bg-[#fafafa]" : "bg-white"}
                  >
                    <td className="px-4 py-4 text-[14px] font-hind-madurai" style={{ color: ACCENT }}>
                      #{order.order_id}
                    </td>
                    <td className="px-4 py-4 text-[14px] font-hind-madurai text-[#333333]">
                      {order.customer}
                    </td>
                    <td className="px-4 py-4 text-[14px] font-hind-madurai text-[#333333]">
                      {order.productCount}
                    </td>
                    <td className="px-4 py-4 text-[14px] font-hind-madurai text-[#333333]">
                      {order.status}
                    </td>
                    <td className="px-4 py-4 text-[14px] font-hind-madurai text-[#333333]">
                      ${Number(order.total).toFixed(2)}
                    </td>
                    <td className="px-4 py-4 text-[14px] font-hind-madurai text-[#666666]">
                      {order.trackingNumber || "-"}
                    </td>
                    <td className="px-4 py-4 text-[14px] font-hind-madurai text-[#333333] whitespace-nowrap">
                      {order.dateAdded}
                    </td>
                    <td className="px-4 py-4">
                      <Link href={`/account/order/${order.order_id}`}>
                        <button
                        title="View Details"
                          type="button"
                          className="w-8 h-8 flex items-center justify-center rounded-[3px] bg-[#8a8a8a] text-white hover:bg-[#1a1a1a] transition-colors duration-300 cursor-pointer hover:bg-[#98022e]"
                        >
                          <Eye size={15} />
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {orders.length > 0 && (
            <p className="text-[14px] font-hind-madurai text-[#333333] mt-4">
              Showing {showingFrom} to {showingTo} of {totalOrders} ({totalPages} Page
              {totalPages > 1 ? "s" : ""})
            </p>
          )}

          <Link href="/account">
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

export default OrderClient;