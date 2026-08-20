import { useQuery } from "@tanstack/react-query";
import { productsService } from "../services/productsService";
import { manufacturerKeys } from "@/libs/queryKeys";


export const useGetAllManufacturers = (params = {}) => {
  return useQuery({
    queryKey: manufacturerKeys.allManufacturers(params),
    queryFn: () => productsService.getAllManufacturers(params),
  });
};