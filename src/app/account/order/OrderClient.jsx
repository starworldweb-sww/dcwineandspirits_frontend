"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye } from "lucide-react";
import ProductsHeader from "@/app/components/TittleAndBreadcrumb";
import AccountSidebar from "@/app/components/AccountSidebar";
import { useOrderHistory } from "@/app/api/hooks/order/useOrderHistory";

const ACCENT = "#8c1a3c";

const tableHeaders = [
  "Order ID",
  "Customer",
  "No. of Products",
  "Status",
  "Total",
  "Tracking Number",
  "Date Added",
];

const formatDate = (isoString) => {
  if (!isoString) return "-";
  const d = new Date(isoString);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};

const OrderClient = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const limit = 12;

  const { data, isLoading, isError, error } = useOrderHistory({ page, limit });

  const orders = data?.data?.data || [];
  const total = data?.data?.total || 0;
  const totalPages = data?.data?.total_pages || 1;

  const showingFrom = total === 0 ? 0 : (page - 1) * limit + 1;
  const showingTo = Math.min(page * limit, total);

  if (isLoading) {
    return (
      <div className="font-['cambriaregular'] text-[#333333] w-full">
        <ProductsHeader categoryName="Order History" />
        <div className="px-3 lg:px-3 2xl:px-32 mt-10 mb-14">
          <p className="text-[14px] font-hind-madurai text-[#333333]">
            Loading orders...
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="font-['cambriaregular'] text-[#333333] w-full">
        <ProductsHeader categoryName="Order History" />
        <div className="px-3 lg:px-3 2xl:px-32 mt-10 mb-14">
          <p className="text-[14px] font-hind-madurai text-red-600">
            {error?.response?.data?.message || "Failed to load order history."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="font-['cambriaregular'] text-[#333333] w-full">
      <ProductsHeader categoryName="Order History" />

      <div className="flex flex-col lg:flex-row lg:items-start lg:gap-6 2xl:gap-8 w-full px-3 lg:px-3 2xl:px-32 mt-10 mb-14">
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
                {orders.length === 0 ? (
                  <tr>
                    <td
                      colSpan={tableHeaders.length + 1}
                      className="px-4 py-6 text-center text-[14px] font-hind-madurai text-[#666666]"
                    >
                      No orders found.
                    </td>
                  </tr>
                ) : (
                  orders.map((order, idx) => (
                    <tr
                      key={order.order_id}
                      className={idx % 2 === 1 ? "bg-[#fafafa]" : "bg-white"}
                    >
                      <td
                        className="px-4 py-4 text-[14px] font-hind-madurai"
                        style={{ color: ACCENT }}
                      >
                        #{order.order_id}
                      </td>
                      <td className="px-4 py-4 text-[14px] font-hind-madurai text-[#333333]">
                        {order.firstname} {order.lastname}
                      </td>
                      <td className="px-4 py-4 text-[14px] font-hind-madurai text-[#333333]">
                        {order.total_products}
                      </td>
                      <td className="px-4 py-4 text-[14px] font-hind-madurai text-[#333333]">
                        {order.status}
                      </td>
                      <td className="px-4 py-4 text-[14px] font-hind-madurai text-[#333333]">
                        ${Number(order.total).toFixed(2)}
                      </td>
                      <td className="px-4 py-4 text-[14px] font-hind-madurai text-[#666666]">
                        {order.tracking?.length > 0
                          ? order.tracking.join(", ")
                          : "-"}
                      </td>
                      <td className="px-4 py-4 text-[14px] font-hind-madurai text-[#333333] whitespace-nowrap">
                        {formatDate(order.date_added)}
                      </td>
                      <td className="px-4 py-4">
                        <button
                          title="View Details"
                          type="button"
                          onClick={() =>
                            router.push(`/account/order/info?order_id=${order.order_id}`)
                          }
                          className="w-8 h-8 flex items-center justify-center rounded-[3px] bg-[#8a8a8a] text-white hover:bg-[#1a1a1a] transition-colors duration-300 cursor-pointer hover:bg-[#98022e]"
                        >
                          <Eye size={15} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {total > 0 && (
            <div className="flex items-center justify-between mt-4 flex-wrap gap-3">
              <p className="text-[14px] font-hind-madurai text-[#333333]">
                Showing {showingFrom} to {showingTo} of {total} ({totalPages} Page
                {totalPages > 1 ? "s" : ""})
              </p>

              {totalPages > 1 && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="px-3 py-1.5 text-[13px] font-hind-madurai border border-[#e5e5e5] rounded-[3px] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer hover:bg-[#f5f5f5]"
                  >
                    Prev
                  </button>
                  <span className="text-[13px] font-hind-madurai">
                    {page} / {totalPages}
                  </span>
                  <button
                    type="button"
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    className="px-3 py-1.5 text-[13px] font-hind-madurai border border-[#e5e5e5] rounded-[3px] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer hover:bg-[#f5f5f5]"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
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

        <AccountSidebar />
      </div>
    </div>
  );
};

export default OrderClient;