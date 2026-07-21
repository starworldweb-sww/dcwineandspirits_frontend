import { homeKeys } from "@/libs/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { categoryService } from "../../services/categoryService";


export const useHomePageProducts = () => {
    return useQuery({
        queryKey: homeKeys.pageProducts(),
        queryFn: () => categoryService.getHomePageProducts(),
    });
};