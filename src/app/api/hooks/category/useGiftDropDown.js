
import { homeKeys } from "@/libs/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { categoryService } from "../../services/categoryService";


export const useGiftDropDown = () => {
  return useQuery({
    queryKey: homeKeys.giftDropDown(),
    queryFn: () => categoryService.getGiftDropDown(),
  });
};