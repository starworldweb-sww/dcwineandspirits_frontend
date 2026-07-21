
import { homeKeys } from "@/libs/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { categoryService } from "../../services/categoryService";


export const useGetTopCategories = () => {
    return useQuery({
        queryKey: homeKeys.topCategories(),
        queryFn: () => categoryService.getTopCategories(),
    });
};