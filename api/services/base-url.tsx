// base-url.ts or auth.ts (whichever you prefer)

import axios from "axios";

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: "http://localhost:8000",
});

// Request interceptor to attach token or redirect to login
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    // Optional: prevent infinite loop by checking current location
    if (window.location.pathname !== "/login") {
      window.location.href = "/login";
    }
  }
  return config;
});

export default axiosInstance;

// 🔒 Logout function
export const logoutUser = () => {
  // Clear local storage
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  localStorage.removeItem("username");
  localStorage.removeItem("role");

  // Optionally remove default Authorization header
  delete axiosInstance.defaults.headers.common["Authorization"];

  // Redirect to login page
  window.location.href = "/login";
};
