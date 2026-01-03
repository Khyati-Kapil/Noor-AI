import axios from "axios";

const getApiUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  if (import.meta.env.DEV) {
    return "http://localhost:5000";
  }
  
  return "http://localhost:5000";
};


const api = axios.create({
  baseURL: getApiUrl(),
  
  headers: {
    "Content-Type": "application/json"
  }
});

api.interceptors.request.use(
  (config) => {
   
    const token = sessionStorage.getItem("authToken");
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
     
      sessionStorage.removeItem("authToken");
      sessionStorage.removeItem("user");
      
      if (typeof window !== "undefined" && !window.location.origin.startsWith("null")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;

