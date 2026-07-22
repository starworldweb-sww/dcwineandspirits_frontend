import { homeKeys } from "@/libs/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { categoryService } from "../../services/categoryService";

export const useGiftDropDownShopByPrice = () => {
  return useQuery({
    queryKey: homeKeys.giftDropDownShopByPrice(),
    queryFn: () => categoryService.getGiftDropDownShopByPrice(),
  });
};