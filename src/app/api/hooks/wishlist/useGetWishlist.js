import { wishlistKeys } from "@/libs/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { getWishlist } from "../../services/wishlistService";

export const useGetWishlist = (page = 1, limit = 12) => {
  return useQuery({
    queryKey: wishlistKeys.list(page, limit),
    queryFn: () => getWishlist(page, limit),
    keepPreviousData: true, // page switch pe list flash na ho
  });
};