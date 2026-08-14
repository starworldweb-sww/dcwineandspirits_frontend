import { useMutation, useQueryClient } from "@tanstack/react-query";
import { customerAddressService } from "../../services/customerAddressService";
import { customerAddressKeys } from "@/libs/queryKeys";


export const useUpdateAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: customerAddressKeys.updateAddress(),
    mutationFn: ({ addressId, payload }) =>
      customerAddressService.updateAddress(addressId, payload),
    onSuccess: () => {
      // 1. Step: list wapas fresh karo taki updated address dikhe
      queryClient.invalidateQueries({
        queryKey: customerAddressKeys.getAddressesList(),
      });
    },
  });
};