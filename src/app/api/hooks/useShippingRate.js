import { shippingRateKeys } from "@/libs/queryKeys"
import { useQuery } from "@tanstack/react-query"
import { shippingRateService } from "../services/shippingRateService"

export const useshippingRate = ({ countryId, zoneId, quantity, postcode = "", productIds = [] }) => {
    const idsKey = productIds.join(",")

    return useQuery({
        queryKey: [
            ...shippingRateKeys.getShippingRate(countryId, zoneId, quantity),
            postcode,
            idsKey,
        ],
        queryFn: () =>
            shippingRateService.getShippingRate(countryId, zoneId, quantity, postcode, productIds),
        enabled: !!zoneId,
    })
}