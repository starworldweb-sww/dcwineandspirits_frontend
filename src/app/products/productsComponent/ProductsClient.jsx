// @ts-nocheck
"use client";

import React, { useState } from "react";
import ProductsMain from "./ProductsMain";
import ProductsHeader from "@/app/components/TittleAndBreadcrumb";
import ProductViewTabs from "@/app/components/ProductViewsTabs";
import NewsletterSection from "@/app/components/NewsletterSection";
import { useGetAllProducts } from "@/app/api/hooks/useAllProducts";

const ProductsClient = () => {
  const [sortOption, setSortOption] = useState("");
  const [showNum, setShowNum] = useState(24);
  const [currentPage, setCurrentPage] = useState(1);
  const [layout, setLayout] = useState("list");

  const { data, isLoading, isError } = useGetAllProducts();

  // FIX: Look for 'allbrand' (matching your JSON) and strictly fall back to an array
  const products = data?.allproducts || [];

  return (
    <div>
      <ProductsHeader />
      
      <ProductsMain 
        products={products} 
        isLoading={isLoading} 
        isError={isError}
        layout={layout}
        setLayout={setLayout}
        sortOption={sortOption}
        setSortOption={setSortOption}
        showNum={showNum}
        setShowNum={setShowNum}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
      
      <ProductViewTabs 
        products={products}
      />
      
      <NewsletterSection />
    </div>
  );
}

export default ProductsClient;