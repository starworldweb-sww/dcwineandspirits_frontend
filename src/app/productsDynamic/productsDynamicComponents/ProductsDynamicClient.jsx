"use client";
import React, { useState, useMemo } from "react";
import Filters from "./Filters";
import ProductsDynamicMain from "./ProductsDynamicMain";
import { useGetProductBySlugOrId } from "@/app/api/hooks/useAllProducts";
import { useSearchResults } from "@/app/api/hooks/useSearchResults";
import { useSearchParams } from "next/navigation";
import ProductsHeader from "@/app/components/TittleAndBreadcrumb";
import { SlidersHorizontal, X } from "lucide-react";

const normalizeSearchToCategory = (raw) => {
  if (!raw) return null;
  return {
    type: raw.type,
    category_id: null,
    name: `Search: "${raw.search_query}"`,
    meta_h1: `Search: "${raw.search_query}"`,
    description: "",
    smalldesc: "",
    subCategories: [],
    brands: (raw.brands || []).map((b) => ({
      manufacturer_id: b.id,
      name: b.name,
      image: b.image,
    })),
    priceRange: {
      min: raw.filters?.price?.min ?? null,
      max: raw.filters?.price?.max ?? null,
    },
    dynamic_filters: raw.dynamic_filters || [],
    products: (raw.products?.items || []).map((p) => ({
      product_id: p.id,
      name: p.name,
      image: p.image,
      price: p.price,
      special_price: p.special_price,
      final_price: p.special_price ?? p.price,
      in_stock: p.in_stock,
      manufacturer: p.manufacturer_id
        ? { manufacturer_id: p.manufacturer_id, name: "", image: "" }
        : null,
      seo_url: p.slug,
    })),
    breadcrumbs: raw.breadcrumbs || [],
    total: raw.products?.total ?? 0,
  };
};

const ProductsDynamicClient = ({ slug }) => {
  const searchParams = useSearchParams();
  const search = searchParams.get("search");

  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // ---- filter state (dono — category aur search — dono ke liye common) ----
  const [priceRange, setPriceRange] = useState([null, null]);
  const [priceInitialized, setPriceInitialized] = useState(false);
  // backend se mila hua default min/max — isi se compare karke pata chalega
  // ki user ne slider khud move kiya ya ye sirf auto-init hai
  const [defaultBounds, setDefaultBounds] = useState([null, null]);

  const [selectedAvailability, setSelectedAvailability] = useState([]);
  const [selectedBrandIds, setSelectedBrandIds] = useState([]);

  // in_stock: dono selected ya koi nahi -> filter mat lagao
  const inStockParam =
    selectedAvailability.length === 1
      ? selectedAvailability[0] === "in_stock"
        ? 1
        : 0
      : null;

  // ---- FIX ----
  // priceRange auto-init hote hi backend ke default min/max ke barabar ho jaata
  // hai. Agar wo default value bhi min_price/max_price ke roop mein bhej di
  // jaaye, to backend ka filterProducts() (jahan getEffectivePrice ko poora
  // product object galti se pass hota hai) sab products ko filter kar deta hai
  // -> "no products found" dikhta hai.
  //
  // Isliye min_price/max_price sirf tab bhejo jab user ne slider ko default
  // range se hata kar khud move kiya ho.
  const isDefaultPriceRange =
    priceRange[0] === defaultBounds[0] && priceRange[1] === defaultBounds[1];

  const filters = useMemo(() => {
    const f = {};
    if (selectedBrandIds.length) f.fm = selectedBrandIds.join(",");
    if (inStockParam != null) f.in_stock = inStockParam;

    if (priceInitialized && !isDefaultPriceRange) {
      if (priceRange[0] != null) f.min_price = priceRange[0];
      if (priceRange[1] != null) f.max_price = priceRange[1];
    }
    return f;
  }, [selectedBrandIds, priceRange, inStockParam, priceInitialized, isDefaultPriceRange]);

  const {
    data: dynamicData,
    isLoading: dynamicLoading,
    isError: dynamicError,
  } = useGetProductBySlugOrId(slug, filters, {
    enabled: !search,
  });

  const {
    data: searchData,
    isLoading: searchLoading,
    isError: searchError,
  } = useSearchResults({ search, page: 1, limit: 24, filters });

  const data = useMemo(() => {
    if (search) return normalizeSearchToCategory(searchData);
    return dynamicData;
  }, [search, searchData, dynamicData]);

  const isLoading = search ? searchLoading : dynamicLoading;
  const isError = search ? searchError : dynamicError;

  // jab data pehli baar aaye, price slider ko backend ke min/max se init karo
  React.useEffect(() => {
    if (data?.priceRange && !priceInitialized) {
      const bounds = [data.priceRange.min, data.priceRange.max];
      setPriceRange(bounds);
      setDefaultBounds(bounds);
      setPriceInitialized(true);
    }
  }, [data, priceInitialized]);

  const handleClearFilters = () => {
    setSelectedBrandIds([]);
    setSelectedAvailability([]);
    setPriceRange(defaultBounds);
  };

  if (isLoading) {
    return (
      <div className="w-full py-20 text-center text-gray-500 font-bold text-lg">
        Loading...
      </div>
    );
  }

  if (isError || !data || data?.type === "not_found") {
    return (
      <div className="w-full py-20 text-center text-[#98022e] font-bold text-lg">
        Not found.
      </div>
    );
  }

  return (
    <>
      <ProductsHeader categoryName={data?.meta_h1 || data?.name} />

      <div className="2xl:px-32 flex items-start justify-between gap-6 mt-2">
        <div className="hidden lg:block">
          <Filters
            data={data}
            priceRange={priceRange}
            onPriceChange={setPriceRange}
            selectedAvailability={selectedAvailability}
            onAvailabilityChange={setSelectedAvailability}
            selectedBrandIds={selectedBrandIds}
            onBrandChange={setSelectedBrandIds}
            onClear={handleClearFilters}
          />
        </div>

        <ProductsDynamicMain data={data} />
      </div>

      <button
        onClick={() => setIsFilterDrawerOpen(true)}
        className="lg:hidden fixed bottom-18 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-2 text-[#98022e] bg-[#f3f3f3] px-6 py-3 rounded-full shadow-lg active:scale-95 transition-transform shadow-[0px_4px_21px_0px_rgba(0,_0,_0,_0.1)]"
      >
        <SlidersHorizontal size={16} className="text-[#c99000]" />
        <span className="text-sm font-semibold tracking-wide font-sarabun">Filters</span>
      </button>

      {isFilterDrawerOpen && (
        <div className="lg:hidden fixed inset-0 z-100">
          <div
            onClick={() => setIsFilterDrawerOpen(false)}
            className="absolute inset-0 bg-black/50"
          />
          <div className="absolute top-0 left-0 h-full w-[85%] max-w-[320px] bg-white shadow-2xl flex flex-col animate-[slideIn_0.25s_ease-out]">
            <div className="flex items-center justify-end px-4 py-4 border-b border-gray-200 shrink-0">
              <button
                onClick={() => setIsFilterDrawerOpen(false)}
                aria-label="Close filters"
                className="p-1 text-[#98022e] hover:text-black"
              >
                <X size={22} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <Filters
                data={data}
                priceRange={priceRange}
                onPriceChange={setPriceRange}
                selectedAvailability={selectedAvailability}
                onAvailabilityChange={setSelectedAvailability}
                selectedBrandIds={selectedBrandIds}
                onBrandChange={setSelectedBrandIds}
                onClear={handleClearFilters}
              />
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes slideIn {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </>
  );
};

export default ProductsDynamicClient;