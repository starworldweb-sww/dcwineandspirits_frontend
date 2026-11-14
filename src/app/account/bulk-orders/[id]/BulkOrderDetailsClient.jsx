"use client";

import { useBulkOrderDetails } from "@/app/api/hooks/order/useBulkOrderDetails";
import ProductsHeader from "@/app/components/TittleAndBreadcrumb";
import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";

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

const STATUS_STYLES = {
  pending: "bg-amber-100 text-amber-800",
  approved: "bg-green-100 text-green-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const StatusBadge = ({ status }) => (
  <span
    className={`inline-block rounded-full px-3 py-1 text-xs font-semibold capitalize ${
      STATUS_STYLES[String(status).toLowerCase()] || "bg-gray-200 text-gray-700"
    }`}
  >
    {status || "-"}
  </span>
);

const InfoRow = ({ label, value }) => (
  <div>
    <p className="text-xs uppercase tracking-wide text-gray-500">{label}</p>
    <p className="text-sm text-[#1c1f22]">{value || "-"}</p>
  </div>
);

const BulkOrderDetailsClient = () => {  
  const { id } = useParams();
  const { data, isLoading, isError } = useBulkOrderDetails(id);
  const details = data?.data;
  const order = details?.order_details;
  const customer = details?.customer;
  const items = details?.items ?? [];

  const breadcrumbs = [
    { label: "Account", href: "/account/" },
    { label: "My Bulk Orders", href: "/account/bulk-orders/" },
    { label: "Bulk Order Details", href: `/account/bulk-info/${id}` },
  ];

  return (
    <>
      <ProductsHeader categoryName="Bulk Order Details" breadcrumbs={breadcrumbs} />

      <section className="mx-auto w-full max-w-[1200px] px-4 py-10">
        {/* Step 5: Loading */}
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-16 animate-pulse rounded bg-[#eeeeee]" />
            ))}
          </div>
        ) : isError || !details ? (
          <div className="rounded border border-red-200 bg-red-50 p-6 text-center text-sm text-red-700">
            <p className="mb-4">Could not load this bulk order. It may not exist.</p>
            <Link
              href="/account/bulk-orders/"
              className="inline-block rounded bg-[#98022e] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#7a0225]"
            >
              Back to My Bulk Orders
            </Link>
          </div>
        ) : (
          <>
            {/* Step 7: Header - order ref + status */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl font-bold text-[#1c1f22] md:text-3xl">
                  {formatRef(order.order_ref)}
                </h1>
                <p className="text-sm text-gray-600">
                  Placed on {formatDate(order.date_added)}
                </p>
              </div>
              <StatusBadge status={order.status} />
            </div>

            {/* Step 8: Order summary + customer info */}
            <div className="mb-8 grid gap-4 rounded border border-gray-200 bg-[#f7f7f7] p-5 sm:grid-cols-2 lg:grid-cols-3">
              <InfoRow label="Name" value={customer.name} />
              <InfoRow label="Company" value={customer.company} />
              <InfoRow label="Email" value={customer.email} />
              <InfoRow label="Mobile" value={customer.mobile_no} />
              <InfoRow label="Total Recipients" value={order.total_recipients} />
              <InfoRow label="Billing Address" value={customer.billing_address} />
            </div>

            {/* Step 9: Recipients heading */}
            <h2 className="mb-3 text-xl font-bold text-[#1c1f22]">
              Recipients ({items.length})
            </h2>

            {/* Desktop table */}
            <div className="hidden overflow-x-auto rounded border border-gray-200 md:block">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#98022e] text-white">
                  <tr>
                    <th className="px-4 py-3 font-semibold">#</th>
                    <th className="px-4 py-3 font-semibold">Recipient</th>
                    <th className="px-4 py-3 font-semibold">Shipping Address</th>
                    <th className="px-4 py-3 font-semibold">Product</th>
                    <th className="px-4 py-3 font-semibold">Message</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr
                      key={item.item_id}
                      className="border-t border-gray-200 align-top text-[#1c1f22] even:bg-[#f7f7f7]"
                    >
                      <td className="px-4 py-3">{item.sr_no}</td>
                      <td className="px-4 py-3">
                        <p className="font-semibold">{item.recipient_name}</p>
                        <p className="text-xs text-gray-600">{item.mobile_no || ""}</p>
                      </td>
                      <td className="px-4 py-3">{item.shipping_address}</td>
                      <td className="px-4 py-3">
                        {/* product match hua to product_name, warna jo user ne Excel mein likha tha */}
                        <p className="font-semibold">
                          {item.product_name || item.product_input}
                        </p>
                        {item.model_no && (
                          <p className="text-xs text-gray-600">Model: {item.model_no}</p>
                        )}
                        {item.mpn && (
                          <p className="text-xs text-gray-600">MPN: {item.mpn}</p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {item.message || "-"}
                        {item.remarks && (
                          <p className="mt-1 text-xs text-gray-600">
                            Remarks: {item.remarks}
                          </p>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="space-y-3 md:hidden">
              {items.map((item) => (
                <div
                  key={item.item_id}
                  className="rounded border border-gray-200 bg-white p-4"
                >
                  <p className="text-xs text-gray-500">Recipient #{item.sr_no}</p>
                  <p className="text-sm font-bold text-[#1c1f22]">{item.recipient_name}</p>
                  {item.mobile_no && (
                    <p className="text-xs text-gray-600">{item.mobile_no}</p>
                  )}
                  <p className="mt-2 text-sm text-[#1c1f22]">{item.shipping_address}</p>
                  <p className="mt-2 text-sm font-semibold text-[#98022e]">
                    {item.product_name || item.product_input}
                  </p>
                  {(item.model_no || item.mpn) && (
                    <p className="text-xs text-gray-600">
                      {item.model_no ? `Model: ${item.model_no}` : ""}
                      {item.model_no && item.mpn ? " · " : ""}
                      {item.mpn ? `MPN: ${item.mpn}` : ""}
                    </p>
                  )}
                  {item.message && (
                    <p className="mt-2 text-xs text-gray-600">Message: {item.message}</p>
                  )}
                  {item.remarks && (
                    <p className="text-xs text-gray-600">Remarks: {item.remarks}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Step 10: Back link */}
            <div className="mt-8">
              <Link
                href="/account/bulk-orders/"
                className="inline-block rounded border border-[#98022e] px-5 py-2 text-sm font-semibold text-[#98022e] transition hover:bg-[#98022e] hover:text-white"
              >
                ← Back to My Bulk Orders
              </Link>
            </div>
          </>
        )}
      </section>
    </>
  );
};

export default BulkOrderDetailsClient;