
import { homeKeys } from "@/libs/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { categoryService } from "../../services/categoryService";


export const useGiftsShopyByCategory = (options = {}) => {
  return useQuery({
    queryKey: homeKeys.giftDropDownShopByCategory(),
    queryFn: () => categoryService.getGiftDropDownShopByCategory(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    ...options,
  });
};