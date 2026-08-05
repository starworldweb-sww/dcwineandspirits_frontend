import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

import { productsService } from "../services/productsService";
import { productKeys } from "@/libs/queryKeys";

const getNextPageParam = (lastPage) => {
   
    if (!lastPage || !lastPage.page || !lastPage.totalPages) return undefined;
    if (lastPage.page >= lastPage.totalPages) return undefined;
    return lastPage.page + 1;
};

export const useGetAllProducts = (showNum) => {
    return useInfiniteQuery({
        queryKey: productKeys.allProducts(showNum),
        queryFn: ({ pageParam = 1 }) => productsService.getAllProducts({ showNum, pageParam }),
        initialPageParam: 1,
        getNextPageParam,
    });
};

export const useGetProductBySlugOrId = (slug) => {
    return useQuery({
        queryKey: productKeys.bySlugOrId(slug),
        queryFn: () => productsService.getProductBySlugOrId(slug),
        enabled: !!slug,
    });
};

export const useGetSingleProductDetails = (slug) => {
    return useQuery({
        queryKey: productKeys.singleProductDetail(slug),
        queryFn: () => productsService.getSingleProductDetails(slug),
        enabled: !!slug,
    });
};