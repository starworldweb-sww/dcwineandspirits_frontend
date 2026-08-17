import { wishlistKeys } from "@/libs/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { checkWishlist } from "../../services/wishlistService";


export const useCheckWishlist = (product_id) => {
  return useQuery({
    queryKey: wishlistKeys.check(product_id),
    queryFn: () => checkWishlist(product_id),
    enabled: !!product_id,
  });
};