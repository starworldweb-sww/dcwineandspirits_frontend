import { customerAddressKeys } from "@/libs/queryKeys"
import { customerAddressService } from "../../services/customerAddressService"
import { useQuery } from "@tanstack/react-query"

export const useCountryget = () => {

    return useQuery({
        queryKey: customerAddressKeys.getCountryList(),
        queryFn: () => customerAddressService.getCountryList()
    })


}