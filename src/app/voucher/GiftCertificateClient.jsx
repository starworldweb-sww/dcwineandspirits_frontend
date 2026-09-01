"use client";

import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import ProductsHeader from "@/app/components/TittleAndBreadcrumb";
import AccountSidebar from "@/app/components/AccountSidebar";
import { useUser } from "@/app/api/hooks/useAuth"; // apna actual path daal dena

// --- BRAND ACCENT ---
const ACCENT = "#8c1a3c";

const breadcrumbs = [
  { label: "Account", href: "/account" },
  { label: "Gift Certificate", href: "/voucher" },
];

// --- SHARED INPUT STYLE (LoginClient se same convention) ---
const inputClass =
  "w-full bg-white border border-[#d9d9d9] rounded-[3px] px-3 py-2.5 text-[14px] text-[#333333] placeholder:text-[#9a9a9a] outline-none transition-colors duration-200 focus:border-[#8c1a3c] focus:ring-1 focus:ring-[#8c1a3c]/30";

const themeOptions = [
  { value: "birthday", label: "Birthday" },
  { value: "christmas", label: "Christmas" },
  { value: "general", label: "General" },
];

// --- VALIDATION SCHEMA ---
const validationSchema = Yup.object({
  recipientName: Yup.string().required("Recipient's name is required"),
  recipientEmail: Yup.string()
    .email("Invalid email address")
    .required("Recipient's e-mail is required"),
  yourName: Yup.string().required("Your name is required"),
  yourEmail: Yup.string()
    .email("Invalid email address")
    .required("Your e-mail is required"),
  theme: Yup.string().required("Please select a gift certificate theme"),
  message: Yup.string(),
  amount: Yup.number()
    .typeError("Amount must be a number")
    .min(1, "Amount must be at least 1")
    .required("Amount is required"),
  agree: Yup.boolean().oneOf(
    [true],
    "Please confirm gift certificates are non-refundable",
  ),
});

const GiftCertificateClient = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Real logged-in user ka data — MOCK_USER ki jagah
  const { data: user } = useUser();

  const formik = useFormik({
    initialValues: {
      recipientName: "",
      recipientEmail: "",
      yourName: "",
      yourEmail: "",
      theme: "",
      message: "",
      amount: 1,
      agree: false,
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      // Yaha koi API call nahi hai — sirf mock/fake submit hai.
      setIsSubmitting(true);
      setTimeout(() => {
        toast.success("Gift certificate request submitted! (mock submit)");
        setIsSubmitting(false);
        resetForm({
          values: {
            recipientName: "",
            recipientEmail: "",
            yourName: `${user?.firstname || ""} ${user?.lastname || ""}`.trim(),
            yourEmail: user?.email || "",
            theme: "",
            message: "",
            amount: 1,
            agree: false,
          },
        });
      }, 600);
    },
  });

  // 2. Jab user data aa jaye (API se), tab "Your Name" / "Your e-mail"
  //    fields ko autofill kar do — agar user pehle se kuch type kar chuka
  //    hai to overwrite nahi karenge.
  useEffect(() => {
    if (user) {
      if (!formik.values.yourName) {
        formik.setFieldValue(
          "yourName",
          `${user.firstname || ""} ${user.lastname || ""}`.trim(),
        );
      }
      if (!formik.values.yourEmail) {
        formik.setFieldValue("yourEmail", user.email || "");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const renderError = (field) =>
    formik.touched[field] && formik.errors[field] ? (
      <p className="text-red-600 text-[12px] mt-1">{formik.errors[field]}</p>
    ) : null;

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const errors = formik.errors;
    const hasErrors = Object.keys(errors).length > 0;

    if (hasErrors) {
      const firstErrorMessage = Object.values(errors)[0];
      toast.error(
        firstErrorMessage || "Please fill all required fields correctly",
      );

      const touchedFields = Object.keys(formik.initialValues).reduce(
        (acc, field) => ({ ...acc, [field]: true }),
        {},
      );
      formik.setTouched(touchedFields);
      return;
    }

    formik.handleSubmit(e);
  };

  return (
    <div className="font-['cambriaregular'] text-[#333333] w-full">
      <ProductsHeader
        categoryName="Purchase a Gift Certificate"
        breadcrumbs={breadcrumbs}
      />

      <div className="flex flex-col lg:flex-row lg:items-start lg:gap-6 2xl:gap-8 w-full px-3 lg:px-3 2xl:px-32 mt-10 mb-14">
        {/* Form */}
        <div className="flex-1 min-w-0 w-full">
          <p className="text-[14px] leading-[1.7] font-hind-madurai text-[#444444] mb-8">
            This gift certificate will be emailed to the recipient after your
            order has been paid for.
          </p>

          <form onSubmit={handleFormSubmit} className="flex flex-col gap-5">
            <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] sm:items-center gap-1.5 sm:gap-4">
              <label className="text-[14px] font-hind-madurai text-[#333333]">
                Recipient&apos;s Name <span className="text-red-500">*</span>
              </label>
              <div>
                <input
                  type="text"
                  placeholder="Recipient's Name"
                  {...formik.getFieldProps("recipientName")}
                  className={inputClass}
                />
                {renderError("recipientName")}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] sm:items-center gap-1.5 sm:gap-4">
              <label className="text-[14px] font-hind-madurai text-[#333333]">
                Recipient&apos;s e-mail <span className="text-red-500">*</span>
              </label>
              <div>
                <input
                  type="email"
                  placeholder="Recipient's e-mail"
                  {...formik.getFieldProps("recipientEmail")}
                  className={inputClass}
                />
                {renderError("recipientEmail")}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] sm:items-center gap-1.5 sm:gap-4">
              <label className="text-[14px] font-hind-madurai text-[#333333]">
                Your Name <span className="text-red-500">*</span>
              </label>
              <div>
                <input
                  type="text"
                  placeholder="Your Name"
                  {...formik.getFieldProps("yourName")}
                  className={inputClass}
                />
                {renderError("yourName")}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] sm:items-center gap-1.5 sm:gap-4">
              <label className="text-[14px] font-hind-madurai text-[#333333]">
                Your e-mail <span className="text-red-500">*</span>
              </label>
              <div>
                <input
                  type="email"
                  placeholder="Your e-mail"
                  {...formik.getFieldProps("yourEmail")}
                  className={inputClass}
                />
                {renderError("yourEmail")}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] sm:items-start gap-1.5 sm:gap-4">
              <label className="text-[14px] font-hind-madurai text-[#333333] sm:pt-2.5">
                Gift Certificate Theme <span className="text-red-500">*</span>
              </label>
              <div>
                <div className="flex flex-wrap items-center gap-6 sm:pt-2.5">
                  {themeOptions.map((opt) => (
                    <label
                      key={opt.value}
                      className="flex items-center gap-2 cursor-pointer text-[14px] font-hind-madurai text-[#333333]"
                    >
                      <input
                        type="radio"
                        name="theme"
                        value={opt.value}
                        checked={formik.values.theme === opt.value}
                        onChange={() => formik.setFieldValue("theme", opt.value)}
                        onBlur={() => formik.setFieldTouched("theme", true)}
                        className="w-4 h-4 cursor-pointer"
                        style={{ accentColor: ACCENT }}
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
                {renderError("theme")}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] sm:items-start gap-1.5 sm:gap-4">
              <label className="text-[14px] font-hind-madurai text-[#333333] sm:pt-2.5">
                Message
              </label>
              <div>
                <textarea
                  rows={5}
                  placeholder="Message"
                  {...formik.getFieldProps("message")}
                  className={`${inputClass} resize-y`}
                />
                {renderError("message")}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] sm:items-center gap-1.5 sm:gap-4">
              <label className="text-[14px] font-hind-madurai text-[#333333]">
                Amount
              </label>
              <div>
                <input
                  type="number"
                  min={1}
                  placeholder="Amount"
                  {...formik.getFieldProps("amount")}
                  className={inputClass}
                />
                {renderError("amount")}
              </div>
            </div>

            <div className="flex flex-col items-end gap-1 mt-2">
              <label className="flex items-center gap-2 cursor-pointer text-[14px] font-hind-madurai text-[#333333]">
                I understand that gift certificates are non-refundable.
                <input
                  type="checkbox"
                  checked={formik.values.agree}
                  onChange={(e) =>
                    formik.setFieldValue("agree", e.target.checked)
                  }
                  onBlur={() => formik.setFieldTouched("agree", true)}
                  className="w-4 h-4 cursor-pointer"
                  style={{ accentColor: ACCENT }}
                />
              </label>
              {renderError("agree")}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-black text-white text-[13px] font-hind-madurai font-semibold tracking-[1.5px] uppercase py-3.5 mt-2 transition-colors duration-300 hover:bg-[#1a1a1a] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting..." : "Continue"}
            </button>
          </form>
        </div>

        {/* Right Column: Sidebar */}
        <div className="w-full lg:w-[260px] shrink-0">
          <AccountSidebar />
        </div>
      </div>
    </div>
  );
};

export default GiftCertificateClient;