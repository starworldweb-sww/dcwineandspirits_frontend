import { homeKeys } from "@/libs/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { categoryService } from "../../services/categoryService";

export const useGiftDropDownGiftByOrigin = () => {
  return useQuery({
    queryKey: homeKeys.giftDropDownGiftByOrigin(),
    queryFn: () => categoryService.getGiftDropDownGiftByOrigin(),
  });
};