import axiosInstance from "@/config/axiosConfig"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { login } from "../../services/authService"
import { cartKeys, customerKeys } from "@/libs/queryKeys";
import { useRouter } from "next/router";
import { toast } from "sonner";

export const useCheckoutLogin = () => {
    const queryClient =  useQueryClient();
  
    return useMutation({
        mutationFn: (data) => login(data),
        onSuccess:(data)=>{
            queryClient.invalidateQueries({queryKey:customerKeys.profile()})
            queryClient.invalidateQueries({queryKey:cartKeys.getCartList()})
            toast.success(data?.message)
        },
        onError:(error)=>{
           toast.error(error?.message)
           
        }
    })
}