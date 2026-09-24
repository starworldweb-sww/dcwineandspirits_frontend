import axiosInstance from "@/config/axiosConfig"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner";


export const useContactpost = () => {
    return useMutation({
        mutationFn: async (value) => {
            const res = await axiosInstance.post(`/contact`,value);
            return res?.data ;

        },
        onSuccess: (data) => {
            toast.success(data?.message)
            console.log(data)
        },
        onError:(err)=>{
            console.log(err?.message)
        }

    })
}

export const useBulkOrder = () => {
    return useMutation({
        mutationFn: async (formData) => {
            const res = await axiosInstance.post(`/contact/bulk-order`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return res?.data;
        },
        onSuccess: (data) => {
            toast.success(data?.message)
            console.log(data)
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message || "Something went wrong. Please try again.")
            console.log(err?.message)
        }

    })
}