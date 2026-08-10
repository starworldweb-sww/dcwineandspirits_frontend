import axiosInstance from "@/config/axiosConfig";

export const getMobileCategories = async () => {
  try {
    const response = await axiosInstance.get("/mobile-category");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};