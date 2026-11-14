import { orderKeys } from "@/libs/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { orderService } from "../../services/orderService";


export const useBulkOrderDetails = (bulkOrderId) => {
  return useQuery({
    queryKey: orderKeys.bulkDetail(bulkOrderId),
    queryFn: () => orderService.getBulkOrderDetails(bulkOrderId),
    enabled: !!bulkOrderId, 
  });
};