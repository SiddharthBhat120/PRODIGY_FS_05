// ====================================
// API Utility
// Axios instance with base URL and auth header
// Import this instead of axios directly
// ====================================

import axios from "axios";

// Base URL of your backend
const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Attach token to every request automatically
// So you don't have to manually add it in every component
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
