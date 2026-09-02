"use client";
import React from "react";
import ProductMain from "./ProductMain";
import RecommendedProducts from "./RecommendedProducts";
import DescriptionAndReview from "./DescriptionAndReview";
import ProductViewTabs from "@/app/components/ProductViewsTabs";
import { useGetSingleProductDetails } from "@/app/api/hooks/useAllProducts";

const ProductClient = ({ slug }) => {
  const { data: product, isLoading, isError } = useGetSingleProductDetails(slug);

  

  if (isLoading) {
    return (
      <div className="w-full py-20 text-center text-gray-500 font-bold text-lg">
        Loading product...
      </div>
    );
  }

  if (isError || !product || product.type === "not_found") {
    return (
      <div className="w-full py-20 text-center text-[#98022e] font-bold text-lg">
        Product not found.
      </div>
    );
  }

  return (
    <>
      <ProductMain product={product} />
      <DescriptionAndReview product={product} />
      <RecommendedProducts product={product} />
    
    </>
  );
};

export default ProductClient;
