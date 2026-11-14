import { orderKeys } from "@/libs/queryKeys";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { orderService } from "../../services/orderService";

export const useBulkOrderHistory = (params = { page: 1, limit: 12 }) => {
  return useQuery({
    queryKey: orderKeys.bulkHistory(params.page, params.limit),
    queryFn: () => orderService.getBulkOrderHistory(params),
    placeholderData: keepPreviousData,
  });
};