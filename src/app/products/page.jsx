import React from 'react'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import ProductsClient from './productsComponent/ProductsClient'
import { getQueryClient } from '@/libs/get-query-client'
import { productKeys } from '@/libs/queryKeys'

const page = async () => {
  const queryClient = getQueryClient()
  const initialShowNum = 24;
  
  // Prefetch initial products with direct fetch on server
  await queryClient.prefetchInfiniteQuery({
    queryKey: productKeys.allProducts(initialShowNum),
    queryFn: async ({ pageParam = 1 }) => {
      const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
      const res = await fetch(`${baseURL}/api/v1/products?page=${pageParam}&limit=${initialShowNum}`);
      const data = await res.json();
      if (data.success) {
        return data.data;
      }
      return { allbrand: [], allproducts: [], total: 0, page: 1, limit: initialShowNum, totalPages: 0 };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage || !lastPage.page || !lastPage.totalPages) return undefined;
      if (lastPage.page >= lastPage.totalPages) return undefined;
      return lastPage.page + 1;
    },
  })
  
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductsClient  />
    </HydrationBoundary>
  )
}

export default page
