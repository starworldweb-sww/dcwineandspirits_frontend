import axiosInstance from "@/config/axiosConfig";


export const login = async (credentials) => {
  try {
    const response = await axiosInstance.post('/customer/login', credentials);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const register = async (userData) => {
  try {
    const response = await axiosInstance.post('/customer/register', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const logout = async () => {
  try {
    const response = await axiosInstance.post('/customer/logout');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const changePassword = async (passwordData) => {
  try {
    const response = await axiosInstance.put('/customer/change-password', passwordData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getProfile = async () => {
  try {
    const response = await axiosInstance.get('/customer/profile');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const forgotPassword = async (email) => {
  try {
    const response = await axiosInstance.post('/customer/forgot-password', { email });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const resetPassword = async (resetData) => {
  try {
    const response = await axiosInstance.post('/customer/reset-password', resetData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateAccountInformation = async (infoData) => {
  try {
    const response = await axiosInstance.put('/customer/edit-information', infoData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
