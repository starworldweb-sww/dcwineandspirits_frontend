import { shippingRateKeys } from "@/libs/queryKeys"
import { useQuery } from "@tanstack/react-query"
import { shippingRateService } from "../services/shippingRateService"

export const useshippingRate = ({ countryId, zoneId, quantity }) => {
    
    return useQuery({
        queryKey: shippingRateKeys.getShippingRate(countryId, zoneId, quantity),
        queryFn: () => shippingRateService.getShippingRate(countryId, zoneId, quantity),

    })
}