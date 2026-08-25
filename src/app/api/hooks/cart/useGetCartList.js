// useGetCartList.js
import { useQuery } from "@tanstack/react-query";
import { cartServices } from "../../services/cartServices";


export const useGetCartList = (page = 1, limit = 12) => {
  return useQuery({
    queryKey: ["cart-list", page, limit],
    queryFn: () => cartServices.getCartList(page, limit),
    keepPreviousData: true, 
  });
};