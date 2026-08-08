import { cartKeys } from "@/libs/queryKeys"
import { useQuery } from "@tanstack/react-query"
import { cartServices } from "../../services/cartServices"

export const useGetCartList =  ()=>{
    return useQuery({
        queryKey:cartKeys.getCartList(),
        queryFn:()=>cartServices.getCartList()
    })
}