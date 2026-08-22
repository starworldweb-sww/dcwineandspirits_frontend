import { homeKeys } from "@/libs/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { categoryService } from "../../services/categoryService";


export const useGetWineGifts = (options = {}) => {
    return useQuery({
        queryKey: homeKeys.wineGifts(),
        queryFn: () => categoryService.getWineGifts(),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        ...options,
    });
};