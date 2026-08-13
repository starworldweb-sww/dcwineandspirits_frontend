import { customerAddressKeys } from "@/libs/queryKeys"
import { useMutation } from "@tanstack/react-query"
import { customerAddressService } from "../../services/customerAddressService"

 export const useZoneget = ()=>{

    return useMutation({
        mutationKey:customerAddressKeys.getZoneList(),
        mutationFn:(countryId)=>customerAddressService.getZoneList(countryId)
    })
 }