"use client";
import React, { useState, useMemo } from "react";
import Filters from "./Filters";
import ProductsDynamicMain from "./ProductsDynamicMain";
import { useGetProductBySlugOrId } from "@/app/api/hooks/useAllProducts";
import { useSearchResults } from "@/app/api/hooks/useSearchResults";
import { useSearchParams } from "next/navigation";
import ProductsHeader from "@/app/components/TittleAndBreadcrumb";
import { SlidersHorizontal, X } from "lucide-react";
import { p } from "motion/react-client";
import MainDescription from "./MainDescription";

// merges every fetched page's product items into one flat list, while
// keeping meta (brands/priceRange/breadcrumbs/subCategories/name/etc) from
// the FIRST page only — those don't change page to page, only products.items
// and the pagination cursor do
const flattenCategoryPages = (pages) => {
  if (!pages || !pages.length) return null;
  const first = pages[0];
  const items = pages.flatMap((p) => p.products?.items || []);
  const last = pages[pages.length - 1];
  return {
    ...first,
    products: {
      ...first.products,
      items,
      page: last.products?.page,
      total_pages: last.products?.total_pages,
      total: last.products?.total,
    },
  };
};

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
    products: {
      items: (raw.products?.items || []).map((p) => ({
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
      total: raw.products?.total ?? 0,
      page: raw.products?.page,
      total_pages: raw.products?.total_pages,
    },
    breadcrumbs: raw.breadcrumbs || [],
  };
};

const ProductsDynamicClient = ({ slug }) => {
  const searchParams = useSearchParams();
  const search = searchParams.get("search");

  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // page size — changing this restarts the infinite query from page 1
  // (it's part of the query key in the hooks)
  const [limit, setLimit] = useState(24);
  // sort now goes to the backend instead of being re-sorted client-side per
  // fetched page (client-side sort would only be correct within one page and
  // break across pages once you scroll past the first)
  const [sort, setSort] = useState("");

  const [priceRange, setPriceRange] = useState([null, null]);
  const [priceInitialized, setPriceInitialized] = useState(false);
  const [defaultBounds, setDefaultBounds] = useState([null, null]);

  const [selectedAvailability, setSelectedAvailability] = useState([]);
  const [selectedBrandIds, setSelectedBrandIds] = useState([]);

  const inStockParam =
    selectedAvailability.length === 1
      ? selectedAvailability[0] === "in_stock"
        ? 1
        : 0
      : null;

  const isDefaultPriceRange =
    priceRange[0] === defaultBounds[0] && priceRange[1] === defaultBounds[1];

  const filters = useMemo(() => {
    const f = {};
    if (sort) f.sort = sort;
    if (selectedBrandIds.length) f.fm = selectedBrandIds.join(",");
    if (inStockParam != null) f.in_stock = inStockParam;

    if (priceInitialized && !isDefaultPriceRange) {
      if (priceRange[0] != null) f.min_price = priceRange[0];
      if (priceRange[1] != null) f.max_price = priceRange[1];
    }
    return f;
  }, [sort, selectedBrandIds, priceRange, inStockParam, priceInitialized, isDefaultPriceRange]);

  const {
    data: dynamicPages,
    isLoading: dynamicLoading,
    isError: dynamicError,
    fetchNextPage: fetchNextDynamicPage,
    hasNextPage: hasNextDynamicPage,
    isFetchingNextPage: isFetchingNextDynamicPage,
  } = useGetProductBySlugOrId(
    slug,
    filters,
    { enabled: !search },
    limit
  );

  const {
    data: searchPages,
    isLoading: searchLoading,
    isError: searchError,
    fetchNextPage: fetchNextSearchPage,
    hasNextPage: hasNextSearchPage,
    isFetchingNextPage: isFetchingNextSearchPage,
  } = useSearchResults({
    search,
    limit,
    filter: filters,
    options: { enabled: !!search },
  });

  const data = useMemo(() => {
    if (search) {
      if (!searchPages?.pages?.length) return null;
      const merged = flattenCategoryPages(searchPages.pages);
      return normalizeSearchToCategory({
        ...merged,
        products: merged.products, // already { items, total, page, total_pages }
      });
    }
    return flattenCategoryPages(dynamicPages?.pages);
  }, [search, searchPages, dynamicPages]);

  const isLoading = search ? searchLoading : dynamicLoading;
  const isError = search ? searchError : dynamicError;
  const fetchNextPage = search ? fetchNextSearchPage : fetchNextDynamicPage;
  const hasNextPage = search ? hasNextSearchPage : hasNextDynamicPage;
  const isFetchingNextPage = search ? isFetchingNextSearchPage : isFetchingNextDynamicPage;
  console.log("data", data)
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
  const handleLoadMore = async () => {
    await fetchNextPage();
    const newPage = (data?.pages?.length || 1) + 1;
    document.cookie = `current_page_${slug}=${newPage}; path=/; max-age=1800`;
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
      <ProductsHeader 
  categoryName={data?.meta_h1 || data?.name} 
  breadcrumbs={data?.breadcrumbs}
/>

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

        <ProductsDynamicMain
          data={data}
          sort={sort}
          onSortChange={setSort}
          limit={limit}
          onLimitChange={setLimit}
          // fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
        // isFetchingNextPage={isFetchingNextPage}
        />


        
      </div>


          {hasNextPage && (
        <div className="flex flex-col items-center pl-7 gap-3 py-5">
         
          {isFetchingNextPage ? (
            <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-[#98022e]" />
              Loading more products...
            </div>
          ) : (
            <button
              onClick={handleLoadMore}
              className="rounded-md bg-[#98022e] px-7 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#7a0225] hover:shadow-md active:scale-95 cursor-pointer"
            >
              Load More Products
            </button>
          )}

          {/* Product Count */}
          <p className="text-sm text-gray-500">
            Showing{" "}
            <span className="font-semibold text-gray-700">
              {data?.products?.items?.length || 0}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-700">
              {data?.products?.total || 0}
            </span>{" "}
            products
          </p>
        </div>
      )}
<MainDescription description={data.description}/>
      <button
        onClick={() => setIsFilterDrawerOpen(true)}
        className="lg:hidden fixed bottom-18 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-2 text-white bg-gray-950 px-8 py-2 rounded-xl shadow-lg active:scale-95 transition-transform shadow-[0px_4px_21px_0px_rgba(0,_0,_0,_0.1)]"
      >
        <SlidersHorizontal size={16} className="text-white" />
        <span className="text-sm  tracking-wide font-sumana">Filters</span>
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