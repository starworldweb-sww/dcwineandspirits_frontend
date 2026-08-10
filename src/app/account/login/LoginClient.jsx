"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronRight, Eye, EyeOff } from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import ProductsHeader from "@/app/components/TittleAndBreadcrumb";
import { useLogin } from "@/app/api/hooks/useAuth"; // apna actual path daal dena
import AccountClient from "../AccountClient";
import AccountSidebar from "@/app/components/AccountSidebar";

// --- BRAND ACCENT ---
const ACCENT = "#8c1a3c";

const sidebarLinks = [
  { href: "/account", label: "My Account" },
  { href: "/account/address", label: "Address Book" },
  { href: "/account/wishlist", label: "Wishlist" },
  { href: "/account/order", label: "Order History" },
  { href: "/account/transactions", label: "Transactions" },
];

const breadcrumbs = [
  { label: "Home", href: "/" },
  { label: "Account", href: "/account" },
  { label: "Login", href: "/account/login" },
];

// --- SHARED INPUT STYLE ---
const inputClass =
  "w-full bg-white border border-[#d9d9d9] rounded-[3px] px-3 py-2.5 text-[14px] text-[#333333] placeholder:text-[#9a9a9a] outline-none transition-colors duration-200 focus:border-[#8c1a3c] focus:ring-1 focus:ring-[#8c1a3c]/30";

// --- VALIDATION SCHEMA ---
const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const LoginClient = () => {
  const [showPassword, setShowPassword] = useState(false);
  const loginMutation = useLogin();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await loginMutation.mutateAsync(values);
        // success toast + redirect already useLogin hook ke andar ho raha hai
      } catch (error) {
        toast.error(error?.message || "Invalid email or password");
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
      <ProductsHeader categoryName="Account Login" breadcrumbs={breadcrumbs} />

      <div className="flex flex-col lg:flex-row lg:items-start lg:gap-6 2xl:gap-8 w-full px-3 lg:px-3 2xl:px-32 mt-10 mb-14">
        {/* New Customer */}
        <div className="flex-1 min-w-0 w-full bg-[#eeeeee] rounded-[4px] p-6 md:p-8">
          <h2 className="text-[20px] font-hind-madurai font-semibold text-[#333333] pb-3 mb-4 border-b border-[#333333] inline-block">
            New Customer
          </h2>
          <p className="text-[14px] leading-[1.7] font-hind-madurai text-[#444444] mb-8">
            By creating an account you will be able to shop faster, be up to
            date on an order&apos;s status, and keep track of the orders you
            have previously made.
          </p>
          <Link href="/account/register">
            <button className="w-full bg-black text-white text-[13px] font-hind-madurai font-semibold tracking-[1.5px] uppercase py-3.5 transition-colors duration-300 hover:bg-[#1a1a1a] cursor-pointer">
              Continue
            </button>
          </Link>
        </div>

        {/* Returning Customer */}
        <div className="flex-1 min-w-0 w-full bg-[#eeeeee] rounded-[4px] p-6 md:p-8">
          <h2 className="text-[20px] font-hind-madurai font-semibold text-[#333333] pb-3 mb-5 border-b border-[#333333] inline-block">
            Returning Customer
          </h2>

          <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] sm:items-center gap-1.5 sm:gap-4">
              <label className="text-[14px] font-hind-madurai text-[#333333]">
                E-Mail Address
              </label>
              <div>
                <input
                  type="email"
                  placeholder="E-Mail Address"
                  {...formik.getFieldProps("email")}
                  className={inputClass}
                />
                {renderError("email")}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] sm:items-center gap-1.5 sm:gap-4">
              <label className="text-[14px] font-hind-madurai text-[#333333]">
                Password
              </label>
              <div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    {...formik.getFieldProps("password")}
                    className={`${inputClass} pr-10`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#8c1a3c] transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {renderError("password")}
              </div>
            </div>

            <Link
              href="/account/forgotten-password"
              className="text-[13.5px] font-hind-madurai transition-opacity duration-200 hover:opacity-80 -mt-1 cursor-pointer"
              style={{ color: ACCENT }}
            >
              Forgotten Password
            </Link>

            <button
              type="submit"
              disabled={formik.isSubmitting || loginMutation.isPending}
              className="w-full bg-black text-white text-[13px] font-hind-madurai font-semibold tracking-[1.5px] uppercase py-3.5 mt-3 transition-colors duration-300 hover:bg-[#1a1a1a] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loginMutation.isPending ? "Logging in..." : "Login"}
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

export default LoginClient;
