import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { checkoutService } from "../../services/checkoutService";

export const useCreatePaymentIntent = () => {
  return useMutation({
    mutationFn: checkoutService.createPaymentIntent,
    onError: (error) => {
      toast.error(error?.message || "Failed to create payment intent");
    },
  });
};
