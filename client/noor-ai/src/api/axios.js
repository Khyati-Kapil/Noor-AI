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
  withCredentials: true, 
  headers: {
    "Content-Type": "application/json"
  }
});


api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      
      console.log("Unauthorized - token may be expired or invalid");
    }
    return Promise.reject(error);
  }
);

export default api;

