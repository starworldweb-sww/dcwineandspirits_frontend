"use client";

import React, { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import ProductsHeader from "@/app/components/TittleAndBreadcrumb";
import AccountSidebar from "@/app/components/AccountSidebar";
import { useForgotPassword } from "@/app/api/hooks/useAuth";


// --- BRAND ACCENT ---
const ACCENT = "#8c1a3c";

const breadcrumbs = [
 
  { label: "Account", href: "/account" },
  { label: "Forgotten Password", href: "/account/forgotten-password" },
];

// --- SHARED INPUT STYLE (login page se same rakha hai consistency ke liye) ---
const inputClass =
  "w-full bg-white border border-[#d9d9d9] rounded-[3px] px-3 py-2.5 text-[14px] text-[#333333] placeholder:text-[#9a9a9a] outline-none transition-colors duration-200 focus:border-[#8c1a3c] focus:ring-1 focus:ring-[#8c1a3c]/30";

const Page = () => {
  // 1. Sirf email field ka simple state
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  // 2. Mutation hook - reset link bhejne ke liye (success par toast + login redirect hook ke andar hi ho raha hai)
  const forgotPasswordMutation = useForgotPassword();

  // 3. Basic email validation
  const validateEmail = (value) => {
    if (!value) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return "Invalid email address";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateEmail(email);
    if (validationError) {
      setError(validationError);
      toast.error(validationError);
      return;
    }

    setError("");

    try {
      await forgotPasswordMutation.mutateAsync(email);
      // success toast + redirect already useForgotPassword hook ke andar ho raha hai
      setEmail("");
    } catch (err) {
      toast.error(err?.message || err?.error || "Something went wrong, please try again");
    }
  };

  return (
    <div className="font-['cambriaregular'] text-[#333333] w-full">
      <ProductsHeader
        categoryName="Forgotten Password"
        breadcrumbs={breadcrumbs}
      />

      <div className="flex flex-col lg:flex-row lg:items-start lg:gap-6 2xl:gap-8 w-full px-3 lg:px-3 2xl:px-32 mt-10 mb-14">
        {/* Forgotten Password Card */}
        <div className="flex-1 min-w-0 w-full bg-[#eeeeee] rounded-[4px] p-6 md:p-8">
          <h2 className="text-[20px] font-hind-madurai font-semibold text-[#333333] pb-3 mb-4 border-b border-[#333333] inline-block">
            Forgotten Password
          </h2>
          <p className="text-[14px] leading-[1.7] font-hind-madurai text-[#444444] mb-8">
            Enter the e-mail address associated with your account and click
            &quot;Send&quot; below. We will send you an e-mail with a link to
            reset your password.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] sm:items-center gap-1.5 sm:gap-4">
              <label className="text-[14px] font-hind-madurai text-[#333333]">
                E-Mail Address
              </label>
              <div>
                <input
                  type="email"
                  placeholder="E-Mail Address"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError("");
                  }}
                  className={inputClass}
                />
                {error && (
                  <p className="text-red-600 text-[12px] mt-1">{error}</p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={forgotPasswordMutation.isPending}
              className="w-full sm:w-auto sm:self-start sm:px-10 bg-black text-white text-[13px] font-hind-madurai font-semibold tracking-[1.5px] uppercase py-3.5 mt-3 transition-colors duration-300 hover:bg-[#1a1a1a] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {forgotPasswordMutation.isPending ? "Sending..." : "Send"}
            </button>

            <Link
              href="/account/login"
              className="text-[13.5px] font-hind-madurai transition-opacity duration-200 hover:opacity-80 -mt-1 cursor-pointer"
              style={{ color: ACCENT }}
            >
              Back to Login
            </Link>
          </form>
        </div>

        {/* Right Column: Sidebar */}
        
      </div>
    </div>
  );
};

export default Page;