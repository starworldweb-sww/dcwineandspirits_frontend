import axiosInstance from "@/config/axiosConfig";

export const checkoutService = {
  placeOrder: async (orderData) => {
    try {
      const response = await axiosInstance.post("/checkout", orderData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  createPaymentIntent: async (payload) => {
    try {
      const response = await axiosInstance.post(
        "/checkout/create-payment-intent",
        payload
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};
