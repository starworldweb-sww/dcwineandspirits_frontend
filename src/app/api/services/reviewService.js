import axiosInstance from "@/config/axiosConfig";


export const reviewService = {
 
  writeReivewOnProduct: async (data) => {
    const res = await axiosInstance.post(`/review`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res?.data;
  },
};