
import { wishlistKeys } from "@/libs/queryKeys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeFromWishlist } from "../../services/wishlistService";

export const useRemoveFromWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (product_id) => removeFromWishlist(product_id),
    onSuccess: (data, product_id) => {
      queryClient.invalidateQueries({ queryKey: wishlistKeys.list() });
      queryClient.invalidateQueries({ queryKey: wishlistKeys.check(product_id) });
    },
  });
};