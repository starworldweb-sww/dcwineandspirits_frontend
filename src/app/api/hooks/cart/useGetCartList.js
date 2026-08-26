// useGetCartList.js
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { cartServices } from "../../services/cartServices";
import { cartKeys } from "@/libs/queryKeys";

export const useGetCartList = (page = 1, limit = 12) => {
  return useQuery({
    queryKey: [...cartKeys.getCartList(), page, limit],
    queryFn: () => cartServices.getCartList(page, limit),
    placeholderData: keepPreviousData,
  });
};