import React from "react";
import ProductMain from "./ProductMain";
import RecommendedProducts from "./RecommendedProducts";
import DescriptionAndReview from "./DescriptionAndReview";
import ProductViewTabs from "@/app/components/ProductViewsTabs";

// 1. Destructure 'product' from the props here
const ProductClient = () => {
  return (
    <>
      <ProductMain />
      <DescriptionAndReview />
      <RecommendedProducts />
      <ProductViewTabs />
    </>
  );
};

export default ProductClient;
