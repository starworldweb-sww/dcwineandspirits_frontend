import axiosInstance from "@/config/axiosConfig";

export const categoryService = {
  // 1. For Category
  getCategory: async () => {
    try {
      const res = await axiosInstance.get("/category");


      if (res.data && res.data.success) {
        return res.data.data;
      }

      return { categories: [] };
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      return { categories: [] };
    }
  },

  // 2. For Header Category
  getHeaderCategory: async () => {
    try {
      const res = await axiosInstance.get("/header-category");


      if (res.data && res.data.success) {
        return res.data.data;
      }

      return { headerCategories: [] };
    } catch (error) {
      console.error("Failed to fetch header categories:", error);
      return { headerCategories: [] };
    }
  },

  // 3. For Home Page Products (Bestsellers, New Arrivals, etc.)
  getHomePageProducts: async () => {
    try {
      const res = await axiosInstance.get(
        "/header-category/home-page-products",
      );


      if (res.data && res.data.success) {
        return res.data.data;
      }

      return { sections: [] };
    } catch (error) {
      console.error("Failed to fetch home page products:", error);
      return { sections: [] };
    }
  },

  // 4. For Home Page Top Banner
  getHomePageTopBanner: async () => {
    try {
      // Agar backend mein API path different hai, toh adjust kar lena
      const res = await axiosInstance.get(
        "/header-category/home-page-top-banner",
      );


      if (res.data && res.data.success) {
        return res.data.data;
      }

      // Fallback
      return { banners: [] };
    } catch (error) {
      console.error("Failed to fetch home page top banner:", error);
      return { banners: [] };
    }
  },

  // 5. For Shop By Brand (Category)
  getShopByBrand: async () => {
    try {
      const res = await axiosInstance.get("/header-category/shop-by-brand");

      if (res.data && res.data.success) {
        return res.data.data;
      }
      return { sections: [] };
    } catch (error) {
      console.error("Failed to fetch shop by brand:", error);
      return { sections: [] };
    }
  },



  // 6. For Gift By Occasion
  getGiftByOccasion: async () => {
    try {
      const res = await axiosInstance.get("/header-category/gift-by-occasion");

      if (res.data && res.data.success) {
        return res.data.data;
      }
      return { sections: [] };
    } catch (error) {
      console.error("Failed to fetch gift by occasion:", error);
      return { sections: [] };
    }
  },



  getWineGifts: async () => {
    try {
      const res = await axiosInstance.get("/header-category/wine-gifts");

      if (res.data && res.data.success) {
        return res.data.data;
      }
      return { sections: [] };
    } catch (error) {
      console.error("Failed to fetch wine gifts:", error);
      return { sections: [] };
    }
  },



  getTopCategories: async () => {
    try {
      const res = await axiosInstance.get("/header-category/top-categories");

      if (res.data && res.data.success) {
        return res.data.data;
      }
      return { sections: [] };
    } catch (error) {
      console.error("Failed to fetch top categories:", error);
      return { sections: [] };
    }
  },


  getHomePageText: async () => {
    try {
      // Adjust the endpoint to "/header-category/home-page-text" if needed
      const res = await axiosInstance.get("/header-category/home-page-text");

      if (res.data && res.data.success) {
        return res.data.data;
      }
      return null; // Fallback value, change to {} or [] if your component expects a specific type
    } catch (error) {
      console.error("Failed to fetch home page text:", error);
      return null;
    }
  },


  getLovebyBanners: async () => {
    try {
      // Adjust the endpoint to "/header-category/home-page-text" if needed
      const res = await axiosInstance.get("/header-category/love-banners");

      if (res.data && res.data.success) {
        return res.data.data;
      }
      return null;
    } catch (error) {
      console.error("Failed to fetch love by Bnanner: ", error);
      return null;
    }
  }
};
