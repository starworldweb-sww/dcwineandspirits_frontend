import axiosInstance from "@/config/axiosConfig";

export const testimonialServices = {
  getTestimonials: async (page = 1, limit = 12) => {
    const { data } = await axiosInstance.get("/testimonials", {
      params: { page, limit },
    });
    return data?.data;
  },
};