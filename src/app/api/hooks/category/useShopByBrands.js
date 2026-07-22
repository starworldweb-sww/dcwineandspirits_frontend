import { homeKeys } from "@/libs/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { categoryService } from "../../services/categoryService";

// 1. Shop By Brand ka data fetch karne wala hook
export const useShopByBrand = () => {
  return useQuery({
    queryKey: homeKeys.shopByBrand(),
    queryFn: () => categoryService.getShopByBrand(),
  });
};