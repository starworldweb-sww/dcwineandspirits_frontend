"use client";

import { useBulkOrderHistory } from "@/app/api/hooks/order/useBulkOrderHistory";
import ProductsHeader from "@/app/components/TittleAndBreadcrumb";
import Link from "next/link";
import React, { useState } from "react";

const LIMIT = 12;

const getBulkOrderDetailUrl = (id) => `/account/bulk-orders/${id}`;

const breadcrumbs = [{ label: "Account", href: "/account/" }, { label: "My Bulk Orders", href: "/account/bulk-orders/" }];

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "-";

const formatRef = (ref) =>
  String(ref ?? "")
    .replace(/^bulk-order-/i, "")
    .replace(/\.xlsx$/i, "") || "-";

// 1. Status ke liye soft background + chhota dot ka color (premium look ke liye halke shades)
const STATUS_STYLES = {
  pending: { badge: "bg-amber-50 text-amber-700 ring-amber-200", dot: "bg-amber-500" },
  approved: { badge: "bg-emerald-50 text-emerald-700 ring-emerald-200", dot: "bg-emerald-500" },
  completed: { badge: "bg-emerald-50 text-emerald-700 ring-emerald-200", dot: "bg-emerald-500" },
  cancelled: { badge: "bg-red-50 text-red-700 ring-red-200", dot: "bg-red-500" },
};
const DEFAULT_STATUS_STYLE = { badge: "bg-gray-50 text-gray-600 ring-gray-200", dot: "bg-gray-400" };

const StatusBadge = ({ status }) => {
  const style = STATUS_STYLES[String(status).toLowerCase()] || DEFAULT_STATUS_STYLE;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium capitalize ring-1 ring-inset ${style.badge}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
      {status || "-"}
    </span>
  );
};

// 2. Chhota arrow icon (naya package install karne ki zaroorat nahi)
const ArrowIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M3 10a.75.75 0 01.75-.75h10.69l-3.22-3.22a.75.75 0 111.06-1.06l4.5 4.5a.75.75 0 010 1.06l-4.5 4.5a.75.75 0 11-1.06-1.06l3.22-3.22H3.75A.75.75 0 013 10z"
      clipRule="evenodd"
    />
  </svg>
);

const BulkOrderSectionClient = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, isFetching } = useBulkOrderHistory({
    page,
    limit: LIMIT,
  });

  // axios data -> { success, message, data: { page, total, total_pages, data: [...] } }
  // agar tumhare order history page mein shape alag padhte ho to yahan wahi rakho
  const payload = data?.data;
  const orders = payload?.data ?? [];
  const totalPages = payload?.total_pages ?? 1;

  return (
    <>
      <ProductsHeader
        categoryName="Corporate Bulk Order"
        breadcrumbs={breadcrumbs}
      />

      <section className="mx-auto w-full max-w-[1200px] px-4 py-12 md:py-16">
        {/* 3. Heading: ab proper h1, chhoti maroon line ke saath */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-[#1c1f22] md:text-3xl">
            My Bulk Orders
          </h1>
          <div className="mt-3 h-[3px] w-10 rounded-full bg-[#98022e]" />
          <p className="mt-3 text-sm text-gray-500">
            Track the status of your bulk order requests.
          </p>
        </div>

        {isLoading ? (
          // 4. Loading skeleton: halka aur rounded
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-16 animate-pulse rounded-xl bg-gray-100" />
            ))}
          </div>
        ) : isError ? (
          <div className="rounded-xl border border-red-100 bg-red-50/60 p-8 text-center text-sm text-red-700">
            Could not load your bulk orders. Please try again.
          </div>
        ) : orders.length === 0 ? (
          // 5. Empty state: dotted border wala clean card
          <div className="rounded-xl border border-dashed border-gray-300 bg-[#fcfcfc] px-6 py-14 text-center">
            <p className="mb-5 text-[#1c1f22]">You have not placed any bulk orders yet.</p>
            <a
              href="/corporate"
              className="inline-block rounded-full bg-[#98022e] px-7 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#7a0225]"
            >
              Place a Bulk Order
            </a>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm md:block">
              <table className="w-full text-left text-sm">
                {/* 6. Header: solid maroon ki jagah halka background + chhota uppercase text */}
                <thead className="border-b border-gray-200 bg-[#faf7f8]">
                  <tr className="text-xs uppercase tracking-wider text-gray-500">
                    <th className="px-6 py-4 font-semibold">Order Ref</th>
                    <th className="px-6 py-4 font-semibold">Date</th>
                    <th className="px-6 py-4 font-semibold">Company</th>
                    <th className="px-6 py-4 text-center font-semibold">Recipients</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 text-right font-semibold">Action</th>
                  </tr>
                </thead>
                {/* 7. Rows: even-odd color hata ke divide line + hover highlight */}
                <tbody
                  className={`divide-y divide-gray-100 transition-opacity ${
                    isFetching ? "opacity-60" : ""
                  }`}
                >
                  {orders.map((o) => (
                    <tr
                      key={o.bulk_order_id}
                      className="text-[#1c1f22] transition-colors hover:bg-[#fdf9fa]"
                    >
                      <td className="px-6 py-4 font-semibold">
                        <Link
                          href={getBulkOrderDetailUrl(o.bulk_order_id)}
                          className="text-[#98022e] hover:underline"
                        >
                          {formatRef(o.order_ref)}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{formatDate(o.date_added)}</td>
                      <td className="px-6 py-4">{o.company || "-"}</td>
                      <td className="px-6 py-4 text-center text-gray-600">{o.total_recipients}</td>
                      <td className="px-6 py-4">
                        <StatusBadge status={o.status} />
                      </td>
                      {/* 8. View: bordered button ki jagah minimal text link + arrow */}
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={getBulkOrderDetailUrl(o.bulk_order_id)}
                          className="group inline-flex items-center gap-1.5 text-xs font-semibold text-[#98022e]"
                        >
                          View
                          <ArrowIcon />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className={`space-y-3 md:hidden ${isFetching ? "opacity-60" : ""}`}>
              {orders.map((o) => (
                // 9. Card: rounded-xl + halka shadow, tap pe soft background
                <Link
                  key={o.bulk_order_id}
                  href={getBulkOrderDetailUrl(o.bulk_order_id)}
                  className="group block rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition active:bg-[#fdf9fa]"
                >
                  <div className="mb-3 flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-[#98022e]">{formatRef(o.order_ref)}</p>
                    <StatusBadge status={o.status} />
                  </div>
                  <p className="text-xs text-gray-500">{formatDate(o.date_added)}</p>
                  <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
                    <p className="text-sm text-[#1c1f22]">
                      {o.company ? `${o.company} · ` : ""}
                      {o.total_recipients} recipient{o.total_recipients === 1 ? "" : "s"}
                    </p>
                    <span className="text-[#98022e]">
                      <ArrowIcon />
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-4">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="rounded-full border border-gray-300 px-5 py-2 text-sm font-medium text-[#1c1f22] transition hover:border-[#98022e] hover:text-[#98022e] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-gray-300 disabled:hover:text-[#1c1f22]"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-500">
                  Page <span className="font-semibold text-[#1c1f22]">{page}</span> of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="rounded-full border border-gray-300 px-5 py-2 text-sm font-medium text-[#1c1f22] transition hover:border-[#98022e] hover:text-[#98022e] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-gray-300 disabled:hover:text-[#1c1f22]"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </>
  );
};

export default BulkOrderSectionClient;