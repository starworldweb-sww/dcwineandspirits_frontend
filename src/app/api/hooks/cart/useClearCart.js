import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cartServices } from "../../services/cartServices";
import { cartKeys } from "@/libs/queryKeys";

export const useClearCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cartServices.clearCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
    },
  });
};
