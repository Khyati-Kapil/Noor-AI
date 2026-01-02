import axios from "axios";

// Configure axios for cookie-based auth (works with origin = null / PDF sandbox)
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  withCredentials: true, // Required for cookies to be sent
  headers: {
    "Content-Type": "application/json"
  }
});

// Response interceptor for error handling
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Clear any stale state - frontend should check auth status
      console.log("Unauthorized - token may be expired or invalid");
    }
    return Promise.reject(error);
  }
);

export default api;

