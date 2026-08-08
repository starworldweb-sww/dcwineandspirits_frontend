import axiosInstance from "@/config/axiosConfig"

export const cartServices = {

    addToCart: async (product_id,) => {
        const res = await axiosInstance.post(`/cart/add`,{product_id})
        return res?.data?.data || [];
    },
    
    getCartList:async()=>{
    const res = await axiosInstance.get(`/cart`)
    console.log("res",res)
    return res?.data?.data || []
    }


}