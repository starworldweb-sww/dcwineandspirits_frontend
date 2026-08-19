import axiosInstance from "@/config/axiosConfig";



const BASE_URL = "/order-details"; 
export const orderService = {
  getOrderHistory: async () => {
    const { data } = await axiosInstance.get(`/order-details/order-history`);
    return data;
  },

  getOrderInfoById: async (orderId) => {
    const { data } = await axiosInstance.get(`/order-details/order-info/${orderId}`);
    return data;
  },

  trackOrder: async (payload) => {
    const { data } = await axiosInstance.post(`/track-order`, payload);
    return data;
  },
};