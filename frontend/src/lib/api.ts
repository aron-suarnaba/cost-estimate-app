import axios from 'axios'

const api = axios.create({
  // If the backend is running in HTTPS profile, override this value with VITE_API_BASE_URL
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:7282/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add a request interceptor to automatically inject the JWT token
api.interceptors.request.use(
  (config) => {
    // Or however you are storing your token (localStorage is common)
    const token = localStorage.getItem('token'); 
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api