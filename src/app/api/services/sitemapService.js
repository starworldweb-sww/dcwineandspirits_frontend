import axiosInstance from "@/config/axiosConfig";

export const sitemapService = {
  getAllSitemapData: async () => {
    try {
      const res = await axiosInstance.get("/sitemap/all");

      if (res.data && res.data.success) {
        return res.data.data;
      }

      return {
        categories: { flat: [], tree: [] },
        products: [],
        brands: [],
        blogs: [],
        blogCategories: [],
        infoPages: [],
      };
    } catch (error) {
      console.error("Failed to fetch sitemap data:", error);
      return {
        categories: { flat: [], tree: [] },
        products: [],
        brands: [],
        blogs: [],
        blogCategories: [],
        infoPages: [],
      };
    }
  },

  getCategoriesForSitemap: async () => {
    try {
      const res = await axiosInstance.get("/sitemap/categories");

      if (res.data && res.data.success) {
        return res.data.data;
      }

      return { flat: [], tree: [] };
    } catch (error) {
      console.error("Failed to fetch sitemap categories:", error);
      return { flat: [], tree: [] };
    }
  },

  getProductsForSitemap: async () => {
    try {
      const res = await axiosInstance.get("/sitemap/products");

      if (res.data && res.data.success) {
        return res.data.data;
      }

      return [];
    } catch (error) {
      console.error("Failed to fetch sitemap products:", error);
      return [];
    }
  },

  getBrandsForSitemap: async () => {
    try {
      const res = await axiosInstance.get("/sitemap/brands");

      if (res.data && res.data.success) {
        return res.data.data;
      }

      return [];
    } catch (error) {
      console.error("Failed to fetch sitemap brands:", error);
      return [];
    }
  },

  getBlogsForSitemap: async () => {
    try {
      const res = await axiosInstance.get("/sitemap/blogs");

      if (res.data && res.data.success) {
        return res.data.data;
      }

      return [];
    } catch (error) {
      console.error("Failed to fetch sitemap blogs:", error);
      return [];
    }
  },

  getBlogCategoriesForSitemap: async () => {
    try {
      const res = await axiosInstance.get("/sitemap/blog-categories");

      if (res.data && res.data.success) {
        return res.data.data;
      }

      return [];
    } catch (error) {
      console.error("Failed to fetch sitemap blog categories:", error);
      return [];
    }
  },

  getInformationPagesForSitemap: async () => {
    try {
      const res = await axiosInstance.get("/sitemap/information");

      if (res.data && res.data.success) {
        return res.data.data;
      }

      return [];
    } catch (error) {
      console.error("Failed to fetch sitemap information pages:", error);
      return [];
    }
  },
};
