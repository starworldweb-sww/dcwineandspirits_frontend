import axiosInstance from "@/config/axiosConfig"


export const couponService = {

    getCoupon: async (code, cartTotal, customerId) => {
       
        const res = await axiosInstance.post(`/coupon`, { code:code, cartTotal:cartTotal, customerId:customerId })
        return res?.data;
    }



}