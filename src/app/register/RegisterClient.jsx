"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, ChevronRight } from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import ProductsHeader from "@/app/components/TittleAndBreadcrumb";
import Modal from "@/app/components/ui/Modal";
import PrivacyPolicyContent from "../components/ui/PrivacyPolicyContent";
import { useRegister } from "../api/hooks/useAuth";


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

  { label: "Account", href: "/account" },
  { label: "Register", href: "/account/register" },
];

// --- SHARED INPUT STYLE (login page jaisa hi) ---
const inputClass =
  "w-full bg-white border border-[#d9d9d9] rounded-[3px] px-3 py-2.5 text-[14px] text-[#333333] placeholder:text-[#9a9a9a] outline-none transition-colors duration-200 focus:border-[#8c1a3c] focus:ring-1 focus:ring-[#8c1a3c]/30";

// --- VALIDATION SCHEMA ---
const validationSchema = Yup.object({
  firstname: Yup.string().max(32, "Max 32 characters allowed").required("First name is required"),
  lastname: Yup.string().required("Last name is required"),
  email: Yup.string().email("Invalid email address").required("Email is required"),
  telephone: Yup.string().required("Telephone is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
  privacyPolicy: Yup.boolean().oneOf([true], "You must accept the privacy policy"),
});

const RegisterClient = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  const registerMutation = useRegister();

  const formik = useFormik({
    initialValues: {
      firstname: "",
      lastname: "",
      email: "",
      telephone: "",
      password: "",
      confirmPassword: "",
      newsletter: "no",
      privacyPolicy: false,
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      // confirmPassword sirf frontend validation ke liye hai — backend ko nahi bhejna
      const { confirmPassword, ...payload } = values;

      try {
        await registerMutation.mutateAsync(payload);
        // success toast + redirect already useRegister hook ke andar ho raha hai
      } catch (error) {
        toast.error(error?.message || "Registration failed. Please try again.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Har field ke error ko dikhane ka common helper
  const renderError = (field) =>
    formik.touched[field] && formik.errors[field] ? (
      <p className="text-red-600 text-[12px] mt-1">{formik.errors[field]}</p>
    ) : null;

  // 👇 Agar form invalid hai (missing/wrong fields), submit pe toast dikhao
  //    aur saare fields ko "touched" mark kar do taaki neeche errors bhi turant dikhein
  const handleFormSubmit = (e) => {
    e.preventDefault();

    const errors = formik.errors;
    const hasErrors = Object.keys(errors).length > 0;

    if (hasErrors) {
      const firstErrorMessage = Object.values(errors)[0];
      toast.error(firstErrorMessage || "Please fill all required fields correctly");

      // sab fields touched mark kar do taaki inline errors bhi dikhein
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
      <ProductsHeader categoryName="Register Account" breadcrumbs={breadcrumbs} />

      <div className="flex flex-col lg:flex-row lg:items-start lg:gap-6 2xl:gap-8 w-full px-3 lg:px-3 2xl:px-32 mt-10 mb-14">
        {/* ================= REGISTER FORM ================= */}
        <div className="flex-1 min-w-0 w-full bg-[#eeeeee] rounded-[4px] p-6 md:p-8">
          <h2 className="text-[20px] font-hind-madurai font-semibold text-[#333333] pb-3 mb-5 border-b border-[#333333] inline-block">
            Create Account
          </h2>

          <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
            {/* First Name */}
            <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] sm:items-center gap-1.5 sm:gap-4">
              <label className="text-[14px] font-hind-madurai text-[#333333]">First Name</label>
              <div>
                <input
                  type="text"
                  placeholder="Enter your first name"
                  {...formik.getFieldProps("firstname")}
                  className={inputClass}
                />
                {renderError("firstname")}
              </div>
            </div>

            {/* Last Name */}
            <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] sm:items-center gap-1.5 sm:gap-4">
              <label className="text-[14px] font-hind-madurai text-[#333333]">Last Name</label>
              <div>
                <input
                  type="text"
                  placeholder="Enter your last name"
                  {...formik.getFieldProps("lastname")}
                  className={inputClass}
                />
                {renderError("lastname")}
              </div>
            </div>

            {/* Email */}
            <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] sm:items-center gap-1.5 sm:gap-4">
              <label className="text-[14px] font-hind-madurai text-[#333333]">E-Mail Address</label>
              <div>
                <input
                  type="email"
                  placeholder="example@domain.com"
                  {...formik.getFieldProps("email")}
                  className={inputClass}
                />
                {renderError("email")}
              </div>
            </div>

            {/* Telephone */}
            <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] sm:items-center gap-1.5 sm:gap-4">
              <label className="text-[14px] font-hind-madurai text-[#333333]">Telephone</label>
              <div>
                <input
                  type="tel"
                  placeholder="e.g. +1 234 567 890"
                  {...formik.getFieldProps("telephone")}
                  className={inputClass}
                />
                {renderError("telephone")}
              </div>
            </div>

            {/* Password */}
            <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] sm:items-center gap-1.5 sm:gap-4">
              <label className="text-[14px] font-hind-madurai text-[#333333]">Password</label>
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

            {/* Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] sm:items-center gap-1.5 sm:gap-4">
              <label className="text-[14px] font-hind-madurai text-[#333333]">Confirm Password</label>
              <div>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Re-enter password"
                    {...formik.getFieldProps("confirmPassword")}
                    className={`${inputClass} pr-10`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#8c1a3c] transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {renderError("confirmPassword")}
              </div>
            </div>

            {/* Newsletter */}
            <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] sm:items-center gap-1.5 sm:gap-4">
              <label className="text-[14px] font-hind-madurai text-[#333333]">Newsletter</label>
              <div className="flex items-center gap-6 text-[14px] font-hind-madurai">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="newsletter"
                    value="yes"
                    checked={formik.values.newsletter === "yes"}
                    onChange={formik.handleChange}
                    className="accent-[#8c1a3c]"
                  />
                  Yes
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="newsletter"
                    value="no"
                    checked={formik.values.newsletter === "no"}
                    onChange={formik.handleChange}
                    className="accent-[#8c1a3c]"
                  />
                  No
                </label>
              </div>
            </div>

            {/* Privacy Policy */}
            <div className="flex items-start gap-2 text-[13px] font-hind-madurai mt-1">
              <input
                type="checkbox"
                {...formik.getFieldProps("privacyPolicy")}
                checked={formik.values.privacyPolicy}
                className="w-4 h-4 mt-0.5 cursor-pointer accent-[#8c1a3c]"
              />
              <label className="cursor-pointer select-none">
                I have read and agree to the{" "}
                <button
                  type="button"
                  onClick={() => setIsPrivacyModalOpen(true)}
                  className="underline font-medium hover:opacity-80 transition-opacity"
                  style={{ color: ACCENT }}
                >
                  Privacy Policy
                </button>
              </label>
            </div>
            {renderError("privacyPolicy")}

            <button
              type="submit"
              disabled={formik.isSubmitting || registerMutation.isPending}
              className="w-full bg-black text-white text-[13px] font-hind-madurai font-semibold tracking-[1.5px] uppercase py-3.5 mt-3 transition-colors duration-300 hover:bg-[#8c1a3c] cursor-pointer flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {registerMutation.isPending ? "Registering..." : "Register"}
            </button>

            <p className="text-[13.5px] font-hind-madurai text-center mt-1">
              Already have an account?{" "}
              <Link href="/account/login" className="underline" style={{ color: ACCENT }}>
                Login here
              </Link>
            </p>
          </form>
        </div>

        {/* ================= SIDEBAR (login page jaisa hi) ================= */}
        <div className="w-full lg:w-[260px] shrink-0">
          <div className="bg-[#eeeeee] rounded-[4px] p-5">
            <ul>
              {sidebarLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-1.5 py-2.5 text-[15px] font-hind-madurai text-[#333333] transition-colors duration-300"
                  >
                    <ChevronRight
                      size={16}
                      className="shrink-0 transition-transform duration-300 group-hover:translate-x-0.5"
                      style={{ color: ACCENT }}
                    />
                    <span className="transition-colors duration-300 group-hover:text-[#8c1a3c]">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ================= PRIVACY POLICY MODAL ================= */}
      <Modal
        open={isPrivacyModalOpen}
        onOpenChange={setIsPrivacyModalOpen}
        title="Privacy Policy"
      >
        <PrivacyPolicyContent />
      </Modal>
    </div>
  );
};

export default RegisterClient;