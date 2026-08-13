import { customerAddressKeys } from "@/libs/queryKeys"
import { customerAddressService } from "../../services/customerAddressService"
import { useQuery } from "@tanstack/react-query"

export const useGetAddresses = (enabled = true) => {

    return useQuery({
        queryKey: customerAddressKeys.getAddressesList(),
        queryFn: () => customerAddressService.getAddresses(),
        enabled,
        retry: false,
        staleTime: 1000 * 60 * 2,
    })

}
