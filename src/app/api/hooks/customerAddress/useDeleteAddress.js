import { customerAddressKeys } from "@/libs/queryKeys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { customerAddressService } from "../../services/customerAddressService";


export const useDeleteAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: customerAddressKeys.deleteAddress(),
    mutationFn: (addressId) => customerAddressService.deleteAddress(addressId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: customerAddressKeys.getAddressesList(),
      });
    },
  });
};