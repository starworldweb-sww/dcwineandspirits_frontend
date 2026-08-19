import { useMutation, useQueryClient } from "@tanstack/react-query"
import { cartServices } from "../../services/cartServices"
import { cartKeys } from "@/libs/queryKeys";

export const useupdatedCart = ()=>{
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn:({cart_id,quantity})=>cartServices.updatedCart(cart_id,quantity),
        onSuccess:()=>{
           queryClient.invalidateQueries({queryKey:cartKeys.getCartList()})
        }
    })
}