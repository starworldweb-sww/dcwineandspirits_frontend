import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { checkoutService } from "../../services/checkoutService";

export const usePlaceOrder = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: checkoutService.placeOrder,
    // onSuccess: (data) => {
    //   if (data?.success) {
    //     toast.success(data?.message || "Order placed successfully");
    //   }
    // },
    // onError: (error) => {
    //   toast.error(error?.message || "Failed to place order");
    // },
  });
};
