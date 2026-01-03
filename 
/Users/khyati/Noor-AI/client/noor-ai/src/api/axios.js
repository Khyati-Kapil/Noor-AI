
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const getApiUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  if (import.meta.env.DEV) {
    return "http://localhost:5000";
  }
  
  return "http://localhost:5000";
};

/**
 * API Client for Header-Based JWT Authentication
 * 
 * - No cookies or credentials
 * - Authorization header is automatically added to requests
 * - Token stored in React state/context (memory only)
 * 
 * Works with origin = null (PDF/sandboxed iframes)
 */
const api = axios.create({
  baseURL: getApiUrl(),
  // No withCredentials - we use Authorization header instead
  headers: {
    "Content-Type": "application/json"
  }
});

// Create a hook-based approach for getting the auth header
// This will be used by components that need to make API calls
export const createAuthenticatedApi = (token) => {
  return axios.create({
    baseURL: getApiUrl(),
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : undefined
    }
  });
};

// Export the base api instance
// Components should use useAuth() hook and pass token explicitly
export default api;

