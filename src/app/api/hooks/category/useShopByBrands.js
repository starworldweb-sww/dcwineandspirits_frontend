import { homeKeys } from "@/libs/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { categoryService } from "../../services/categoryService";

// 1. Shop By Brand ka data fetch karne wala hook
export const useShopByBrand = (options = {}) => {
  return useQuery({
    queryKey: homeKeys.shopByBrand(),
    queryFn: () => categoryService.getShopByBrand(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    ...options,
  });
};