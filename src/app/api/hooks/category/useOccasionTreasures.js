
import { homeKeys } from "@/libs/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { categoryService } from "../../services/categoryService";



export const useOccasionTreasures = () => {
  return useQuery({
    queryKey: homeKeys.occasionTreasures(),
    queryFn: () => categoryService.getOccasionTreasures(),
  });
};