"use client";

import React from "react";
import Link from "next/link";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import ProductsHeader from "@/app/components/TittleAndBreadcrumb";
import AccountSidebar from "@/app/components/AccountSidebar"; // apna actual path daal dena
import { useChangePassword } from "@/app/api/hooks/useAuth"; // apna actual path daal dena

// --- BRAND ACCENT ---
const ACCENT = "#8c1a3c";

const breadcrumbs = [
  { label: "Home", href: "/" },
  { label: "Account", href: "/account" },
  { label: "Change Password", href: "/account/password" },
];

// --- SHARED INPUT STYLE ---
const inputClass =
  "w-full bg-white border border-[#d9d9d9] rounded-[3px] px-3 py-2.5 text-[14px] text-[#333333] placeholder:text-[#9a9a9a] outline-none transition-colors duration-200 focus:border-[#8c1a3c] focus:ring-1 focus:ring-[#8c1a3c]/30";

// --- VALIDATION SCHEMA ---
const validationSchema = Yup.object({
  new_password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("New password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("new_password")], "Passwords must match")
    .required("Password confirmation is required"),
});

const PasswordClient = () => {
  const changePasswordMutation = useChangePassword();

  const formik = useFormik({
    initialValues: {
      new_password: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      const { confirmPassword, ...payload } = values;
      try {
        await changePasswordMutation.mutateAsync(payload);
        resetForm();
      } catch (error) {
        // error toast already handled inside useChangePassword
      } finally {
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
        {}
      );
      formik.setTouched(touchedFields);
      return;
    }

    formik.handleSubmit(e);
  };

  return (
    <div className="font-['cambriaregular'] text-[#333333] w-full">
      <ProductsHeader categoryName="Change Password" breadcrumbs={breadcrumbs} />

      <div className="flex flex-col lg:flex-row lg:items-start lg:gap-6 2xl:gap-8 w-full px-3 lg:px-3 2xl:px-32 mt-10 mb-14">
        {/* Password Form */}
        <div className="flex-1 min-w-0 w-full">
          <legend className="text-[20px] w-fit font-hind-madurai font-semibold text-[#333333] pb-1 mb-6 border-b border-[#8c1a3c] inline-block">
            Your Password
          </legend>

          <form onSubmit={handleFormSubmit} className="flex flex-col gap-5 max-w-[560px]">
            <div>
              <label className="block text-[14px] font-hind-madurai text-[#333333] mb-1.5">
                New Password <span style={{ color: ACCENT }}>*</span>
              </label>
              <input
                type="password"
                placeholder="Password"
                {...formik.getFieldProps("new_password")}
                className={inputClass}
              />
              {renderError("new_password")}
            </div>

            <div>
              <label className="block text-[14px] font-hind-madurai text-[#333333] mb-1.5">
                Confirm New Password <span style={{ color: ACCENT }}>*</span>
              </label>
              <input
                type="password"
                placeholder="Password Confirm"
                {...formik.getFieldProps("confirmPassword")}
                className={inputClass}
              />
              {renderError("confirmPassword")}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-2">
              <Link href="/account" className="w-full sm:w-auto">
                <button
                  type="button"
                  className="w-full sm:w-[180px] bg-black text-white text-[13px] font-hind-madurai font-semibold tracking-[1.5px] uppercase py-3.5 transition-colors duration-300 hover:bg-[#1a1a1a] cursor-pointer"
                >
                  Back
                </button>
              </Link>

              <button
                type="submit"
                disabled={formik.isSubmitting || changePasswordMutation.isPending}
                className="w-full sm:w-[180px] bg-black text-white text-[13px] font-hind-madurai font-semibold tracking-[1.5px] uppercase py-3.5 transition-colors duration-300  cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed hover:bg-[#98022e] hover:rounded-xl"
              >
                {changePasswordMutation.isPending ? "Saving..." : "Continue"}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Sidebar */}
        <AccountSidebar />
      </div>
    </div>
  );
};

export default PasswordClient;