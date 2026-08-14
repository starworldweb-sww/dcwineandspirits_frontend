import axiosInstance from "@/config/axiosConfig"
import { useMutation } from "@tanstack/react-query"
import { login } from "../../services/authService"

export const useCheckoutLogin = () => {
    return useMutation({
        mutationFn: (data) => login(data),
    })
}