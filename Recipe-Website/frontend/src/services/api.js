import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // Backend URL
  withCredentials: true, // Allow sending cookies/JWT
});

// Optional: Attach token (if using localStorage or cookies)
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
