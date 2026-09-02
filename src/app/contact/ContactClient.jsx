"use client";

import React, { useState } from "react";
import { MapPin, Phone, Mail } from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import ProductsHeader from "@/app/components/TittleAndBreadcrumb";

// --- BRAND ACCENT ---
const ACCENT = "#8c1a3c";

const breadcrumbs = [
  
  { label: "Contact Us", href: "/contact" },
];

// --- SHARED INPUT STYLE ---
const inputClass =
  "w-full bg-white border border-[#d9d9d9] rounded-[3px] px-4 py-3 text-[14px] text-[#333333] placeholder:text-[#9a9a9a] outline-none transition-colors duration-200 focus:border-[#8c1a3c] focus:ring-1 focus:ring-[#8c1a3c]/30";

// --- VALIDATION SCHEMA ---
const validationSchema = Yup.object({
  name: Yup.string().required("Your name is required"),
  email: Yup.string().email("Invalid email address").required("Your email is required"),
  phone: Yup.string().required("Phone number is required"),
  message: Yup.string().required("Message is required"),
  agree: Yup.boolean().oneOf([true], "You must agree to the Terms & Conditions"),
});

const ContactClient = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
      agree: false,
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      // 🔹 Yahan koi API call nahi hai — sirf local handling.
      // Jab backend ready ho jaye, is block mein apna mutation/fetch call laga dena.
      try {
        setIsSubmitting(true);
        

        toast.success("Your message has been sent successfully!");
        resetForm();
      } catch (error) {
        toast.error("Something went wrong. Please try again.");
      } finally {
        setIsSubmitting(false);
        setSubmitting(false);
      }
    },
  });

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
      toast.error(firstErrorMessage || "Please fill all required fields correctly");

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
      <ProductsHeader categoryName="Contact Us" breadcrumbs={breadcrumbs} />

      <div className="flex flex-col lg:flex-row lg:items-start lg:gap-10 2xl:gap-16 w-full px-3 lg:px-3 2xl:px-32 py-12">
        {/* Left Column: Contact Info */}
        <div className="w-full lg:w-[360px] shrink-0 flex flex-col gap-10 mb-10 lg:mb-0">
          <div className="flex items-start gap-4">
            <span className="flex items-center justify-center w-14 h-14 rounded-full border border-[#333333] shrink-0">
              <MapPin size={22} strokeWidth={1.5} />
            </span>
            <div>
              <h3 className="text-[19px] font-hind-madurai font-semibold text-[#333333] mb-1">
                Locations
              </h3>
              <p className="text-[14px] font-hind-madurai text-[#666666] leading-[1.6]">
                Sterling, VA 20166
                <br />
                Washington D.C. 20008
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <span className="flex items-center justify-center w-14 h-14 rounded-full border border-[#333333] shrink-0">
              <Phone size={22} strokeWidth={1.5} />
            </span>
            <div>
              <h3 className="text-[19px] font-hind-madurai font-semibold text-[#333333] mb-1">
                Call Us
              </h3>
              <p className="text-[14px] font-hind-madurai text-[#666666]">
                Tel: (202) 459-8489
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <span className="flex items-center justify-center w-14 h-14 rounded-full border border-[#333333] shrink-0">
              <Mail size={22} strokeWidth={1.5} />
            </span>
            <div>
              <h3 className="text-[19px] font-hind-madurai font-semibold text-[#333333] mb-1">
                Get Quotation
              </h3>
              <p className="text-[14px] font-hind-madurai text-[#666666]">
                contact@dcwineandspirits.com
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div className="flex-1 min-w-0 w-full">
          <h2 className="text-[24px] font-hind-madurai font-semibold text-[#333333] pb-3 mb-8 border-b border-[#333333] inline-block">
            Leave us a message
          </h2>

          <form onSubmit={handleFormSubmit} className="flex flex-col gap-6">
            <div>
              <label className="text-[14px] font-hind-madurai text-[#333333] mb-1.5 block">
                Your Name <span style={{ color: ACCENT }}>*</span>
              </label>
              <input
                type="text"
                placeholder="Your Name"
                {...formik.getFieldProps("name")}
                className={inputClass}
              />
              {renderError("name")}
            </div>

            <div>
              <label className="text-[14px] font-hind-madurai text-[#333333] mb-1.5 block">
                Your Email <span style={{ color: ACCENT }}>*</span>
              </label>
              <input
                type="email"
                placeholder="Your Email"
                {...formik.getFieldProps("email")}
                className={inputClass}
              />
              {renderError("email")}
            </div>

            <div>
              <label className="text-[14px] font-hind-madurai text-[#333333] mb-1.5 block">
                Phone <span style={{ color: ACCENT }}>*</span>
              </label>
              <input
                type="text"
                placeholder="Phone Number"
                {...formik.getFieldProps("phone")}
                className={inputClass}
              />
              {renderError("phone")}
            </div>

            <div>
              <label className="text-[14px] font-hind-madurai text-[#333333] mb-1.5 block">
                Message <span style={{ color: ACCENT }}>*</span>
              </label>
              <textarea
                rows={6}
                placeholder="Message"
                {...formik.getFieldProps("message")}
                className={`${inputClass} resize-none`}
              />
              {renderError("message")}
            </div>

            <div>
              <label className="flex items-center gap-2 text-[14px] font-hind-madurai text-[#333333] cursor-pointer">
                <input
                  type="checkbox"
                  checked={formik.values.agree}
                  onChange={(e) => formik.setFieldValue("agree", e.target.checked)}
                  className="w-4 h-4 accent-[#8c1a3c] cursor-pointer"
                />
                <span>
                  I have read and agree to the{" "}
                  <a
                    href="/terms/"
                    className="underline hover:opacity-80"
                    style={{ color: ACCENT }}
                  >
                    Terms &amp; Conditions
                  </a>
                  .
                </span>
              </label>
              {renderError("agree")}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto sm:px-16 bg-black text-white text-[13px] font-hind-madurai font-semibold tracking-[1.5px] uppercase py-3.5 transition-colors duration-300 hover:bg-[#1a1a1a] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Sending..." : "Submit"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactClient;