import { homeKeys } from "@/libs/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { categoryService } from "../../services/categoryService";


export const useGetWineGifts = () => {
    return useQuery({
        queryKey: homeKeys.wineGifts(),
        queryFn: () => categoryService.getWineGifts(),
    });
};