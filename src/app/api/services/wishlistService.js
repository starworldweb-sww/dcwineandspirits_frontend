import axiosInstance from "@/config/axiosConfig";



const BASE_URL = '/wishlist';

// GET /api/v1/wishlist/
export const getWishlist = async (page = 1, limit = 12) => {
  const { data } = await axiosInstance.get(`${BASE_URL}`, {
    params: { page, limit },
  });
  return data;
};

// POST /api/v1/wishlist/add
export const addToWishlist = async (product_id) => {
  const { data } = await axiosInstance.post(`${BASE_URL}/add`, { product_id });
  return data;
};

// DELETE /api/v1/wishlist/delete/:product_id
export const removeFromWishlist = async (product_id) => {
  const { data } = await axiosInstance.delete(`${BASE_URL}/delete/${product_id}`);
  return data;
};

// GET /api/v1/wishlist/check/:product_id
export const checkWishlist = async (product_id) => {
  const { data } = await axiosInstance.get(`${BASE_URL}/check/${product_id}`);
  return data;
};