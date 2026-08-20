"use client";

import React from "react";
import Link from "next/link";
import ProductsHeader from "../components/TittleAndBreadcrumb";

const ReturnPolicyClient = () => {
  return (
    <main className="text-[#333333] select-none bg-white min-h-screen flex flex-col w-full font-hind-madurai">
      {/* 1. HEADER WIDGET: Same pattern as other pages */}
      <div className="w-full">
        <ProductsHeader categoryName="Return Policy" />
      </div>

      {/* 2. PAGE CONTENT */}
      <div className="w-full max-w-[1400px] mx-auto px-4 md:px-8 2xl:px-12 py-10 md:py-14">
        <div className="space-y-5 text-[15px] md:text-[16px] leading-[1.75] text-[#333333] normal-case">
          <p>
            DCWINEANDSPIRITS.COM and its stores are committed to making your
            shopping experience a pleasant one. If you are not satisfied with
            your order, please let us know and we will work with you to make
            the situation right.
          </p>

          <h2 className="font-serif text-[20px] md:text-[24px] font-bold text-[#333333] text-center py-2">
            Return &amp; Refund Policy
          </h2>

          <p>
            Shipping returns are determined on a per order basis. Refunds
            will be provided for the products only and not for the shipping
            costs unless it was an error on our part. There is a 15%
            restocking fee.
          </p>

          <p>
            Unopened and undamaged bottles of wine and liquor can be returned
            within two weeks of the purchase date for a refund, with receipt.
            For bad bottles, please retain the bottle and the receipt for
            returns. We cannot accept any returns on beer or any items that
            have been chilled.
          </p>

          <p>
            For any query regarding a refund or a return item, please contact
            us at{" "}
            <a href="tel:2024598489" className="text-[#98022e]">
              202-459 8489
            </a>
            , or{" "}
            <a
              href="mailto:contact@dcwineandspirits.com"
              className="text-[#98022e]"
            >
              contact@dcwineandspirits.com
            </a>
            .
          </p>

          <p>
            Note: Our standard return policy allows you to request a return
            up to 90 days from your purchase date.{" "}
            <Link href="/terms" className="text-[#98022e]">
              Terms and conditions
            </Link>{" "}
            apply.
          </p>
        </div>
      </div>
    </main>
  );
};

export default ReturnPolicyClient;