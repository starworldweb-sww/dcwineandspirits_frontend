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
      const res = await axiosInstance.get("/header-category/winegifts");

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
  },

   getShopByBrandTitle: async () => {
    try {
      const res = await axiosInstance.get("/header-category/shopByBrand-title");
      
      if (res.data && res.data.success) {
        return res.data.data;
      }
      return { sections: [] };
    } catch (error) {
      console.error("Failed to fetch shop by brand title:", error);
      return { sections: [] };
    }
  },


  // 7. For Top Category (singular - category specific, alag hai top-categories se)
    getTopCategory: async () => {
    try {
      const res = await axiosInstance.get("/header-category/top-category");
      
      if (res.data && res.data.success) {
        return res.data.data;
      }
      return { sections: [] };
    } catch (error) {
      console.error("Failed to fetch top category:", error);
      return { sections: [] };
    }
  },


    getOccasionMenu: async () => {
    try {
      const res = await axiosInstance.get("/header-category/occasion-menu");
      
      if (res.data && res.data.success) {
        return res.data.data;
      }
      return { sections: [] };
    } catch (error) {
      console.error("Failed to fetch occasion menu:", error);
      return { sections: [] };
    }
  },



  // 9. For Gifts By Dropdown - Main
    getGiftDropDown: async () => {
    try {
      const res = await axiosInstance.get("/header-category/giftDropDown");
      
      if (res.data && res.data.success) {
        return res.data.data;
      }
      return { sections: [] };
    } catch (error) {
      console.error("Failed to fetch gift dropdown:", error);
      return { sections: [] };
    }
  },

    // 10. For Gifts By Dropdown - Shop By Category
    getGiftDropDownShopByCategory: async () => {
    try {
      const res = await axiosInstance.get("/header-category/giftDropDown-shop-by-category");
      
      if (res.data && res.data.success) {
        return res.data.data;
      }
      return { sections: [] };
    } catch (error) {
      console.error("Failed to fetch gift dropdown shop by category:", error);
      return { sections: [] };
    }
  },

    // 11. For Gifts By Dropdown - Gift By Origin
    getGiftDropDownGiftByOrigin: async () => {
    try {
      const res = await axiosInstance.get("/header-category/giftDropDown-gift-by-origin");
      
      if (res.data && res.data.success) {
        return res.data.data;
      }
      return { sections: [] };
    } catch (error) {
      console.error("Failed to fetch gift dropdown gift by origin:", error);
      return { sections: [] };
    }
  },

    // 12. For Gifts By Dropdown - Shop By Price
    getGiftDropDownShopByPrice: async () => {
    try {
      const res = await axiosInstance.get("/header-category/giftDropDown-shop-by-price");
      
      if (res.data && res.data.success) {
        return res.data.data;
      }
      return { sections: [] };
    } catch (error) {
      console.error("Failed to fetch gift dropdown shop by price:", error);
      return { sections: [] };
    }
  },
  // 13. For Personalization
    getPersonalization: async () => {
    try {
      const res = await axiosInstance.get("/header-category/personalization");
      
      if (res.data && res.data.success) {
        return res.data.data;
      }
      return { sections: [] };
    } catch (error) {
      console.error("Failed to fetch personalization:", error);
      return { sections: [] };
    }
  },

    getWineGiftsPage: async () => {
    try {
      const res = await axiosInstance.get("/winegifts");
      
      if (res.data && res.data.success) {
        return res.data.data;
      }
      return { sections: [] };
    } catch (error) {
      console.error("Failed to fetch wine gifts page:", error);
      return { sections: [] };
    }
  },


  // 15. For Occasion Treasures (Maps to: GET /header-category/occasion-treasures)
  getOccasionTreasures: async () => {
    try {
      const res = await axiosInstance.get("/header-category/occasion-treasures");
      
      if (res.data && res.data.success) {
        return res.data.data;
      }
      return { sections: [] };
    } catch (error) {
      console.error("Failed to fetch occasion treasures:", error);
      return { sections: [] };
    }
  },

  getHomePageAllData: async () => {
    try {
      const res = await axiosInstance.get("/header-category/home-page-all-data");

      if (res.data && res.data.success) {
        return res.data.data;
      }
      return {};
    } catch (error) {
      console.error("Failed to fetch home page all data:", error);
      return {};
    }
  },
};
