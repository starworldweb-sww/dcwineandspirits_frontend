// hooks/useShopByBrand.js (ya jo bhi file hai home hooks ki)
import { homeKeys } from "@/libs/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { categoryService } from "../../services/categoryService";


// 1. Shop By Brand Title ka data fetch karne wala hook
export const useShopByBrandTitle = (options = {}) => {
  return useQuery({
    queryKey: homeKeys.shopByBrandTitle(),
    queryFn: () => categoryService.getShopByBrandTitle(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    ...options,
  });
};