// @ts-nocheck
"use client";

import React, { useState, useMemo } from "react";
import ProductsMain from "./ProductsMain";
import ProductsHeader from "@/app/components/TittleAndBreadcrumb";
import ProductViewTabs from "@/app/components/ProductViewsTabs";
import { useGetAllProducts } from "@/app/api/hooks/useAllProducts";

const ProductsClient = () => {
  const [sortOption, setSortOption] = useState("");
  const [showNum, setShowNum] = useState(24);
  const [layout, setLayout] = useState("grid");

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetAllProducts(showNum);
  console.log("Fetched Products Data:", data);

  const allProducts = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap((page) => page.allproducts || []);
  }, [data]);

  const allbrand = data?.pages[0]?.allbrand || [];
  const allparentCategory = data?.pages[0]?.allparentCategory || [];

  return (
    <div>
      <ProductsHeader
        categoryName="Products"
        breadcrumbs={[{ label: "All Products", href: "/All-Products" }]}
      />

      <ProductsMain
        products={allProducts}
        isLoading={isLoading}
        isError={isError}
        layout={layout}
        setLayout={setLayout}
        sortOption={sortOption}
        setSortOption={setSortOption}
        showNum={showNum}
        setShowNum={setShowNum}
      />

      {/* Load More Button (only clickable, no auto-load) */}
      {hasNextPage && (
        <div className="w-full py-10 flex justify-center">
          {isFetchingNextPage ? (
            <div className="text-gray-500 font-semibold">
              Loading more products...
            </div>
          ) : (
            <button
              onClick={() => fetchNextPage()}
              className="px-6 py-2 bg-[#98022e] text-white rounded hover:bg-[#7a0225] transition-colors"
            >
              Load More Products
            </button>
          )}
        </div>
      )}

      <ProductViewTabs products={allProducts} />
    </div>
  );
};

export default ProductsClient;
