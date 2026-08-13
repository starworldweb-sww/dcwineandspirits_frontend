"use client";
import React from "react";
import Filters from "./Filters";
import ProductsDynamicMain from "./ProductsDynamicMain";
import { useGetProductBySlugOrId } from "@/app/api/hooks/useAllProducts";
import PhoneHeader from "@/app/components/navcomponents/Phoneheader";
import ProductsHeader from "@/app/components/TittleAndBreadcrumb";

const ProductsDynamicClient = ({ slug }) => {
  const { data: dynamicData, isLoading, isError } = useGetProductBySlugOrId(slug);
 
  if (isLoading) {
    return (
      <div className="w-full py-20 text-center text-gray-500 font-bold text-lg">
        Loading...
      </div>
    );
  }

  if (isError || !dynamicData || dynamicData?.type === "not_found") {
    return (
      <div className="w-full py-20 text-center text-[#98022e] font-bold text-lg">
        Not found.
      </div>
    );
  }

  return (
    <>
    <ProductsHeader categoryName={dynamicData?.product?.name}/>
    <div className='2xl:px-32 flex items-start justify-between gap-6'>
      <Filters data={dynamicData} />
      <ProductsDynamicMain data={dynamicData} />
    </div>
    </>
  );
};

export default ProductsDynamicClient;