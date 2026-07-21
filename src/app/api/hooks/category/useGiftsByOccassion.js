import { homeKeys } from "@/libs/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { categoryService } from "../../services/categoryService";

export const useGetGiftByOccasion = () => {
    return useQuery({
        queryKey: homeKeys.giftByOccasion(),
        queryFn: () => categoryService.getGiftByOccasion(),
    });
};