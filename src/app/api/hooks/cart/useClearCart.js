import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { cartServices } from "../../services/cartServices";
import { cartKeys } from "@/libs/queryKeys";

export const useClearCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: cartKeys.clearCart(), 
    mutationFn: ({ sessionId, customerId }) => cartServices.clearCart({ sessionId, customerId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
      toast.success("Cart cleared");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to clear cart");
    },
  });
};