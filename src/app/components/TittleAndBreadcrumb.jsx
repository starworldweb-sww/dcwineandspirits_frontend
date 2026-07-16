import { Sumana } from "next/font/google";
import React from "react";
import Breadcrumbs from "./navcomponents/Breadcrumbs";

// Sumana font - sirf category/product title heading ke liye
const sumana = Sumana({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
});

// 1. Added breadcrumbs to the props
const ProductsHeader = ({ categoryName = "", breadcrumbs = [] }) => {
  return (
    <>
      {/* Top border strip - screenshot mein sabse upar ye thin line thi */}
      <div className="w-full h-[2px] bg-[#c28293]" />

      <div className="w-full bg-[#eeeeee] pt-3 px-3 2xl:px-20 text-center flex flex-col items-center">
        <h1
          className={`${sumana.className} block w-full max-w-[1400px] text-[#303841] text-[22px] md:text-[26px] font-bold leading-[31.2px] tracking-[1px] text-center capitalize transition-all duration-300 mb-2`}
        >
          Product
        </h1>

        {/* Gold divider centered */}
        <div className="w-32 h-[0.5px] bg-[#98022e] mx-auto" />

        <div className="w-full mt-1 flex justify-center pb-2">
          {/* 2. Passed the breadcrumbs prop down to the Breadcrumbs component */}
          <Breadcrumbs breadcrumbs={breadcrumbs} />
        </div>
      </div>
      
    </>
  );
};

export default ProductsHeader;