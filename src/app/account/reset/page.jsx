"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import ProductsHeader from "@/app/components/TittleAndBreadcrumb";
import { useResetPassword } from "@/app/api/hooks/useAuth"; // apna actual path daal dena

// --- BRAND ACCENT ---
const ACCENT = "#8c1a3c";

const breadcrumbs = [
  { label: "Home", href: "/" },
  { label: "Account", href: "/account" },
  { label: "Reset Password", href: "/account/reset" },
];

// --- SHARED INPUT STYLE ---
const inputClass =
  "w-full bg-white border border-[#d9d9d9] rounded-[3px] px-3 py-2.5 text-[14px] text-[#333333] placeholder:text-[#9a9a9a] outline-none transition-colors duration-200 focus:border-[#8c1a3c] focus:ring-1 focus:ring-[#8c1a3c]/30";

// 1. Actual form ek alag component mein rakha hai kyunki useSearchParams ko Suspense boundary chahiye (Next.js requirement)
const ResetPasswordForm = () => {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [values, setValues] = useState({
    new_password: "",
    confirm_password: "",
  });
  const [errors, setErrors] = useState({});

  const resetPasswordMutation = useResetPassword();

  // 2. Live match check - jaise hi user confirm password type karta hai, turant pata chal jaye
  const passwordsMatch =
    values.confirm_password.length > 0 &&
    values.new_password === values.confirm_password;
  const passwordsMismatch =
    values.confirm_password.length > 0 &&
    values.new_password !== values.confirm_password;

  // 3. Basic validation - password length + match check (submit ke time final check)
  const validate = () => {
    const newErrors = {};

    if (!values.new_password) {
      newErrors.new_password = "New password is required";
    } else if (values.new_password.length < 6) {
      newErrors.new_password = "Password must be at least 6 characters";
    }

    if (!values.confirm_password) {
      newErrors.confirm_password = "Please confirm your password";
    } else if (values.new_password !== values.confirm_password) {
      newErrors.confirm_password = "Passwords do not match";
    }

    return newErrors;
  };

  const handleChange = (field) => (e) => {
    setValues((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 4. Code hi nahi hai URL mein toh aage badhne ka koi matlab nahi
    if (!code) {
      toast.error("Invalid or expired reset link");
      return;
    }

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error(Object.values(validationErrors)[0]);
      return;
    }

    try {
      await resetPasswordMutation.mutateAsync({
        code,
        new_password: values.new_password,
      });
      // success toast + redirect already useResetPassword hook ke andar ho raha hai
      setValues({ new_password: "", confirm_password: "" });
    } catch (err) {
      toast.error(err?.message || err?.error || "Something went wrong, please try again");
    }
  };

  return (
    <div className="font-['cambriaregular'] text-[#333333] w-full">
      <ProductsHeader categoryName="Reset Password" breadcrumbs={breadcrumbs} />

      <div className="flex flex-col lg:flex-row lg:items-start lg:gap-6 2xl:gap-8 w-full px-3 lg:px-3 2xl:px-32 mt-10 mb-14">
        <div className="flex-1 min-w-0 w-full">
          <legend className="text-[20px] w-fit font-hind-madurai font-semibold text-[#333333] pb-1 mb-6 border-b border-[#8c1a3c] inline-block">
            Reset Password
          </legend>

          {/* 5. Agar code hi nahi mila URL mein, toh form ke bajaye seedha error message dikhao */}
          {!code ? (
            <div className="max-w-[560px]">
              <p className="text-[14px] leading-[1.7] font-hind-madurai text-red-600 mb-6">
                This password reset link is invalid or has expired. Please
                request a new one.
              </p>
              <Link href="/account/forgotten-password">
                <button
                  type="button"
                  className="w-full sm:w-[220px] bg-black text-white text-[13px] font-hind-madurai font-semibold tracking-[1.5px] uppercase py-3.5 transition-colors duration-300 hover:bg-[#1a1a1a] cursor-pointer"
                >
                  Request New Link
                </button>
              </Link>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-5 max-w-[560px]"
            >
              <div>
                <label className="block text-[14px] font-hind-madurai text-[#333333] mb-1.5">
                  New Password <span style={{ color: ACCENT }}>*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={values.new_password}
                    onChange={handleChange("new_password")}
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
                {errors.new_password && (
                  <p className="text-red-600 text-[12px] mt-1">
                    {errors.new_password}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-[14px] font-hind-madurai text-[#333333] mb-1.5">
                  Confirm New Password <span style={{ color: ACCENT }}>*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Password Confirm"
                    value={values.confirm_password}
                    onChange={handleChange("confirm_password")}
                    className={`${inputClass} pr-10 ${
                      passwordsMismatch
                        ? "border-red-400 focus:border-red-400 focus:ring-red-200"
                        : passwordsMatch
                        ? "border-green-400 focus:border-green-400 focus:ring-green-200"
                        : ""
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#8c1a3c] transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>
                {/* 6. Live match/mismatch feedback text */}
                {errors.confirm_password ? (
                  <p className="text-red-600 text-[12px] mt-1">
                    {errors.confirm_password}
                  </p>
                ) : passwordsMismatch ? (
                  <p className="text-red-600 text-[12px] mt-1">
                    Passwords do not match
                  </p>
                ) : passwordsMatch ? (
                  <p className="text-green-600 text-[12px] mt-1">
                    Passwords match
                  </p>
                ) : null}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-2">
                <Link href="/account/login" className="w-full sm:w-auto">
                  <button
                    type="button"
                    className="w-full sm:w-[180px] bg-black text-white text-[13px] font-hind-madurai font-semibold tracking-[1.5px] uppercase py-3.5 transition-colors duration-300 hover:bg-[#1a1a1a] cursor-pointer"
                  >
                    Back
                  </button>
                </Link>

                <button
                  type="submit"
                  disabled={resetPasswordMutation.isPending}
                  className="w-full sm:w-[180px] bg-black text-white text-[13px] font-hind-madurai font-semibold tracking-[1.5px] uppercase py-3.5 transition-colors duration-300 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed hover:bg-[#98022e] hover:rounded-xl"
                >
                  {resetPasswordMutation.isPending
                    ? "Saving..."
                    : "Continue"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};


const Page = () => {
  return (
    <Suspense fallback={<div className="w-full py-20 text-center">Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
};

export default Page;