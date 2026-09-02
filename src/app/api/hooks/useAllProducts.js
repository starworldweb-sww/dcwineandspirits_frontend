import { keepPreviousData, useInfiniteQuery, useQuery } from "@tanstack/react-query";

import { productsService } from "../services/productsService";
import { productKeys } from "@/libs/queryKeys";

const getNextPageParam = (lastPage) => {
    if (!lastPage || !lastPage.page || !lastPage.totalPages) return undefined;
    if (lastPage.page >= lastPage.totalPages) return undefined;
    return lastPage.page + 1;
};

// getCategoryData / getSearchResultsService nest pagination under `products`
// ({ items, total, page, limit, total_pages }) instead of top-level like
// getAllProductsServices does — separate helper for that shape.
const getNextPageParamNested = (lastPage) => {
    const p = lastPage?.products;
    if (!p || !p.page || !p.total_pages) return undefined;
    return p.page < p.total_pages ? p.page + 1 : undefined;
};

export const useGetAllProducts = (showNum) => {
    return useInfiniteQuery({
        queryKey: productKeys.allProducts(showNum),
        queryFn: ({ pageParam = 1 }) => productsService.getAllProducts({ showNum, pageParam }),
        initialPageParam: 1,
        getNextPageParam,
        placeholderData: keepPreviousData,
    });
};

export const useGetProductBySlugOrId = (slug, filter = {}, options = {}, limit = 24) => {
    return useInfiniteQuery({
        queryKey: [...productKeys.bySlugOrId(slug), filter, limit],
        queryFn: ({ pageParam = 1 }) =>
            productsService.getProductBySlugOrId(slug, filter, pageParam, limit),
        initialPageParam: 1,
        getNextPageParam: getNextPageParamNested,
        ...options,
        enabled: !!slug && options.enabled !== false,
         placeholderData: keepPreviousData, 
    });
};

export const useGetSingleProductDetails = (slug) => {
    return useQuery({
        queryKey: productKeys.singleProductDetail(slug),
        queryFn: () => productsService.getSingleProductDetails(slug),
        enabled: !!slug,
    });
};