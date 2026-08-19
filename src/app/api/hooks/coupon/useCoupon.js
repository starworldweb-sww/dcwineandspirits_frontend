
import { useMutation,  } from "@tanstack/react-query"
import { couponService } from "../../services/couponService"


export const useCoupon = () => {
    return useMutation({
        mutationFn: ({code,cartTotal}) => couponService.getCoupon(code, cartTotal),
    })
}