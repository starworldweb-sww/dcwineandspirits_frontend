"use client";

import { useEffect, useState } from "react";
import { FiDownload, FiMail, FiInfo, FiX } from "react-icons/fi";

// DC Wine & Spirits brand colours
const MAROON = "#98022e";
const GOLD = "#c99000";

const EMAIL = "contact@dcwineandspirits.com";

// Steps data: change the text here only.
// info = content shown in the modal, action = icon/button for download or email
const STEPS = [
  {
    title: "Download the Form",
    description: "Download our bulk order form (Excel file).",
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
    description: "Upload the completed form and our team will contact you.",
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
  },
];

// Shared style for the small round icon buttons under each step
const iconBtnClass =
  "inline-flex h-8 w-8 items-center justify-center rounded-full border text-[#98022e] no-underline transition-colors duration-300 hover:bg-[#98022e] hover:text-white cursor-pointer bg-transparent p-0";

export default function HowToBulkOrder() {
  // activeStep: 0, 1, 2 = current step | 3 = all steps completed
  const [activeStep, setActiveStep] = useState(0);

  // openInfo: index of the step whose modal is open (null = closed)
  const [openInfo, setOpenInfo] = useState(null);

  // Move to the next step every 2.2 seconds, loop back to 0 at the end
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev >= STEPS.length ? 0 : prev + 1));
    }, 2200);
    return () => clearInterval(timer);
  }, []);

  // While the modal is open:
  // - close on Escape
  // - lock page scroll without layout shift (scrollbar width is compensated with padding)
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

  return (
    <section className="bg-white py-10 md:py-14 px-3 2xl:px-32 font-hind-madurai">
      {/* Animation keyframes for this component */}
      <style>{`
        @keyframes bulkPulse {
          0%   { box-shadow: 0 0 0 0 rgba(201,144,0,0.45); }
          70%  { box-shadow: 0 0 0 14px rgba(201,144,0,0); }
          100% { box-shadow: 0 0 0 0 rgba(201,144,0,0); }
        }
        @keyframes bulkPop {
          0%   { transform: scale(0); }
          60%  { transform: scale(1.25); }
          100% { transform: scale(1); }
        }
        @keyframes bulkModalIn {
          0%   { opacity: 0; transform: translateY(12px) scale(0.97); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .bulk-pulse { animation: bulkPulse 1.6s ease-out infinite; }
        .bulk-pop   { animation: bulkPop 0.4s ease-out; }
        .bulk-modal { animation: bulkModalIn 0.25s ease-out; }
        @media (prefers-reduced-motion: reduce) {
          .bulk-pulse, .bulk-pop, .bulk-modal { animation: none; }
        }
      `}</style>

      {/* Heading */}
      <div className="text-center mb-8 md:mb-10">
        <h2
          className="text-2xl md:text-[32px] font-bold mb-2"
          style={{ fontFamily: "'Sumana', serif", color: MAROON }}
        >
          How to Place a Bulk Order
        </h2>
      </div>

      {/* Stepper wrapper: vertical on mobile, horizontal on desktop */}
      <div className="max-w-[420px] md:max-w-[900px] mx-auto flex flex-col md:flex-row">
        {STEPS.map((step, index) => {
          const isCompleted = index < activeStep;
          const isActive = index === activeStep;
          const isLast = index === STEPS.length - 1;

          return (
            // Single step: circle on the left (mobile) or on top (desktop)
            <div
              key={step.title}
              className="relative flex gap-4 min-h-[96px] md:flex-col md:items-center md:gap-0 md:flex-1 md:min-h-0"
            >
              {/* Circle + vertical line (mobile only) */}
              <div className="flex flex-col items-center">
                <div
                  className={`relative z-10 w-11 h-11 shrink-0 rounded-full flex items-center justify-center text-base font-bold border-2 transition-colors duration-500 ${
                    isActive ? "bulk-pulse" : ""
                  }`}
                  style={{
                    backgroundColor: isCompleted ? MAROON : "#ffffff",
                    borderColor: isCompleted
                      ? MAROON
                      : isActive
                      ? GOLD
                      : "#dddddd",
                    color: isActive ? GOLD : "#aaaaaa",
                  }}
                >
                  {isCompleted ? (
                    // Tick mark with pop animation
                    <svg
                      className="bulk-pop"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>

                {/* Vertical connector line (mobile only) */}
                {!isLast && (
                  <div className="md:hidden relative w-[3px] flex-1 my-1 rounded-full overflow-hidden bg-[#e5e5e5]">
                    <div
                      className="absolute top-0 left-0 w-full transition-all duration-700 ease-in-out"
                      style={{
                        height: isCompleted ? "100%" : "0%",
                        backgroundColor: MAROON,
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Horizontal connector line (desktop only):
                  runs from the center of this circle to the center of the next one */}
              {!isLast && (
                <div className="hidden md:block absolute top-[20px] left-1/2 w-full h-[3px] rounded-full overflow-hidden bg-[#e5e5e5]">
                  <div
                    className="absolute top-0 left-0 h-full transition-all duration-700 ease-in-out"
                    style={{
                      width: isCompleted ? "100%" : "0%",
                      backgroundColor: MAROON,
                    }}
                  />
                </div>
              )}

              {/* Text + icon buttons: left aligned on mobile, centered on desktop */}
              <div className="pt-1.5 pb-6 md:pt-4 md:pb-0 md:px-4 md:w-full md:text-center">
                <h3
                  className="text-lg font-bold leading-tight transition-colors duration-500"
                  style={{
                    fontFamily: "'Sumana', serif",
                    color: isActive || isCompleted ? "#1c1f22" : "#aaaaaa",
                  }}
                >
                  {step.title}
                </h3>

                {/* Fixed min height keeps the icons aligned across all steps */}
                <p
                  className="text-sm mt-0.5 md:min-h-[44px] transition-colors duration-500"
                  style={{ color: isActive ? GOLD : "#888888" }}
                >
                  {step.description}
                </p>

                <div className="mt-2 flex items-center gap-2 md:justify-center">
                  {/* Action icon: download or email */}
                  {step.action && (
                    <a
                      href={step.action.href}
                      {...(step.action.type === "download"
                        ? { download: step.action.fileName }
                        : {})}
                      aria-label={step.action.label}
                      title={step.action.label}
                      className={iconBtnClass}
                      style={{ borderColor: MAROON }}
                    >
                      {step.action.type === "download" ? (
                        <FiDownload size={15} />
                      ) : (
                        <FiMail size={15} />
                      )}
                    </a>
                  )}

                  {/* Info icon: opens the modal */}
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
            </div>
          );
        })}
      </div>

      {/* Info modal: closes on backdrop click, X button or Escape */}
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
            {/* Close button */}
            <button
              type="button"
              onClick={() => setOpenInfo(null)}
              aria-label="Close"
              className="absolute right-3 top-3 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-0 bg-[#eeeeee] text-[#1c1f22] transition-colors hover:bg-[#98022e] hover:text-white"
            >
              <FiX size={16} />
            </button>

            {/* Modal heading + small gold line */}
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

            {/* Intro text */}
            <p className="text-sm leading-relaxed text-[#1c1f22] md:text-base">
              {activeInfo.intro}
            </p>

            {/* Bullet list (only if the step has list items) */}
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

            {/* Small note (only if the step has a note) */}
            {activeInfo.note && (
              <p className="mt-4 text-xs leading-relaxed text-[#444] md:text-sm">
                {activeInfo.note}
              </p>
            )}

            {/* Action button inside the modal (download / email) */}
            {modalAction && (
              <a
                href={modalAction.href}
                {...(modalAction.type === "download"
                  ? { download: modalAction.fileName }
                  : {})}
                className="mt-6 inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold tracking-wide text-white no-underline transition-colors hover:bg-[#7a0225]"
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
          </div>
        </div>
      )}
    </section>
  );
}