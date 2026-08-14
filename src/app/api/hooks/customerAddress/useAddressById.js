import { customerAddressKeys } from "@/libs/queryKeys";
import { customerAddressService } from "../../services/customerAddressService";
import { useQuery } from "@tanstack/react-query";

export const useAddressById = (addressId) => {
  return useQuery({
    queryKey: customerAddressKeys.getAddressById(addressId),
    queryFn: () => customerAddressService.getAddressById(addressId),
    enabled: !!addressId,
  });
};