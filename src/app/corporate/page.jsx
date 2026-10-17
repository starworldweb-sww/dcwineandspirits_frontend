import React from "react";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import CorporateClient from "./CorporateClient";
import { categoryService } from "../api/services/categoryService";
import { productsService } from "../api/services/productsService";
import { homeKeys, productKeys } from "@/libs/queryKeys";

export const metadata = {
  title: "Buy Corporate / Business Gift Baskets - Dcwineandspirits",
  description:
    "Corporate Gifts - Contact for Corporate bulk orders. At DC Wine and Spirits we deal in corporate wine, champagne and spirits gifts @ fair prices",
  alternates: {
    canonical: "https://www.dcwineandspirits.com/corporate/",
  },
};

const CORPORATE_SLUG = "corporate-gift-basket";
const FILTER = {};
const LIMIT = 24;

const Page = async () => {
  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: homeKeys.topCategories(),
      queryFn: () => categoryService.getTopCategories(),
    }),
    queryClient.prefetchQuery({
      queryKey: homeKeys.shopByBrandTitle(),
      queryFn: () => categoryService.getShopByBrandTitle(),
    }),
    queryClient.prefetchInfiniteQuery({
      queryKey: [...productKeys.bySlugOrId(CORPORATE_SLUG), FILTER, LIMIT],
      queryFn: ({ pageParam = 1 }) =>
        productsService.getProductBySlugOrId(
          CORPORATE_SLUG,
          FILTER,
          pageParam,
          LIMIT,
        ),
      initialPageParam: 1,
      pages: 1,
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CorporateClient />
    </HydrationBoundary>
  );
};

export default Page;