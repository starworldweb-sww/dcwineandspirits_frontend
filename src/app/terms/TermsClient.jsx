"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Phone, Mail, ChevronDown, Info } from "lucide-react";
import ProductsHeader from "@/app/components/TittleAndBreadcrumb";

const ACCENT = "#8c1a3c";

const breadcrumbs = [

  { label: "Terms & Conditions", href: "/terms" },
];

// 1. Sections ka data — id har heading ke liye, jump-nav aur accordion dono isi se chalte hain
const sections = [
  {
    id: "age-requirement",
    title: "Age Requirement",
    content: (
      <>
        <p>
          You must be at least 21 years of age to purchase wine or spirits. By placing an order through our website, you are representing yourself to us as at least 21 years of age. We reserve the right to ask for proof of identity before processing an order.
        </p>
        <p>
          An adult (over the age of 21) signature with proof of age verification is required at the time of delivery. Please be aware that someone over the age of 21 must be available to sign for the package. If no one is available at the time of delivery, the package will not be left.
        </p>
        <p>We do not ship wine to PO Boxes or APO addresses.</p>
      </>
    ),
  },
  {
    id: "carrier-delivery-times",
    title: "Carrier and Delivery Times",
    content: (
      <>
        <p>
          We use UPS as our main shipper of alcoholic beverages outside of VA. We use their Ground, Next Day Air, and 2nd Day Air service:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Ground Service - approximately 1-7 business days in transit</li>
          <li>3 Day Select - 3 business days in transit</li>
        </ul>
        <p>
          All orders will be confirmed via e-mail and processed within 2 business days. We will contact you by the end of the next business day if there are any problems with your order. You will be promptly notified by e-mail of any unexpected delays in processing and/or shipping.
        </p>
        <p>
          During times of bad weather (including excessive heat or cold), we recommend using 3 Day Select to avoid spoilage.
        </p>
      </>
    ),
  },
  {
    id: "shipping-notes",
    title: "Shipping Notes",
    content: (
      <>
        <p>
          An adult signature (over the age of 21) with proof of age verification is required for delivery. Any request made to leave a package without the signature will be ignored, and no exceptions will be made.
        </p>
        <p>
          If you are unable to sign for your wine at the time of delivery you can arrange to pick up your package at your local UPS facility. UPS will generally hold a package for 5 business days for will-call pickup.
        </p>
        <p>
          All shipping charges are nonrefundable if packages are returned due to incorrect addresses or unavailable receivers (in both cases UPS will contact the receiver/sender to remedy the situation, it is the responsibility of the receiver to provide the correct shipping address and sign for the package). There will also be a reshipping fee if the package needs to be reshipped or a change of address must be made.
        </p>
      </>
    ),
  },
  {
    id: "delivery-dc-va",
    title: "Delivery within DC & VA",
    content: (
      <p>
        We try to deliver the product the same day as long as it is ordered by 2 PM. We charge $15 to $60 for delivery. An adult (over the age of 21) signature is required for delivery.
      </p>
    ),
  },
  {
    id: "billing-information",
    title: "Billing Information",
    content: (
      <>
        <p>
          Orders placed on this website are not final. Your credit card is not charged automatically. A charge is put on your credit card after the product has been packed and the order is deemed complete.
        </p>
        <p>
          Please note that all credit cards are verified. You must provide a billing address that corresponds to the credit card you are using. If the billing address does not match the credit card, you will be informed and the order will not be processed until we hear from you.
        </p>
      </>
    ),
  },
];

// 2. Top pe quick-glance summary cards — poora paragraph padhe bina key facts mil jayein
const quickFacts = [
  { label: "Minimum Age", value: "21+ with valid ID" },
  { label: "DC & VA Same-Day Fee", value: "$15 – $60" },
  { label: "Order Processing", value: "Within 2 business days" },
  { label: "Signature Required", value: "Yes, adult 21+ only" },
];

const TermsClient = () => {
  // 3. Mobile accordion state — kaunse sections khule hain (Set, taaki multiple ek saath khul sakein)
  const [openSections, setOpenSections] = useState(new Set(["age-requirement"]));

  const toggleSection = (id) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  // 4. Jump-nav click — smooth scroll + us section ko accordion mein bhi khol do (mobile ke liye)
  const handleJumpClick = (id) => {
    setOpenSections((prev) => new Set(prev).add(id));
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="font-['cambriaregular'] text-[#333333] w-full">
      <ProductsHeader categoryName="Terms & Conditions" breadcrumbs={breadcrumbs} />

      <div className="w-full px-3 lg:px-3 2xl:px-32 mt-10 mb-14">
        {/* --- Quick Facts strip --- */}
        {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          {quickFacts.map((fact) => (
            <div
              key={fact.label}
              className="bg-[#eeeeee] rounded-[4px] p-4 border-l-4"
              style={{ borderColor: ACCENT }}
            >
              <p className="text-[11px] font-hind-madurai uppercase tracking-wide text-gray-500 mb-1">
                {fact.label}
              </p>
              <p className="text-[14px] font-hind-madurai font-semibold text-[#333333]">
                {fact.value}
              </p>
            </div>
          ))}
        </div> */}

        <div className="flex flex-col lg:flex-row lg:items-start lg:gap-10 w-full">
          {/* ---- LEFT: Sticky jump-nav (desktop only) ---- */}
          <aside className="hidden lg:block w-[220px] shrink-0 sticky top-24 self-start">
            <p className="text-[12px] font-hind-madurai uppercase tracking-wide text-gray-400 mb-3">
              On this page
            </p>
            <nav className="flex flex-col gap-1">
              {sections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => handleJumpClick(s.id)}
                  className="text-left text-[13.5px] font-hind-madurai text-[#444444] py-1.5 border-l-2 border-transparent pl-3 hover:border-[#8c1a3c] hover:text-[#8c1a3c] transition-colors"
                >
                  {s.title}
                </button>
              ))}
            </nav>
          </aside>

          {/* ---- RIGHT: Content ---- */}
          <div className="flex-1 min-w-0 max-w-3xl">
            {sections.map((section) => {
              const isOpen = openSections.has(section.id);
              return (
                <section
                  key={section.id}
                  id={section.id}
                  className="mb-4 scroll-mt-24"
                >
                  {/* 5. Heading ab clickable button hai — mobile pe accordion, desktop pe bhi kaam karta hai (no harm) */}
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full flex items-center justify-between text-left pb-3 mb-4 border-b border-[#333333]"
                  >
                    <h2 className="text-[16px] font-hind-madurai font-bold tracking-wide text-[#333333] uppercase">
                      {section.title}
                    </h2>
                    <ChevronDown
                      size={18}
                      style={{ color: ACCENT }}
                      className={`shrink-0 transition-transform duration-200 lg:hidden ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* 6. Desktop pe hamesha open, mobile pe accordion state follow karta hai */}
                  <div
                    className={`${isOpen ? "block" : "hidden"} lg:block border-l-4 pl-4 text-[14px] font-hind-madurai text-[#444444] leading-[1.8] space-y-3`}
                    style={{ borderColor: ACCENT }}
                  >
                    {section.content}
                  </div>
                </section>
              );
            })}

            {/* --- Seasonal Note --- */}
            <div className="flex items-start gap-3 bg-[#fff8e6] border border-[#f0d78c] rounded-[4px] p-4 mb-10 mt-8">
              <Info size={18} className="mt-0.5 shrink-0 text-[#a67c00]" />
              <p className="text-[13.5px] font-hind-madurai text-[#5c4a00] leading-[1.7]">
                In the event that there is a seasonal shortage of any item(s), an item(s) of equal or greater value will be replaced.
              </p>
            </div>

            {/* --- Questions / Contact --- */}
            <div className="bg-[#eeeeee] rounded-[4px] p-6 md:p-8">
              <h2 className="text-[18px] font-hind-madurai font-semibold text-[#333333] pb-3 mb-4 border-b border-[#333333] inline-block">
                Questions?
              </h2>
              <p className="text-[14px] font-hind-madurai text-[#444444] mb-4">
                If you have any further questions about our shipping policy, please feel free to{" "}
                <Link href="/contact" style={{ color: ACCENT }} className="underline">
                  contact us
                </Link>
                .
              </p>
              <div className="flex flex-col gap-2.5 text-[13.5px] font-hind-madurai text-[#444444]">
                <div className="flex items-center gap-2">
                  <Phone size={15} style={{ color: ACCENT }} />
                  <a href="tel:2024598489" className="hover:opacity-80">
                    202-459-8489
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={15} style={{ color: ACCENT }} />
                  <a href="mailto:contact@dcwineandspirits.com" className="hover:opacity-80">
                    contact@dcwineandspirits.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsClient;