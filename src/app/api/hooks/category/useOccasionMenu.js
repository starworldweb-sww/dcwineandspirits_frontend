
import { homeKeys } from "@/libs/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { categoryService } from "../../services/categoryService";


export const useOccasionMenu = () => {
  return useQuery({
    queryKey: homeKeys.occasionMenu(),
    queryFn: () => categoryService.getOccasionMenu(),
  });
};