// // hooks/useSearchResults.js
// import { productKeys } from "@/libs/queryKeys";
// import { useQuery, keepPreviousData } from "@tanstack/react-query";
// import { productsService } from "../services/productsService";


// export const useSearchResults = ({
//   search,
//   page = 1,
//   limit = 24,
//   sort = "default",
//   filters = {},
//   enabled = true,
// }) => {
//   const params = {
//     search,
//     page,
//     limit,
//     sort,
//     ...filters, // e.g. filter_ids, option_ids, min_price, max_price, manufacturer_ids, in_stock
//   };

//   return useQuery({
//     queryKey: productKeys.searchResults(params),
//     queryFn: () => productsService.getSearchResults(params),
//     enabled: enabled && !!search?.trim(),
//     placeholderData: keepPreviousData, // smooth pagination, purana data dikhta rehta hai jab tak naya na aaye
//     staleTime: 1000 * 60, // 1 min — apni zarurat ke hisaab se adjust karo
//   });
// };


import { useInfiniteQuery } from "@tanstack/react-query";
import { productsService } from "../services/productsService";
import { productKeys } from "@/libs/queryKeys";

const getNextPageParamNested = (lastPage) => {
    const p = lastPage?.products;
    if (!p || !p.page || !p.total_pages) return undefined;
    return p.page < p.total_pages ? p.page + 1 : undefined;
};

export const useSearchResults = ({ search, limit = 24, filter = {}, options = {} }) => {
    return useInfiniteQuery({
        queryKey: productKeys.searchResults({ search, filter, limit }),
        queryFn: ({ pageParam = 1 }) =>
            productsService.getSearchResults({ search, page: pageParam, limit, filter }),
        initialPageParam: 1,
        getNextPageParam: getNextPageParamNested,
        ...options,
        enabled: !!search && options.enabled !== false,
    });
};