import axiosInstance from "@/config/axiosConfig";

export const cartServices = {
  addToCart: async (payload) => {
    const {
      product_id,
      quantity = 1,
      option = {},
      recurring_id = 0,
      files = [],
    } = typeof payload === "object" && payload !== null
      ? payload
      : { product_id: payload };

    if (!product_id) throw new Error("product_id is required");

    const hasFiles = Array.isArray(files) && files.length > 0;
    const hasComplexOption =
      option &&
      typeof option === "object" &&
      Object.values(option).some(
        (v) =>
          v instanceof File ||
          (Array.isArray(v) && v.some((f) => f instanceof File)),
      );

    if (hasFiles || hasComplexOption) {
      const formData = new FormData();
      formData.append("product_id", String(product_id));
      formData.append("quantity", String(quantity));
      formData.append("recurring_id", String(recurring_id));

      if (option && typeof option === "object") {
        Object.entries(option).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            value.forEach((v, i) => {
              if (v instanceof File) {
                formData.append(`option[${key}][]`, v);
              } else {
                formData.append(`option[${key}][${i}]`, v != null ? v : "");
              }
            });
          } else if (value instanceof File) {
            formData.append(`option[${key}]`, value);
          } else if (value != null) {
            formData.append(`option[${key}]`, value);
          }
        });
      }

      if (Array.isArray(files)) {
        files.forEach((f, i) => {
          if (f instanceof File) formData.append(`option_file_${i}`, f);
        });
      }

      const res = await axiosInstance.post(`/cart/add`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res?.data;
    }

    const res = await axiosInstance.post(`/cart/add`, {
      product_id,
      quantity,
      option,
      recurring_id,
    });
    return res?.data;
  },

  getCartList: async (page = 1, limit = 12) => {
    const res = await axiosInstance.get(`/cart`, {
      params: { page, limit },
    });
    return res?.data?.data || [];
  },

  clearCart: async (cartId) => {
    const res = await axiosInstance.delete(`/cart/delete/${cartId}`);
    return res?.data || [];
  },

  updatedCart: async (cart_id, quantity) => {
    const res = await axiosInstance.put(`/cart/update`, {
      cart_id,
      quantity,
    });
    return res?.data || [];
  },

  clearCart: async (cartId) => {
    const res = await axiosInstance.delete(`/cart/delete/${cartId}`);
    return res?.data || [];
  },
};
