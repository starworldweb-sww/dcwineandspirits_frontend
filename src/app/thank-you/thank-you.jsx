"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCheckout } from "@/app/api/Hooks/useCheckout";
import { queryKeys } from "@/libs/queryKeys";

const OrderConfirmation = () => {

  const router = useRouter();
  const { loginAsync, queryClient } = useCheckout();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    const handlePostThankYou = async () => {
      const checkoutType = sessionStorage.getItem('checkoutType');
      const userEmail = sessionStorage.getItem('userEmail');
      const userPassword = sessionStorage.getItem('userPassword');
      const redirectPath = sessionStorage.getItem('redirectAfterThankYou');

      if (checkoutType === 'register' && userEmail && userPassword) {
        setIsLoggingIn(true);
        try {
          // Try logging in (the user should be created by the webhook by now)
          // Retry a few times in case the webhook is still processing
          let attempts = 0;
          let loginResult = null;
          while (attempts < 5 && !loginResult) {
            try {
              loginResult = await loginAsync({
                email: userEmail,
                password: userPassword,
              });
            } catch (err) {
              attempts++;
              // Wait a second before retrying
              await new Promise(resolve => setTimeout(resolve, 1000));
            }
          }

          if (loginResult) {
            queryClient.setQueryData([queryKeys.PROFILE], loginResult?.data);
            queryClient.invalidateQueries({ queryKey: [queryKeys.PROFILE] });
            queryClient.invalidateQueries({ queryKey: [queryKeys.ADDRESSES] });
            router.refresh();
          }

          // Clear the checkout data from session storage
          sessionStorage.removeItem('checkoutType');
          sessionStorage.removeItem('userEmail');
          sessionStorage.removeItem('userPassword');
          sessionStorage.removeItem('orderId');
        } catch (loginErr) {
          console.error("Error logging in after checkout:", loginErr);
        } finally {
          setIsLoggingIn(false);
        }
      }

      if (redirectPath) {
        const timer = setTimeout(() => {
          sessionStorage.removeItem('redirectAfterThankYou');
          router.push(redirectPath);
        }, 3000);

        return () => clearTimeout(timer);
      }
    };

    handlePostThankYou();
  }, []);

  return (
    <div className="py-5 px-5 bg-[#eeeeee] flex items-center justify-center font-['cambriaregular']">
      <div className="bg-white max-w-[600px] w-full mx-auto shadow-md px-10 py-5 flex flex-col items-center text-center">

        {/* Check Icon */}
        <div className="mb-2">
          <CheckCircle size={64} className="text-[#b8922a]" strokeWidth={1.5} />
        </div>

        {/* Thank You */}
        <h1 className="text-[28px] md:text-[34px] font-bold text-[#303841] uppercase tracking-widest mb-3">
          Thank You!
        </h1>

        {/* Gold Divider */}
        <div className="w-16 h-[1px] bg-[#b8922a] mb-6" />

        {/* Message */}
        <p className="text-[16px] text-[#555] leading-[28px] mb-2">
          Your order has been successfully placed.
        </p>
        <p className="text-[15px] text-[#888] leading-[26px] mb-10">
          We'll send you a confirmation email shortly. Thank you for shopping with Wine & Champagne Gifts.
        </p>

        {isLoggingIn && (
          <div className="mb-6 flex items-center gap-2 text-[14px] text-[#555]">
            <Loader2 size={20} className="animate-spin text-[#b8922a]" />
            Logging you in...
          </div>
        )}

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <Link
            href="/"
            className="bg-black text-white text-[13px] uppercase tracking-widest px-8 py-3 hover:bg-[#b8922a] transition-colors duration-200"
          >
            Continue Shopping
          </Link>
          <Link
            href="/account/"
            className="border border-black text-black text-[13px] uppercase tracking-widest px-8 py-3 hover:bg-black hover:text-white transition-colors duration-200"
          >
            My Account
          </Link>
        </div>

      </div>
    </div>
  );
};

export default OrderConfirmation;