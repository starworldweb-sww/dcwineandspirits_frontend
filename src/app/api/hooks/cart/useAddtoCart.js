import { cartKeys } from "@/libs/queryKeys"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { cartServices } from "../../services/cartServices"

export const useAddtoCart = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: cartKeys.addtoCart(),
        mutationFn: (product_id) => cartServices.addToCart(product_id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: cartKeys.getCartList() })
        }
    })

}