"use client";

import React, { useState, useEffect, useRef } from "react";
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
  "w-full bg-white border border-[#d9d9d9] rounded-[3px] px-3 py-2.5 text-[14px] text-[#333333] placeholder:text-[#9a9a9a] outline-none transition-colors duration-200 focus:border-[#8c1a3c] focus:ring-1 focus:ring-[#8c1a3c]/30 disabled:bg-[#f5f5f5] disabled:cursor-not-allowed";

// 1. Resend cooldown duration (seconds) — chahen toh yahan se change kar sakte ho
const RESEND_COOLDOWN = 45;

const Page = () => {
  // 2. Sirf email field ka simple state
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  // 3. Cooldown timer state — resend spam rokne ke liye
  const [cooldown, setCooldown] = useState(0);

  // 4. Email input pe autofocus ke liye ref
  const emailInputRef = useRef(null);

  // 5. Mutation hook - reset link bhejne ke liye (success par toast + login redirect hook ke andar hi ho raha hai)
  const forgotPasswordMutation = useForgotPassword();

  // 6. Page load hote hi email field pe focus chala jaye
  useEffect(() => {
    emailInputRef.current?.focus();
  }, []);

  // 7. Cooldown countdown — har second 1 kam hota rahega jab tak 0 na ho jaye
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  // 8. Basic email validation
  const validateEmail = (value) => {
    if (!value) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return "Invalid email address";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 9. Agar cooldown chal raha hai toh submit hi mat hone do
    if (cooldown > 0) return;

    // 10. Trim karke validate karo — aage/peeche ke extra spaces na jaayein
    const trimmedEmail = email.trim();
    const validationError = validateEmail(trimmedEmail);
    if (validationError) {
      setError(validationError);
      toast.warning(validationError);
      return;
    }

    setError("");

    try {
      await forgotPasswordMutation.mutateAsync(trimmedEmail);
      // success toast + redirect already useForgotPassword hook ke andar ho raha hai
      setEmail("");
      // 11. Send hote hi cooldown start — taaki turant dobara click na ho paaye
      setCooldown(RESEND_COOLDOWN);
    } catch (err) {
      toast.error(err?.message || err?.error || "Something went wrong, please try again");
    }
  };

  const isSubmitting = forgotPasswordMutation.isPending;
  const isDisabled = isSubmitting || cooldown > 0;

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
                  ref={emailInputRef}
                  type="email"
                  placeholder="E-Mail Address"
                  value={email}
                  disabled={isDisabled}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError("");
                  }}
                  // 12. Blur pe bhi validate kar do — user ko turant pata chal jaye galat format ka
                  onBlur={() => {
                    if (email) {
                      const validationError = validateEmail(email.trim());
                      setError(validationError);
                    }
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
              disabled={isDisabled}
              className="w-full sm:w-auto sm:self-start sm:px-10 bg-black text-white text-[13px] font-hind-madurai font-semibold tracking-[1.5px] uppercase py-3.5 mt-3 transition-colors duration-300 hover:bg-[#1a1a1a] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting
                ? "Sending..."
                : cooldown > 0
                ? `Resend in ${cooldown}s`
                : "Send"}
            </button>

            {/* 13. "Didn't receive it?" hint — sirf cooldown ke dauraan dikhega, matlab email already gaya hai */}
            {cooldown > 0 && (
              <p className="text-[13px] font-hind-madurai text-[#666666] -mt-1">
                Didn&apos;t receive the email? Check your spam folder, or you
                can resend in {cooldown} second{cooldown !== 1 ? "s" : ""}.
              </p>
            )}

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