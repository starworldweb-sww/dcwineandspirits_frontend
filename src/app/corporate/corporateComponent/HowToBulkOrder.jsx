"use client";

import { useEffect, useState } from "react";
import { FiDownload, FiMail, FiInfo, FiX, FiSend } from "react-icons/fi";
import { TbFileDownload, TbClipboardText, TbSend } from "react-icons/tb";
import BulkSubmitPopUp from "./BulkSumbitPopUp";

const MAROON = "#98022e";
const GOLD = "#c99000";

const EMAIL = "contact@dcwineandspirits.com";

// Steps data: edit text here only
const STEPS = [
  {
    title: "Download the Form",
    description: "Download our bulk order form (Excel file).",
    icon: TbFileDownload,
    info: {
      title: "Download the Form",
      intro: "Download our bulk order form, which is an Excel file.",
      list: [],
      note: "Open it and fill the details.",
    },
    action: {
      type: "download",
      href: "/bulk-order-form.xlsx",
      fileName: "bulk_order_form.xlsx",
      label: "Download bulk order form",
      buttonText: "Download Form",
    },
  },
  {
    title: "Fill in the Details",
    description: "Add product names, quantities and delivery address.",
    icon: TbClipboardText,
    info: {
      title: "Fill in the Details",
      intro: "Fill in the following details in the form:",
      list: [
        "Your name",
        "Company name & address",
        "Product code / name",
        "Recipient name",
        "Recipient address",
        "Remarks and instructions (optional)",
        "All the other required fields",
      ],
      note: "",
    },
  },
  {
    title: "Submit the Form",
    description:
      "Email the completed form to us, or upload it here, and our team will contact you.",
    icon: TbSend,
    info: {
      title: "Submit the Form",
      intro: `Email the filled form to ${EMAIL}, or submit it using the Submit Bulk Order Form button on this page.`,
      list: [],
      note: "Our team will contact you after reviewing your order.",
    },
    action: {
      type: "email",
      href: `mailto:${EMAIL}`,
      label: "Email the completed form",
      buttonText: "Email Us",
    },
    // Optional second button that opens the popup
    popupButton: {
      label: "Submit the completed form here",
      buttonText: "Submit Here",
    },
  },
];

// Small round icon button (info)
const iconBtnClass =
  "inline-flex h-8 w-8 items-center justify-center rounded-full border text-[#98022e] no-underline transition-colors duration-300 hover:bg-[#98022e] hover:text-white cursor-pointer bg-transparent p-0";

// Text buttons (maroon bg is set inline)
const textBtnBase =
  "inline-flex items-center justify-center gap-1.5 whitespace-nowrap border-0 px-4 py-2 text-xs font-semibold tracking-wide no-underline transition-colors cursor-pointer";
const emailBtnClass = `${textBtnBase} text-white hover:bg-[#7a0225]`;
const submitBtnClass = `${textBtnBase} bg-[#d1d1d1] text-black hover:bg-[#c2c2c2]`;

export default function HowToBulkOrder() {
  // Index of the step whose modal is open (null = closed)
  const [openInfo, setOpenInfo] = useState(null);
  const [showBulkPopup, setShowBulkPopup] = useState(false);

  // While modal is open: close on Escape and lock page scroll
  useEffect(() => {
    if (openInfo === null) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") setOpenInfo(null);
    };

    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    const previousOverflow = document.body.style.overflow;
    const previousPaddingRight = document.body.style.paddingRight;

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
    };
  }, [openInfo]);

  const openStep = openInfo !== null ? STEPS[openInfo] : null;
  const activeInfo = openStep ? openStep.info : null;
  const modalAction = openStep ? openStep.action : null;
  const modalPopupButton = openStep ? openStep.popupButton : null;

  return (
    <section className="bg-[#eeeeee] py-10 md:py-14 px-3 2xl:px-32 font-hind-madurai">
      <style>{`
        @keyframes bulkModalIn {
          0%   { opacity: 0; transform: translateY(12px) scale(0.97); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .bulk-modal { animation: bulkModalIn 0.25s ease-out; }
        @media (prefers-reduced-motion: reduce) {
          .bulk-modal { animation: none; }
        }
      `}</style>

      {/* Heading */}
      <div className="mb-6 md:mb-8">
        <h2 className="font-sarabun text-3xl font-semibold text-[#1c1f22] md:text-[40px]">
          How to Place a Bulk Order
          <span className="ml-1 text-[16px] lg:text-[22px] text-[#98022e]">
            (By excel form)
          </span>
        </h2>
        <div className="mt-3 h-[3px] w-20" style={{ backgroundColor: MAROON }} />
      </div>

      {/* Step cards */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-5">
        {STEPS.map((step, index) => {
          const Icon = step.icon;

          return (
            <div
              key={step.title}
              className="flex h-full flex-col border border-gray-200 bg-white p-4"
            >
              <div className="flex h-24 items-center justify-center border border-gray-200 bg-white text-[#98022e]">
                <Icon size={40} />
              </div>

              <p className="mt-4 text-lg font-bold text-[#98022e]">
                Step {index + 1}
              </p>

              <h3 className="mt-1 text-[15px] font-medium uppercase tracking-wide text-[#1c1f22]">
                {step.title}
              </h3>

              <p className="mt-1.5 text-sm leading-relaxed text-gray-500">
                {step.description}
              </p>

              {/* Buttons row (mt-auto keeps it at the bottom) */}
              <div className="mt-auto flex flex-wrap items-center gap-2 pt-4">
                {step.action && (
                  <a
                    href={step.action.href}
                    {...(step.action.type === "download"
                      ? { download: step.action.fileName }
                      : {})}
                    aria-label={step.action.label}
                    title={step.action.label}
                    className={emailBtnClass}
                    style={{ backgroundColor: MAROON }}
                  >
                    {step.action.type === "download" ? (
                      <FiDownload size={14} />
                    ) : (
                      <FiMail size={14} />
                    )}
                    {step.action.buttonText}
                  </a>
                )}

                {step.popupButton && (
                  <button
                    type="button"
                    onClick={() => setShowBulkPopup(true)}
                    aria-label={step.popupButton.label}
                    title={step.popupButton.label}
                    className={submitBtnClass}
                  >
                    <FiSend size={14} />
                    {step.popupButton.buttonText}
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setOpenInfo(index)}
                  aria-label={`More info: ${step.title}`}
                  title="More info"
                  className={iconBtnClass}
                  style={{ borderColor: MAROON }}
                >
                  <FiInfo size={15} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Info modal */}
      {activeInfo && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 px-4"
          onClick={() => setOpenInfo(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={activeInfo.title}
            onClick={(e) => e.stopPropagation()}
            className="bulk-modal relative w-full max-w-[480px] rounded-xl bg-white px-6 py-8 shadow-2xl md:px-8"
          >
            <button
              type="button"
              onClick={() => setOpenInfo(null)}
              aria-label="Close"
              className="absolute right-3 top-3 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-0 bg-[#eeeeee] text-[#1c1f22] transition-colors hover:bg-[#98022e] hover:text-white"
            >
              <FiX size={16} />
            </button>

            <h3
              className="mb-3 pr-8 text-xl font-bold text-black md:text-2xl"
              style={{ fontFamily: "'Sumana', serif" }}
            >
              {activeInfo.title}
            </h3>
            <div
              className="mb-4 h-[3px] w-12 rounded-full"
              style={{ backgroundColor: GOLD }}
            />

            <p className="text-sm leading-relaxed text-[#1c1f22] md:text-base">
              {activeInfo.intro}
            </p>

            {activeInfo.list.length > 0 && (
              <ul className="mt-3 flex list-none flex-col gap-2 p-0 text-sm text-[#111] md:text-base">
                {activeInfo.list.map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <span
                      className="h-2 w-2 flex-none rounded-full"
                      style={{ backgroundColor: MAROON }}
                    />
                    {item}
                  </li>
                ))}
              </ul>
            )}

            {activeInfo.note && (
              <p className="mt-4 text-xs leading-relaxed text-[#444] md:text-sm">
                {activeInfo.note}
              </p>
            )}

            {(modalAction || modalPopupButton) && (
              <div className="mt-6 flex flex-wrap items-center gap-3">
                {modalAction && (
                  <a
                    href={modalAction.href}
                    {...(modalAction.type === "download"
                      ? { download: modalAction.fileName }
                      : {})}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold tracking-wide text-white no-underline transition-colors hover:bg-[#7a0225]"
                    style={{ backgroundColor: MAROON }}
                  >
                    {modalAction.type === "download" ? (
                      <FiDownload size={15} />
                    ) : (
                      <FiMail size={15} />
                    )}
                    {modalAction.buttonText}
                  </a>
                )}

                {/* Closes the modal, then opens the popup */}
                {modalPopupButton && (
                  <button
                    type="button"
                    onClick={() => {
                      setOpenInfo(null);
                      setShowBulkPopup(true);
                    }}
                    className="inline-flex cursor-pointer items-center justify-center gap-2 border-0 bg-[#d1d1d1] px-6 py-3 text-sm font-semibold tracking-wide text-black transition-colors hover:bg-[#c2c2c2]"
                  >
                    <FiSend size={15} />
                    {modalPopupButton.buttonText}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bulk order popup */}
      <BulkSubmitPopUp
        open={showBulkPopup}
        onClose={() => setShowBulkPopup(false)}
      />
    </section>
  );
}