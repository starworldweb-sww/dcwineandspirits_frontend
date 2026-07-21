// @/config/axiosConfig.js
import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;

console.log("DEBUG: process.env.NEXT_PUBLIC_BACKEND_URL is:", baseURL); // Yeh console check karein

const axiosInstance = axios.create({
  baseURL: baseURL, 
  withCredentials: true
});

export default axiosInstance;