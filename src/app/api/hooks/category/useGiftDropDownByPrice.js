import { homeKeys } from "@/libs/queryKeys";
import { categoryService } from "../../services/categoryService";
import { useQuery } from "@tanstack/react-query";

export const useGiftDropDownShopByPrice = () => {
  return useQuery({
    queryKey: homeKeys.giftDropDownShopByPrice(),
    queryFn: categoryService.getGiftDropDownShopByPrice,
    staleTime: 5 * 60 * 1000, // 5 min, adjust as needed
  });
};