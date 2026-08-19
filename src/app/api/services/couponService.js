import axiosInstance from "@/config/axiosConfig"


export const couponService = {

    getCoupon: async (code, cartTotal) => {
       
        const res = await axiosInstance.post(`/coupon`, { code:code, cartTotal:cartTotal })
        return res?.data;
    }



}