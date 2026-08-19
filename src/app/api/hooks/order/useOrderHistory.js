// hooks/useOrderHistory.js
import { orderKeys } from "@/libs/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { orderService } from "../../services/orderService";


export const useOrderHistory = (params = { page: 1, limit: 12 }) => {
  return useQuery({
    queryKey: orderKeys.history(params),
    queryFn: () => orderService.getOrderHistory(params),
  });
};