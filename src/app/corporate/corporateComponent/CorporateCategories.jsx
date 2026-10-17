// CorporateBulkOrderOnPage.jsx
"use client";

import React from "react";
import { TbClipboardText, TbSend, TbPhoneCall, TbMail } from "react-icons/tb";
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

// STEP 3: Ek step ka tile (CorporateCategories ke tile jaisa: square, grey bg, maroon hover)
const StepTile = ({ icon: Icon, title, text, number }) => (
  <div className="group flex items-start gap-4 bg-[#eeeeee] p-5 transition-colors duration-300 hover:bg-[#98022e]">
    <span
      className="flex h-11 w-11 shrink-0 items-center justify-center bg-[#98022e] text-white transition-colors duration-300 group-hover:bg-white group-hover:text-[#98022e]"
    >
      <Icon size={22} />
    </span>
    <div>
      <h3 className="text-[13px] font-semibold uppercase tracking-wide text-[#1c1f22] transition-colors duration-300 group-hover:text-white md:text-[15px]">
        {number}. {title}
      </h3>
      <p className="mt-1.5 text-sm leading-relaxed text-gray-600 transition-colors duration-300 group-hover:text-white/90">
        {text}
      </p>
    </div>
  </div>
);

const CorporateBulkOrderOnPage = () => {
  return (
    <section className="w-full bg-white px-3 py-10 font-hind-madurai md:py-14 2xl:px-32">
      {/* STEP 4: Heading (same style as "Shop Corporate Gifts by Category") */}
      <div className="mb-6 md:mb-8">
        <h2 className="font-s text-2xl font-bold text-[#1c1f22] md:text-[32px]">
          Place Your Bulk Order Online
        </h2>
        <div className="mt-3 h-[2px] w-16" style={{ backgroundColor: MAROON }} />
        <p className="mt-4 max-w-3xl text-sm text-gray-600 md:text-base">
          Planning gifts for clients, employees or events? Complete the form below and send
          multiple recipients in a single request. Our team will take care of the rest.
        </p>
      </div>

      {/* STEP 5: How it works (3 equal tiles) */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-5">
        {STEPS.map((step, index) => (
          <StepTile key={step.title} {...step} number={index + 1} />
        ))}
      </div>

      {/* STEP 6: Actual form (seedha page par, modal nahi) */}
      <div className="mt-6 border border-gray-200 bg-white p-4 text-[#1c1f22] [color-scheme:light] sm:p-6 md:mt-8">
        <BulkOrderForm />
      </div>

      {/* STEP 7: Help bar */}
      <div className="mt-6 flex flex-col items-center justify-between gap-3 bg-[#eeeeee] px-5 py-4 text-sm text-[#1c1f22] sm:flex-row md:mt-8">
        <p className="font-semibold uppercase tracking-wide">
          Need help with a large or custom order?
        </p>
        <div className="flex flex-wrap items-center justify-center gap-5">
          <a
            href="mailto:contact@dcwineandspirits.com"
            className="inline-flex items-center gap-1.5 font-medium text-[#98022e] hover:underline"
          >
            <TbMail size={16} />
            contact@dcwineandspirits.com
          </a>
          <a
            href="tel:+12024598489"
            className="inline-flex items-center gap-1.5 font-medium text-[#98022e] hover:underline"
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