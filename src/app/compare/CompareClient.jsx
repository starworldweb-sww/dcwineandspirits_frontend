"use client";

import React, { useState, useCallback } from "react";
import { X } from "lucide-react";
import { useCompareList } from "../api/hooks/useCompareProducts";
import {
  useGetProductBySlugOrId,
  useGetSingleProductDetails,
} from "../api/hooks/useAllProducts";

const IMAGE_BASE = process.env.NEXT_PUBLIC_PRODUCTION_IMAGE_URL;

const getImageUrl = (path) => {
  if (!path) return "/prosecco-gift-800x800.webp";
  if (path.startsWith("http")) return path;
  const cleanBase = (IMAGE_BASE || "").replace(/\/$/, "");
  const cleanPath = path.replace(/^\//, "");
  return `${cleanBase}/${cleanPath}`;
};

const COMPARE_ROWS = [
  { key: "product", label: "Product" },
  { key: "image", label: "Image" },
  { key: "price", label: "Price" },
  { key: "model", label: "Model" },
  { key: "brand", label: "Brand" },
  { key: "availability", label: "Availability" },
  { key: "rating", label: "Rating" },
];

const CompareProductFetcher = ({ slug, onLoad, onError }) => {
  const { data, isError } = useGetSingleProductDetails(slug);
  // STEP FIX: response shape hai { success, message, data: {...product} }
  // isliye ek extra ".data" chahiye — pehle sirf ek level tha
  const product = data;
  

  React.useEffect(() => {
    if (product) {
      onLoad(slug, product);
    } else if (isError) {
      onError(slug);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product, isError]);

  return null;
};

const CompareClient = () => {
  const { compareIds: compareSlugs, removeProduct } = useCompareList();

  const [productsMap, setProductsMap] = useState({});
  // STEP FIX: errored slugs ko track karenge taaki unke liye hamesha
  // "loading" na dikhta rahe — ek baar fail ho gaya toh bas skip karo
  const [erroredSlugs, setErroredSlugs] = useState(new Set());

  const handleProductLoad = useCallback((slug, product) => {
    setProductsMap((prev) => ({ ...prev, [slug]: product }));
  }, []);

  const handleProductError = useCallback((slug) => {
    setErroredSlugs((prev) => new Set(prev).add(slug));
  }, []);

  const compareProducts = compareSlugs
    .map((slug) => productsMap[slug])
    .filter(Boolean);

  const handleRemoveProduct = (slug) => {
    removeProduct(slug);
    setProductsMap((prev) => {
      const next = { ...prev };
      delete next[slug];
      return next;
    });
  };

  // STEP FIX: "abhi bhi loading hai" ka matlab — list mein slugs hain,
  // lekin unme se kuch abhi tak na fetch hue hain na error diye
  const pendingCount = compareSlugs.filter(
    (slug) => !productsMap[slug] && !erroredSlugs.has(slug),
  ).length;
  const isStillLoading = compareSlugs.length > 0 && pendingCount > 0;

  return (
    <>
      {compareSlugs.map((slug) => (
        <CompareProductFetcher
          key={slug}
          slug={slug}
          onLoad={handleProductLoad}
          onError={handleProductError}
        />
      ))}

      {isStillLoading ? (
        <div className="max-w-[1200px] mx-auto px-3 2xl:px-32 py-20 text-center">
          <p className="text-gray-500 text-lg">Loading products...</p>
        </div>
      ) : compareProducts.length === 0 ? (
        <div className="max-w-[1200px] mx-auto px-3 2xl:px-32 py-20 text-center">
          <p className="text-gray-500 text-lg">
            Compare list is empty.
          </p>
        </div>
      ) : (
        <div className="max-w-[1200px] mx-auto px-3 2xl:px-32 py-10">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-semibold text-black">
              Product Comparison
            </h1>
            <div className="w-16 h-[3px] bg-[#98022e] mx-auto mt-3" />
          </div>

          <div className="border border-gray-200 rounded overflow-x-auto">
            <div
              className="min-w-[600px]"
              style={{
                display: "grid",
                gridTemplateColumns: `200px repeat(${compareProducts.length}, 1fr)`,
              }}
            >
              <div className="bg-gray-100 font-bold text-sm uppercase tracking-wide px-4 py-3 col-span-full border-b border-gray-200">
                Product Details
              </div>

              <div className="px-4 py-3 border-b border-gray-200" />
              {compareProducts.map((product) => (
                <div
                  key={`remove-${product.product_id}`}
                  className="px-4 py-3 border-b border-gray-200 flex justify-end"
                >
                  <button
                    onClick={() => handleRemoveProduct(product.seo_url)}
                    className="text-gray-400 hover:text-[#98022e] transition-colors"
                    aria-label="Remove from compare"
                  >
                    <X size={18} />
                  </button>
                </div>
              ))}

              {COMPARE_ROWS.map((row, rowIndex) => (
                <React.Fragment key={row.key}>
                  <div
                    className={`px-4 py-4 text-sm font-medium text-gray-700 border-b border-gray-200 ${
                      rowIndex % 2 === 1 ? "bg-gray-50" : "bg-white"
                    }`}
                  >
                    {row.label}
                  </div>

                  {compareProducts.map((product) => (
                    <div
                      key={`${row.key}-${product.product_id}`}
                      className={`px-4 py-4 text-sm border-b border-gray-200 ${
                        rowIndex % 2 === 1 ? "bg-gray-50" : "bg-white"
                      }`}
                    >
                      {row.key === "product" && (
                        <a
                          href={`/${product.seo_url}/`}
                          className="font-semibold text-[#98022e] hover:underline"
                        >
                          {product.name}
                        </a>
                      )}

                      {row.key === "image" && (
                        <img
                          src={getImageUrl(product.image)}
                          alt={product.name}
                          className="w-24 h-24 object-contain"
                        />
                      )}

                      {row.key === "price" && (
                        <span className="text-black">
                          $
                          {Number(
                            product.special_price || product.price,
                          ).toFixed(2)}
                        </span>
                      )}

                      {row.key === "model" && (
                        <span className="text-gray-800">{product.model}</span>
                      )}

                      {row.key === "brand" && (
                        <span className="text-gray-800">
                          {product.manufacturer?.name || "-"}
                        </span>
                      )}

                      {row.key === "availability" && (
                        <span
                          className={
                            product.in_stock
                              ? "text-green-600 font-medium"
                              : "text-red-600 font-medium"
                          }
                        >
                          {product.in_stock ? "In Stock" : "Out of Stock"}
                        </span>
                      )}

                      {row.key === "rating" && (
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span
                              key={star}
                              className={
                                star <= Math.round(product.average_rating || 0)
                                  ? "text-yellow-500"
                                  : "text-gray-300"
                              }
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CompareClient;
