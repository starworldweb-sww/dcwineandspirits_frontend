// hooks/useTopCategory.js
import { homeKeys } from "@/libs/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { categoryService } from "../../services/categoryService";
// Apna exact path zaroor check kar lena

// 1. Top Category (singular) ka data fetch karne wala hook
export const useTopCategoryHeader = () => {
  return useQuery({
    queryKey: homeKeys.topCategory(),
    queryFn: () => categoryService.getTopCategory(),
  });
};