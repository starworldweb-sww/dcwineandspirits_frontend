import { customerAddressKeys } from "@/libs/queryKeys"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import { toast } from "sonner"
import { customerAddressService } from "../../services/customerAddressService"

export const useCreateAddress = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (payload) => customerAddressService.createAddress(payload),
        onSuccess: (data) => {
            toast.success(data?.message || "Address added successfully")
            queryClient.invalidateQueries({ queryKey: customerAddressKeys.getAddressesList() })
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to add address")
        },
    })
}