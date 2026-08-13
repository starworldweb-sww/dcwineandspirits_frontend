import { cartKeys } from "@/libs/queryKeys"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { cartServices } from "../../services/cartServices"
import { toast } from "sonner"

const normalizePayload = (payload) => {
  if (payload == null) return null
  if (typeof payload === "string" || typeof payload === "number") {
    return { product_id: payload }
  }
  if (typeof payload === "object" && !payload.product_id) {
    payload.product_id = payload.id || payload.productId
  }
  return payload
}

export const useAddtoCart = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: cartKeys.addtoCart(),
        mutationFn: (payload) => {
          const normalized = normalizePayload(payload);
          if (!normalized?.product_id) {
            return Promise.reject(new Error("Invalid product"));
          }
          return cartServices.addToCart(normalized);
        },
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: cartKeys.getCartList() });
            if (res && !res.success) {
                toast.error(res.message || "Failed to add item to cart");
            }
        },
        onError: (err) => {
            const msg = err?.message || "Could not add to cart. Please try again.";
            toast.error(msg);
        },
    });
}