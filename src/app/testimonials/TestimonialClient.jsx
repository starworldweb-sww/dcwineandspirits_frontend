import React from "react";
import ProductsHeader from "@/app/components/TittleAndBreadcrumb";
import { Construction } from "lucide-react";

const breadcrumbs = [{ label: "Testimonials", href: "/testimonials" }];

const TestimonialClient = () => {
  return (
    <div className="font-['cambriaregular'] text-[#333333] w-full">
      <ProductsHeader categoryName="Testimonials" breadcrumbs={breadcrumbs} />

      <div className="w-full px-3 lg:px-3 2xl:px-32 py-24 flex flex-col items-center justify-center text-center">
        <Construction size={48} className="text-[#8c1a3c] mb-5" />
        <h2 className="text-[22px] font-hind-madurai font-semibold text-[#333333] mb-2">
          This Page is Under Development
        </h2>
        <p className="text-[14px] font-hind-madurai text-[#666666] max-w-[420px]">
          We're working on bringing customer testimonials here. Please check
          back soon.
        </p>
      </div>
    </div>
  );
};

export default TestimonialClient;