import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { checkoutService } from "../../services/checkoutService";

export const usePlaceOrder = () => {
  const router = useRouter();

  return useMutation({
    mutationFn:(payload)=> checkoutService.placeOrder(payload),
    retry:false
  });
};
