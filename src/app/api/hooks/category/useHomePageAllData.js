import { homeKeys } from "@/libs/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { categoryService } from "../../services/categoryService";

export const useHomePageAllData = () => {
  return useQuery({
    queryKey: homeKeys.allData(),
    queryFn: () => categoryService.getHomePageAllData(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
