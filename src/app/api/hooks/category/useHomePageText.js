import { homeKeys } from "@/libs/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { categoryService } from "../../services/categoryService";


export const useGetHomePageText = () => {
    return useQuery({
        queryKey: homeKeys.pageText(),
        queryFn: () => categoryService.getHomePageText(),
    });
};