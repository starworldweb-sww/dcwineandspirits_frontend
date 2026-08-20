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

  // filter is spread first so an explicit page/limit always wins over
  // anything that might collide inside it
  getProductBySlugOrId: async (slug, filter = {}, page = 1, limit = 24) => {
    const res = await axiosInstance.get(`/products/${slug}`, {
      params: { ...filter, page, limit },
    });

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

  searchAllProducts: async (params) => {
    const res = await axiosInstance.get("/products/search", { params });

    if (res.data?.success) {
      return res.data.data;
    }

    throw new Error(res.data?.message || "Failed to search products");
  },

  // filter spread flat here too — search-results endpoint reads top-level
  // query params the same way getSearchResultsService does on the backend
  getSearchResults: async ({ search, page = 1, limit = 24, filter = {} }) => {
    const res = await axiosInstance.get("/products/search-results", {
      params: { search, ...filter, page, limit },
    });

    if (res.data?.success) {
      return res.data.data;
    }

    throw new Error(res.data?.message || "Failed to fetch search results");
  },
};