import { homeKeys } from "@/libs/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { categoryService } from "../../services/categoryService";

export const useLovebyBanner = () => {
    return useQuery({
        queryKey: homeKeys.loveByBanner(),
        queryFn: () => categoryService.getLovebyBanners(),
    });
};