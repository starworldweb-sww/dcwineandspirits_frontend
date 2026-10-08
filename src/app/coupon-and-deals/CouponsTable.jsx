"use client";

import React, { useState } from "react";
// CHANGE 1: "Tag" icon ab use nahi ho raha, isliye import se hata diya
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";
import ProductsHeader from "../components/TittleAndBreadcrumb";

// 1. Coupon data — manage codes/discounts here (data pehle jaisa hi hai)
// NOTE: "variant" ab table mein use nahi hota (cards ke liye tha), data mein rehne diya hai
const coupons = [
  {
    code: "WELCOME10",
    discount: "$10 OFF",
    title: "Sign Up & Save",
    description: "Sign Up & Save $10 Today.",
    expiry: "Valid till 31st January 2027",
    variant: "dark",
  },
  {
    code: "FLAT10",
    discount: "$10 OFF",
    title: "Flat Discount",
    description: "$10 discount on first order, minimum amount $100.",
    expiry: "Valid till 28th February 2027",
    variant: "light",
  },
  {
    code: "MOTHERDAY",
    discount: "$10 OFF",
    title: "Mother's Day Offer",
    description: "$10 discount, minimum amount $100.",
    expiry: "Valid till 10 May 2026 (Expired)",
    variant: "light",
  },
  {
    code: "FATHERDAY",
    discount: "$10 OFF",
    title: "Father's Day Offer",
    description: "$10 discount, minimum amount $100.",
    expiry: "Valid till 21 June 2026 (Expired)",
    variant: "dark",
  },
];

// 2. Table ke column headings (desktop par dikhte hain)
const tableHeadings = [
  { label: "Coupon", widthClass: "md:w-[22%]" },
  { label: "Discount", widthClass: "md:w-[13%]" },
  { label: "Details", widthClass: "md:w-[27%]" },
  { label: "Validity", widthClass: "md:w-[20%]" },
  { label: "Code", widthClass: "md:w-[18%]" },
];

// 3. Mobile par har cell ke upar chhota label dikhane ke liye (data-label attribute se aata hai)
//    Desktop (md) par ye label hide ho jata hai, kyunki wahan header row hai
const mobileLabelClass =
  "before:content-[attr(data-label)] before:block before:mb-0.5 before:text-[11px] before:font-bold before:uppercase before:tracking-wide before:text-gray-400 md:before:hidden";

const CouponsTable = () => {
  const [copiedCode, setCopiedCode] = useState(null);

  // 4. Copy coupon code to clipboard (pehle jaisa hi)
  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Code "${code}" copied!`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <main className="text-[#333333] font-hind-madurai mb-2  h-full w-full">
      {/* Header — same pattern as other pages */}
      <div className="w-full">
        <ProductsHeader categoryName="Coupon & Deals" />
      </div>

      {/* 5. Table wrapper — rounded corners + shadow (screenshot jaisa) */}
      <div className="px-3 2xl:px-32 mt-2 bg-[#eeeeee] py-4">
        <div className="rounded-md overflow-hidden shadow-md bg-white">
          {/* 6. Mobile par table/tr/td "block" ban jate hain (stacked cards),
                 md (768px+) par asli table layout aa jata hai */}
          <table className="block md:table w-full text-left border-collapse">
            {/* 7. Header row — sirf desktop par dikhegi */}
            <thead className="hidden md:table-header-group bg-[#a40034] text-white">
              <tr>
                {tableHeadings.map((heading) => (
                  <th
                    key={heading.label}
                    className={`px-5 py-4 text-base font-bold font-sumana ${heading.widthClass}`}
                  >
                    {heading.label}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="block md:table-row-group">
              {coupons.map((coupon) => (
                <tr
                  key={coupon.code}
                  className="block md:table-row p-4 md:p-0 border-b border-[#e3e3e3] last:border-b-0 odd:bg-white even:bg-[#fafafa] hover:bg-[#f7ecef]/60 transition-colors"
                >
                  {/* Column 1: Coupon title */}
                  <td
                    data-label="Coupon"
                    className={`block md:table-cell px-0 md:px-5 py-1.5 md:py-4 md:align-middle font-bold text-[#1a1a1a] ${mobileLabelClass}`}
                  >
                    {coupon.title}
                  </td>

                  {/* Column 2: Discount badge (pill) */}
                  <td
                    data-label="Discount"
                    className={`block md:table-cell px-0 md:px-5 py-1.5 md:py-4 md:align-middle ${mobileLabelClass}`}
                  >
                    <span className="inline-block rounded-full bg-[#f7ecef] px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#98022e]">
                      {coupon.discount}
                    </span>
                  </td>

                  {/* Column 3: Details */}
                  <td
                    data-label="Details"
                    className={`block md:table-cell px-0 md:px-5 py-1.5 md:py-4 md:align-middle text-sm text-gray-600 normal-case ${mobileLabelClass}`}
                  >
                    {coupon.description}
                  </td>

                  {/* Column 4: Validity */}
                  <td
                    data-label="Validity"
                    className={`block md:table-cell px-0 md:px-5 py-1.5 md:py-4 md:align-middle text-sm text-gray-500 normal-case ${mobileLabelClass}`}
                  >
                    {coupon.expiry}
                  </td>

                  {/* Column 5: Coupon code + Copy button */}
                  <td
                    data-label="Code"
                    className={`block md:table-cell px-0 md:px-5 py-1.5 md:py-4 md:align-middle ${mobileLabelClass}`}
                  >
                    <div className="flex md:inline-flex items-center justify-between gap-3 rounded-sm border border-dashed border-[#98022e]/60 bg-[#f7ecef] px-3 py-2">
                      <span className="truncate text-base font-bold tracking-widest text-[#98022e] normal-case">
                        {coupon.code}
                      </span>
                      <button
                        onClick={() => handleCopy(coupon.code)}
                        className="flex shrink-0 cursor-pointer items-center gap-1 rounded-full bg-[#98022e] px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#7e1a3c]"
                      >
                        {copiedCode === coupon.code ? (
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};

export default CouponsTable;