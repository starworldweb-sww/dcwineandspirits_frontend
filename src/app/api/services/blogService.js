import axiosInstance from "@/config/axiosConfig";


export const blogService = {
  getAllPosts: async (params = {}) => {
    const { data } = await axiosInstance.get("/blog/posts", { params });
    return data?.data; 
  },
  getAllCategory: async () => {
    const { data } = await axiosInstance.get("/blog/categories");
    return data?.data; 
  },

  getPostBySlug: async (slug) => {
    const response = await axiosInstance.get(`blog/posts/${slug}`);
    return response.data.data; 
  },



  countViews: async (post_id) => {
    const { data } = await axiosInstance.post("/blog/view-count", { post_id });
    return data?.data;
  },
   


  searchByKeyword: async ({ keyword, page = 1, limit = 10 }) => {
    const { data } = await axiosInstance.get("/blog/search", {
      params: { keyword, page, limit },
    });
    return data?.data; 
  },


};