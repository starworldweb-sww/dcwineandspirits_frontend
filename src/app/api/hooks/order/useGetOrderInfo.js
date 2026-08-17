
import { orderKeys } from "@/libs/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { orderService } from "../../services/orderService";


export const useOrderInfo = (orderId) => {
  return useQuery({
    queryKey: orderKeys.detail(orderId),
    queryFn: () => orderService.getOrderInfoById(orderId),
    enabled: !!orderId,
  });
};