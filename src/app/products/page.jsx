import React from 'react'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import ProductsClient from './productsComponent/ProductsClient'
import { getQueryClient } from '@/libs/get-query-client'
import { productKeys } from '@/libs/queryKeys'
import { cookies } from 'next/headers'
import { productsService } from '../api/services/productsService'
import { generateCollectionPageSchema } from '@/libs/collectionPageSchema'
import { generateBreadcrumbSchema } from '@/libs/breadCrumbSchema'
import Script from 'next/script'





// Exact extracted (as per archived snapshot)
export const metadata = {
  title: "All Products | DC Wine & Spirits",
  description: "All Products - DC Wine & Spirits",
  alternates: {
    canonical: "https://www.dcwineandspirits.com/products/",
  },
};
const page = async () => {
  const queryClient = getQueryClient()
  const cookieStore = await cookies();
  const PRODUCTS_COOKIE_KEY = "current_page_All-Products";
  const currentPage = Number(cookieStore.get(`current_page_${PRODUCTS_COOKIE_KEY}`)?.value) || 1;
  // // Prefetch initial products with direct fetch on server
  // await queryClient.prefetchInfiniteQuery({
  //   queryKey: productKeys.allProducts(initialShowNum),
  //   queryFn: async ({ pageParam = 1 }) => {
  //     const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
  //     const res = await fetch(`${baseURL}/products?page=${pageParam}&limit=${initialShowNum}`);
  //     const data = await res.json();
  //     if (data.success) {
  //       return data.data;
  //     }
  //     return { allbrand: [], allproducts: [], total: 0, page: 1, limit: initialShowNum, totalPages: 0 };
  //   },
  //   initialPageParam: 1,
  //   getNextPageParam: (lastPage) => {
  //     if (!lastPage || !lastPage.page || !lastPage.totalPages) return undefined;
  //     if (lastPage.page >= lastPage.totalPages) return undefined;
  //     return lastPage.page + 1;
  //   },
  // })

  const pageParams = Array.from({ length: currentPage }, (_, i) => i + 1);
  console.log("currentPage", currentPage)
  const limit = 100;

  const queryKey = [...productKeys.allProducts(limit)];

  const pagesData = await Promise.all(
    pageParams.map((p) => productsService.getAllProducts({ showNum: limit, pageParam: p }))
  );
  console.log("pagesData", pagesData)

  queryClient.setQueryData(queryKey, {
    pages: pagesData,
    pageParams: pageParams,
  });

  let productsCollectionSchema = null;
  let productsBreadcrumbSchema = null;
  try {
    const firstPageData = pagesData[0];
    if (firstPageData) {
      productsCollectionSchema = generateCollectionPageSchema(
        firstPageData?.allproducts,
        metadata.title,
        metadata.description,
        "products",
        firstPageData?.total,
        firstPageData.priceRange,
      );

      const productsBreadcrumbsData =
        firstPageData.breadcrumbs && firstPageData.breadcrumbs.length > 1
          ? firstPageData.breadcrumbs
          : "products";

      productsBreadcrumbSchema = generateBreadcrumbSchema(
        productsBreadcrumbsData,
        "products",
        "https://www.dcwineandspirits.com",
        "All Products",
      );
    }
  } catch (e) {
    console.error("Collection schema build failed:", e.message);
  }


  return (
    <>
      {productsCollectionSchema && (
        <Script
          id="products-collection-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(productsCollectionSchema),
          }}
        />
      )}
      {productsBreadcrumbSchema && (
        <Script
          id="products-breadcrumb-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(productsBreadcrumbSchema),
          }}
        />
      )}
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ProductsClient />
      </HydrationBoundary>
    </>
  )
}

export default page