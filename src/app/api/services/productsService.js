 // Adjust this path if needed

import axiosInstance from "@/config/axiosConfig";

export const productsService = {
  getAllProducts: async ({ showNum, pageParam = 1 }) => {
    
    try {
      const res = await axiosInstance.get('/products', {
        params: { page: pageParam, limit: showNum ?? 24 }
      });
    
      // Check if your backend returned the success flag
      if (res.data && res.data.success) {
        // Return the inner 'data' object which contains { allbrand: [...] }
        return res.data.data; 
      }
      
      // Fallback if the API responds but success is false
      return { allbrand: [], allproducts: [], total: 0, page: 1, limit: 24, totalPages: 0 };
      
    } catch (error) {
      console.error("Failed to fetch products:", error);
      
      // Safe fallback so React Query never throws the "undefined" error
      return { allbrand: [], allproducts: [], total: 0, page: 1, limit: 24, totalPages: 0 }; 
    }
  },

  getProductBySlugOrId: async (slug) => {
    try {
      const res = await axiosInstance.get(`/products/${slug}`);
      if (res.data && res.data.success) {
        return res.data.data;
      }
      return { type: "not_found" };
    } catch (error) {
      console.error("Failed to fetch product by slug:", error);
      return { type: "not_found" };
    }
  },

  getSingleProductDetails: async (slug) => {
    try {
      const res = await axiosInstance.get(`/products/single-product/${slug}`);
      if (res.data && res.data.success) {
        return res.data.data;
      }
      return { type: "not_found" };
    } catch (error) {
      console.error("Failed to fetch single product details:", error);
      return { type: "not_found" };
    }
  },
};