 // Adjust this path if needed

import axiosInstance from "@/config/axiosConfig";

export const productsService = {
  getAllProducts: async () => {
    try {
      const res = await axiosInstance.get('/products');
       console.log("res",res)
      // Check if your backend returned the success flag
      if (res.data && res.data.success) {
        // Return the inner 'data' object which contains { allbrand: [...] }
        return res.data.data; 
      }
      
      // Fallback if the API responds but success is false
      return { allbrand: [] };
      
    } catch (error) {
      console.error("Failed to fetch products:", error);
      
      // Safe fallback so React Query never throws the "undefined" error
      return { allbrand: [] }; 
    }
  },

  // ... any other service methods you have can go here
};