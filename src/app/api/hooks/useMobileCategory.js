import { mobileCategoryKeys } from "@/libs/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { getMobileCategories } from "../services/mobileCategoryService";

export const useMobileCategory = () => {
  return useQuery({
    queryKey: mobileCategoryKeys.list(),
    queryFn: getMobileCategories,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
