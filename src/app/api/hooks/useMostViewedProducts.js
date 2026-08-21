import { useQuery } from "@tanstack/react-query";
import { productsService } from "../services/productsService";
import { productKeys } from "@/libs/queryKeys";


export const useMostViewedProducts = (params = {}) => {
  return useQuery({
    queryKey: productKeys.mostViewedProducts(params),
    queryFn: () => productsService.getMostViewedProducts(params),
  });
};