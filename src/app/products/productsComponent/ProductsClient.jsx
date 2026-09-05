// @ts-nocheck
"use client";

import React, { useState, useMemo } from "react";
import ProductsMain from "./ProductsMain";
import ProductsHeader from "@/app/components/TittleAndBreadcrumb";
import ProductViewTabs from "@/app/components/ProductViewsTabs";
import { useGetAllProducts } from "@/app/api/hooks/useAllProducts";

const ProductsClient = () => {
  const [sortOption, setSortOption] = useState("");
  const [showNum, setShowNum] = useState(48);
  const [layout, setLayout] = useState("grid");

  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } = useGetAllProducts(showNum);

  const allProducts = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap((page) => page.allproducts || []);
  }, [data]);

  console.log("data", data)
  const pages = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap((page) => page.page || []);
  }, [data]);

  const totalProducts = useMemo(() => {
    if (!data?.pages?.length) return 0;
    return data.pages[data.pages.length - 1]?.total || 0;
  }, [data]);
  const allbrand = data?.pages[0]?.allbrand || [];
  const allparentCategory = data?.pages[0]?.allparentCategory || [];

  const handleLoadMore = async () => {
    await fetchNextPage();
    const newPage = (pages[pages.length - 1] || 1) + 1;
    const PRODUCTS_COOKIE_KEY = "current_page_All-Products";

    document.cookie = `current_page_${PRODUCTS_COOKIE_KEY}=${newPage}; path=/; max-age=1800`;
  };
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
        <div className="w-full py-10   text-center">
          {isFetchingNextPage ? (
            <div className="text-gray-500 mb-3 font-semibold">
              Loading more products...
            </div>
          ) : (
            <button
              onClick={handleLoadMore}
              className="px-6 py-2 bg-[#98022e] mb-3 text-white rounded hover:bg-[#7a0225] transition-colors"
            >
              Load More Products
            </button>
          )}
          <p className="text-sm text-gray-500">
            Showing{" "}
            <span className="font-semibold text-gray-700">
              {allProducts.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-700">
              {totalProducts}
            </span>{" "}
            products
          </p>
        </div>
      )}


    </div>
  );
};

export default ProductsClient;
