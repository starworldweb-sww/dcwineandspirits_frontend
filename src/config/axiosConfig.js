// @/config/axiosConfig.js
import axios from 'axios';

const baseURL = `${process.env.NEXT_PUBLIC_BACKEND_URL }`;

const axiosInstance = axios.create({
  baseURL: baseURL,
  withCredentials: true
});

export default axiosInstance;