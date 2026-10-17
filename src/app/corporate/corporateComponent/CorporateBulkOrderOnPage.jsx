// CorporateBulkOrderOnPage.jsx
"use client";

// CHANGE 1: useState (open/close ke liye) aur TbChevronDown (arrow icon) add kiya
import React, { useState } from "react";
import {
  TbClipboardText,
  TbSend,
  TbPhoneCall,
  TbMail,
  TbChevronDown,
} from "react-icons/tb";
import { BulkOrderForm } from "./BulkOrderForm";

const MAROON = "#98022e";

// STEP 2: Steps ka data (text yahan se easily badal sakte ho)
const STEPS = [
  {
    icon: TbClipboardText,
    title: "Fill in the form",
    text: "Enter your details and add up to 15 recipients. You can also paste rows copied from Excel.",
  },
  {
    icon: TbSend,
    title: "Submit your order",
    text: "Send the complete request in one go. No files to download, fill in or upload.",
  },
  {
    icon: TbPhoneCall,
    title: "We follow up",
    text: "Our team reviews your request and contacts you to confirm the details.",
  },
];

// STEP 3: Ek step ka card (product card jaisa: white, thin border, maroon accent)
const StepCard = ({ icon: Icon, title, text, number }) => (
  <div className="border border-gray-200 bg-white p-4">
    {/* Icon box (product image frame jaisa) */}
    <div className="flex h-24 items-center justify-center border border-gray-200 bg-white text-[#98022e]">
      <Icon size={40} />
    </div>

    {/* Number maroon bold (price jaisa) */}
    <p className="mt-4 text-lg font-bold text-[#98022e]">Step {number}</p>

    {/* Title uppercase (product name jaisa) */}
    <h3 className="mt-1 text-[15px] font-medium uppercase tracking-wide text-[#1c1f22]">
      {title}
    </h3>

    {/* Description grey (category/brand line jaisa) */}
    <p className="mt-1.5 text-sm leading-relaxed text-gray-500">{text}</p>
  </div>
);

const CorporateBulkOrderOnPage = () => {
  // CHANGE 2: accordion khula hai ya band (false = band se start hoga)
  // Page khulte hi form khula chahiye toh useState(true) kar do
  const [open, setOpen] = useState(false);

  return (
    // STEP 4: Grey section background (screenshot jaisa)
    <section className="w-full bg-[#eeeeee] px-3 py-10 font-hind-madurai md:py-14 2xl:px-32">
      {/* STEP 5: Heading + maroon underline */}
      <div className="mb-6 md:mb-8">
        <h2 className="font-sarabun text-3xl font-semibold text-[#1c1f22] md:text-[40px]">
          Bulk Ordering, Made Simple
        </h2>
        <div className="mt-3 h-[3px] w-20" style={{ backgroundColor: MAROON }} />
        <p className="mt-4 max-w-3xl text-sm text-gray-600 md:text-base">
          Planning gifts for clients, employees or events? Complete the form below and send
          multiple recipients in a single request. Our team will take care of the rest.
        </p>
      </div>

      {/* CHANGE 3: STEP 6 - Accordion (header bar + collapsible body) */}
      <div className="border border-gray-200 bg-white">
        {/* 6a: Clickable header bar */}
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
          aria-controls="bulk-order-panel"
          className="flex w-full cursor-pointer items-center justify-between gap-3 px-5 py-4 text-left transition-colors hover:bg-[#eeeeee]"
        >
          <span className="text-[15px] font-semibold uppercase tracking-wide text-[#1c1f22] md:text-base">
            Place Your Bulk Order
          </span>
          {/* Arrow: khulne par 180 degree ghoomta hai */}
          <TbChevronDown
            size={22}
            className={`shrink-0 text-[#98022e] transition-transform duration-300 ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* 6b: Collapsible body (grid-rows trick se smooth open/close) */}
        <div
          id="bulk-order-panel"
          aria-hidden={!open}
          className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
            open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          }`}
        >
          {/* "invisible" band hone par fields ko tab/keyboard se bhi block kar deta hai.
              Form hamesha mounted rehta hai, isliye band karne par typed data nahi jaata. */}
          <div className={`overflow-hidden ${open ? "visible" : "invisible"}`}>
            <div className="border-t border-gray-200 bg-[#eeeeee] p-3 sm:p-5">
              {/* How it works (3 equal cards) */}
              <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-5">
                {STEPS.map((step, index) => (
                  <StepCard key={step.title} {...step} number={index + 1} />
                ))}
              </div>

              {/* Actual form (white card) */}
              <div className="mt-4 border border-gray-200 bg-white p-4 text-[#1c1f22] [color-scheme:light] sm:p-6 md:mt-6">
                <BulkOrderForm />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* STEP 7: Help bar (white card) */}
      <div className="mt-6 flex flex-col items-center justify-between gap-3 border border-gray-200 bg-white px-5 py-4 text-sm text-[#1c1f22] sm:flex-row md:mt-8">
        <p className="font-medium uppercase tracking-wide">
          Need help with a large or custom order?
        </p>
        <div className="flex flex-wrap items-center justify-center gap-5">
          <a
            href="mailto:contact@dcwineandspirits.com"
            className="inline-flex items-center gap-1.5 font-semibold text-[#98022e] hover:underline"
          >
            <TbMail size={16} />
            contact@dcwineandspirits.com
          </a>
          <a
            href="tel:+12024598489"
            className="inline-flex items-center gap-1.5 font-semibold text-[#98022e] hover:underline"
          >
            <TbPhoneCall size={16} />
            (202) 459-8489
          </a>
        </div>
      </div>
    </section>
  );
};

export default CorporateBulkOrderOnPage;