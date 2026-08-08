import axiosInstance from "@/config/axiosConfig";

export const productsService = {
  getAllProducts: async ({ showNum, pageParam = 1 }) => {
    const res = await axiosInstance.get("/products", {
      params: { page: pageParam, limit: showNum ?? 24 },
    });

    if (res.data?.success) {
      return res.data.data;
    }

    throw new Error(res.data?.message || "Failed to fetch products");
  },

  getProductBySlugOrId: async (slug) => {
    const res = await axiosInstance.get(`/products/${slug}`);

    if (res.data?.success) {
      return res.data.data;
    }

    throw new Error(res.data?.message || "Product not found");
  },

  getSingleProductDetails: async (slug) => {
    const res = await axiosInstance.get(`/products/single-product/${slug}`);

    if (res.data?.success) {
      return res.data.data;
    }

    throw new Error(res.data?.message || "Product not found");
  },
};