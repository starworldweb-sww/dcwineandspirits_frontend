import axiosInstance from "@/config/axiosConfig";


export const blogService = {
  getAllPosts: async (params = {}) => {
    const { data } = await axiosInstance.get("/blog/posts", { params });
    return data?.data; 
  },



  getPostBySlug: async (slug) => {
    const response = await axiosInstance.get(`blog/posts/${slug}`);
    return response.data.data; 
  },

};