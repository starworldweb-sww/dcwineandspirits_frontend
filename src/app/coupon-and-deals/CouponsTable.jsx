"use client";

import React, { useState } from "react";
import { Copy, Check, Truck } from "lucide-react";
import { toast } from "sonner";
import ProductsHeader from "../components/TittleAndBreadcrumb";
import { useActiveCoupons } from "../api/hooks/coupon/useActiveCoupons";

// ---------------------------------------------------------------
// Helper functions (text banane ke liye)
// ---------------------------------------------------------------

// "P" = percentage, "F" = fixed. Discount 0 aur free shipping ho to "FREE SHIPPING"
const getDiscountText = (type, discount, freeShipping) => {
  if (Number(discount) === 0 && freeShipping) return "FREE SHIPPING";
  return type === "P" ? `${discount}% OFF` : `$${discount} OFF`;
};

// expiresOn (ISO date) ko readable text mein badalta hai
const getExpiryText = (expiresOn) => {
  if (!expiresOn) return "No expiry";
  const formattedDate = new Date(expiresOn).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return `Valid till ${formattedDate}`;
};

// API mein description nahi aati, isliye minimum total aur free shipping se banate hain
const getDescriptionText = (minimumTotal, freeShipping) => {
  const minimumText =
    minimumTotal > 0
      ? `Minimum order amount $${minimumTotal}.`
      : "No minimum order amount.";
  return freeShipping ? `${minimumText} Free shipping included.` : minimumText;
};

const CouponsTable = () => {
  const [copiedCode, setCopiedCode] = useState(null);

  // Step 1 - API se active coupons lao
  const { data, isLoading, isError } = useActiveCoupons();

  // Step 2 - API data ko table/list ke format mein convert karo
  const coupons = (data?.coupons ?? [])
    // jis code ke end mein "-H" hai, wo list mein nahi dikhana
    .filter((apiCoupon) => !/-h$/i.test(String(apiCoupon.code).trim()))
    .map((apiCoupon) => ({
      id: apiCoupon.id,
      code: apiCoupon.code,
      discount: getDiscountText(
        apiCoupon.type,
        apiCoupon.discount,
        apiCoupon.freeShipping
      ),
      title: apiCoupon.name,
      description: getDescriptionText(
        apiCoupon.minimumTotal,
        apiCoupon.freeShipping
      ),
      expiry: getExpiryText(apiCoupon.expiresOn),
      freeShipping: apiCoupon.freeShipping,
    }));

  // Step 3 - Coupon code clipboard pe copy karo
  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Code "${code}" copied!`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Step 4 - Code + Copy button ek jagah define kiya
  // (desktop table aur mobile list dono mein yahi use hota hai)
  const renderCodeBox = (code) => (
    <div className="inline-flex items-center gap-2 border border-dashed border-[#98022e]/60 bg-[#f7ecef] rounded-sm pl-3 pr-1.5 py-1.5">
      <span className="font-bold tracking-widest normal-case text-[#98022e]">
        {code}
      </span>
      <button
        onClick={() => handleCopy(code)}
        className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide transition-colors shrink-0 cursor-pointer normal-case bg-[#98022e] text-white hover:bg-[#7e1a3c]"
      >
        {copiedCode === code ? (
          <>
            <Check size={12} />
            Copied
          </>
        ) : (
          <>
            <Copy size={12} />
            Copy
          </>
        )}
      </button>
    </div>
  );

  return (
    <main className="text-[#333333] font-hind-madurai mb-2 h-full w-full">
      {/* Header — same pattern as other pages */}
      <div className="w-full">
        <ProductsHeader categoryName="Coupon & Deals" />
      </div>

      {/* Loading / error / empty states */}
      {isLoading && (
        <p className="text-center py-6 bg-[#eeeeee] mt-2">Loading coupons...</p>
      )}
      {isError && (
        <p className="text-center py-6 bg-[#eeeeee] mt-2">
          Could not load coupons. Please try again later.
        </p>
      )}
      {!isLoading && !isError && coupons.length === 0 && (
        <p className="text-center py-6 bg-[#eeeeee] mt-2">
          No active coupons right now.
        </p>
      )}

      {coupons.length > 0 && (
        <div className="w-full px-3 2xl:px-32 mt-2 bg-[#eeeeee] py-3">
          {/* ===========================================================
              DESKTOP / TABLET: table (md se upar dikhta hai)
              =========================================================== */}
          <div className="hidden md:block overflow-hidden bg-white border border-[#e3e3e3] rounded-md shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#98022e] text-white">
                <tr>
                  <th className="px-4 py-3 font-bold">Coupon</th>
                  <th className="px-4 py-3 font-bold">Discount</th>
                  <th className="px-4 py-3 font-bold">Details</th>
                  <th className="px-4 py-3 font-bold">Validity</th>
                  <th className="px-4 py-3 font-bold">Code</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((coupon) => (
                  <tr
                    key={coupon.id}
                    className="border-b border-[#e3e3e3] last:border-b-0 odd:bg-white even:bg-[#fafafa] hover:bg-[#f7ecef] transition-colors"
                  >
                    <td className="px-4 py-3 font-semibold">{coupon.title}</td>

                    {/* Discount badge */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#f7ecef] px-3 py-1 text-xs font-bold text-[#98022e]">
                        {coupon.freeShipping && <Truck size={12} />}
                        {coupon.discount}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-gray-600 normal-case">
                      {coupon.description}
                    </td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                      {coupon.expiry}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {renderCodeBox(coupon.code)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ===========================================================
              PHONE: stacked list (md se neeche dikhta hai)
              Order: Code -> Discount -> Title -> Details -> Validity
              =========================================================== */}
          <div className="md:hidden flex flex-col gap-3">
            {coupons.map((coupon) => (
              <div
                key={coupon.id}
                className="bg-white border border-[#e3e3e3] rounded-md shadow-sm p-4 flex flex-col gap-3"
              >
                {/* 1) Code sabse pehle */}
                {renderCodeBox(coupon.code)}

                {/* 2) Discount + title */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#f7ecef] px-3 py-1 text-xs font-bold text-[#98022e]">
                    {coupon.freeShipping && <Truck size={12} />}
                    {coupon.discount}
                  </span>
                  <p className="font-semibold text-base">{coupon.title}</p>
                </div>

                {/* 3) Details + validity */}
                <div>
                  <p className="text-sm text-gray-600 normal-case">
                    {coupon.description}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{coupon.expiry}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
};

export default CouponsTable;