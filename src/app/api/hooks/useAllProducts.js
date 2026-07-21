import { useQuery } from "@tanstack/react-query";

import { productsService } from "../services/productsService";
import { homeKeys, productKeys } from "@/libs/queryKeys";

export const useGetAllProducts = () => {
    return useQuery({
        queryKey: productKeys.allProducts(),
        queryFn: () => productsService.getAllProducts(),
    });
};