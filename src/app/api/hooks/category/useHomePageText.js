import { homeKeys } from "@/libs/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { categoryService } from "../../services/categoryService";


export const useGetHomePageText = (options = {}) => {
    return useQuery({
        queryKey: homeKeys.pageText(),
        queryFn: () => categoryService.getHomePageText(),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        ...options,
    });
};