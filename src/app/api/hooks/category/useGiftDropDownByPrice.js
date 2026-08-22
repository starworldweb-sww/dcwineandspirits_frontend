import { homeKeys } from "@/libs/queryKeys";
import { categoryService } from "../../services/categoryService";
import { useQuery } from "@tanstack/react-query";

export const useGiftDropDownShopByPrice = (options = {}) => {
  return useQuery({
    queryKey: homeKeys.giftDropDownShopByPrice(),
    queryFn: categoryService.getGiftDropDownShopByPrice,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    ...options,
  });
};