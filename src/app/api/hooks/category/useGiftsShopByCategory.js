
import { homeKeys } from "@/libs/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { categoryService } from "../../services/categoryService";


export const useGiftsShopyByCategory = () => {
  return useQuery({
    queryKey: homeKeys.giftDropDownShopByCategory(),
    queryFn: () => categoryService.getGiftDropDownShopByCategory(),
  });
};