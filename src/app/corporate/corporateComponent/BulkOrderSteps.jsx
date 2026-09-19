"use client";

import Link from "next/link";

/**
 * BulkOrderSteps
 * ------------------------------------------------------------------
 * DC Wine & Spirits ke liye "Bulk Order" section — batata hai ki
 * bulk order form se kaam kaise hota hai, 3 simple steps mein:
 *   1. Download the form
 *   2. Fill the form
 *   3. Submit the form
 *
 * DC Wine & Spirits ka theme follow kiya hai: maroon + gold palette,
 * Sumana heading font, Hind Madurai body font, px-3 2xl:px-32 padding.
 * ------------------------------------------------------------------
 */

const MAROON = "#98022e";
const GOLD = "#c99000";

// ================================================================
// 1. BULK ORDER STEPS DATA
// Har step: number, title, description, aur uska icon (inline SVG)
// ================================================================
const BULK_ORDER_STEPS = [
  {
    stepNumber: "01",
    title: "Download the Form",
    description:
      "Hamara bulk order form download karein — isme aapko apni requirement ki saari details bharni hongi.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-7 h-7"
      >
        <path d="M12 3v12" />
        <path d="M7 10l5 5 5-5" />
        <path d="M5 21h14" />
      </svg>
    ),
  },
  {
    stepNumber: "02",
    title: "Fill the Form",
    description:
      "Bottles, quantity, delivery date, aur contact details bharein — jitni detail utni fast processing.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-7 h-7"
      >
        <path d="M4 4h16v16H4z" />
        <path d="M8 9h8" />
        <path d="M8 13h8" />
        <path d="M8 17h5" />
      </svg>
    ),
  },
  {
    stepNumber: "03",
    title: "Submit the Form",
    description:
      "Filled form humein email ya website ke through submit karein — hamari team 24 hours mein reach out karegi.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-7 h-7"
      >
        <path d="M22 2 11 13" />
        <path d="M22 2 15 22l-4-9-9-4 20-7Z" />
      </svg>
    ),
  },
];

export default function BulkOrderSteps({
  formDownloadUrl = "/downloads/bulk-order-form.pdf",
  formSubmitUrl = "/bulk-order/",
}) {
  return (
    <section className="w-full bg-white py-14 md:py-16 lg:py-20 font-hind-madurai px-3 2xl:px-32">
      <div className="max-w-[1400px] mx-auto">
        {/* ============ 2. SECTION HEADING ============ */}
        <div className="text-center mb-10 md:mb-14">
          <h2 className="font-sumana text-3xl md:text-4xl lg:text-[44px] font-bold text-[#1c1f22] leading-tight">
            <span className="italic font-bold" style={{ color: MAROON }}>
              Bulk{" "}
            </span>
            Order
          </h2>

          <p className="italic text-sm md:text-base text-[#4a4a4a] max-w-2xl mx-auto mt-4">
            Planning a big event or stocking up for your business? Download
            our bulk order form, fill in your requirements, and submit it —
            our team will take care of the rest.
          </p>
        </div>

        {/* ============ 3. THREE STEPS ============ */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-10 mb-12 md:mb-14">
          {BULK_ORDER_STEPS.map((step, index) => (
            <div key={step.stepNumber} className="relative text-center px-4">
              {/* Connector line between steps (desktop only) */}
              {index < BULK_ORDER_STEPS.length - 1 && (
                <div
                  className="hidden sm:block absolute top-8 left-[calc(50%+40px)] right-[calc(-50%+40px)] h-[2px]"
                  style={{ backgroundColor: `${GOLD}55` }}
                />
              )}

              {/* Step icon + number badge */}
              <div
                className="relative z-10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-white"
                style={{ backgroundColor: MAROON }}
              >
                {step.icon}
                <span
                  className="absolute -top-2 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-sumana font-bold text-white"
                  style={{ backgroundColor: GOLD }}
                >
                  {step.stepNumber}
                </span>
              </div>

              <h3 className="font-sumana text-lg md:text-xl font-bold text-[#1c1f22] mb-2">
                {step.title}
              </h3>

              <p className="text-sm md:text-[15px] text-[#4a4a4a] leading-relaxed max-w-[260px] mx-auto">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* ============ 4. ACTION BUTTONS ============ */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={formDownloadUrl}
            download
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-sumana font-bold text-white text-sm md:text-base tracking-wide transition-transform duration-200 hover:scale-105 cursor-pointer"
            style={{ backgroundColor: MAROON }}
          >
            {/* Download icon */}
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4"
            >
              <path d="M12 3v12" />
              <path d="M7 10l5 5 5-5" />
              <path d="M5 21h14" />
            </svg>
            Download Bulk Order Form
          </a>

          <Link
            href={formSubmitUrl}
            className="inline-block px-8 py-3 rounded-full font-sumana font-bold text-sm md:text-base tracking-wide border-2 transition-transform duration-200 hover:scale-105 cursor-pointer"
            style={{ borderColor: MAROON, color: MAROON }}
          >
            Submit Filled Form
          </Link>
        </div>
      </div>
    </section>
  );
}