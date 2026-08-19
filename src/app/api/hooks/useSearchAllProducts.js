import { productKeys } from "@/libs/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { productsService } from "../services/productsService";



export const useSearchAllProducts = (params, options = {}) => {
  return useQuery({
    queryKey: productKeys.searchAllProducts(params),
    queryFn: () => productsService.searchAllProducts(params),
    enabled: !!params?.data, 
    ...options,
  });
};