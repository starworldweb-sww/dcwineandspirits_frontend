
import { wishlistKeys } from "@/libs/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { getWishlist } from "../../services/wishlistService";

export const useGetWishlist = () => {
  return useQuery({
    queryKey: wishlistKeys.list(),
    queryFn: getWishlist,
  });
};