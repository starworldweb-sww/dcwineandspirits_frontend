// useActiveCoupons.js (useCoupon wale folder mein hi rakho)
import { useQuery } from "@tanstack/react-query"
import { couponService } from "../../services/couponService"


export const useActiveCoupons = () => {
    return useQuery({
        queryKey: ["coupons", "active"],
        queryFn: () => couponService.getActiveCoupons(),

        staleTime: 5 * 60 * 1000,
    })
}