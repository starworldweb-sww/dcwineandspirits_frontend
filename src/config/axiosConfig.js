// @/config/axiosConfig.js
import axios from 'axios';

const baseURL = `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/api/v1`;

const axiosInstance = axios.create({
  baseURL: baseURL,
  withCredentials: true
});

export default axiosInstance;