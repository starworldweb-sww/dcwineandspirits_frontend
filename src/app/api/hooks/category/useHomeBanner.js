import { homeKeys } from "@/libs/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { categoryService } from "../../services/categoryService";

export const useGetHomePageTopBanner = () => {
    return useQuery({
        queryKey: homeKeys.topBanner(),
        queryFn: () => categoryService.getHomePageTopBanner(),
    });
};