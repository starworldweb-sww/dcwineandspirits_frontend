import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cartServices } from "../../services/cartServices";
import { cartKeys } from "@/libs/queryKeys";

export const useClearCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey:cartKeys.deleteCart(),
    mutationFn: (cartId)=> cartServices.clearCart(cartId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
    },
  });
};
