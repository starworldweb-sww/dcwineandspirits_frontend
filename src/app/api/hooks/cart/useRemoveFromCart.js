import { useMutation, useQueryClient } from "@tanstack/react-query"
import { cartServices } from "../../services/cartServices";
import { cartKeys } from "@/libs/queryKeys";

export const useRemoveFromCart = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (cartId) => cartServices.clearCart(cartId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: cartKeys.getCartList() })
        }
    })
}