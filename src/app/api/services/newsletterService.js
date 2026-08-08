import axiosInstance from "@/config/axiosConfig"; // apna actual path daal dena

export const newsletterService = {
  subscribe: async (email) => {
    try {
      const res = await axiosInstance.post("/newsletter/subscribe", { email });

      if (res.data && res.data.success) {
        return {
          success: true,
          message: res.data.message,
          data: res.data.data,
        };
      }

      // Backend responded but success flag false (e.g. already subscribed)
      return {
        success: false,
        message: res.data?.message || "Something went wrong. Please try again later.",
      };
    } catch (error) {
      console.error("Failed to subscribe to newsletter:", error);

      
      return {
        success: false,
        message:
          error?.response?.data?.message ||
          "Something went wrong. Please try again later.",
      };
    }
  },
};