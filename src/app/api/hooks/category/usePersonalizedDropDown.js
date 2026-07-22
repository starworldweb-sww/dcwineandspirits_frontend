import { homeKeys } from "@/libs/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { categoryService } from "../../services/categoryService";


// 1. Personalization ka data fetch karne wala hook
export const usePersonalizedDropDown = () => {
  return useQuery({
    queryKey: homeKeys.personalization(),
    queryFn: () => categoryService.getPersonalization(),
  });
};