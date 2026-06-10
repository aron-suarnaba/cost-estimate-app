import axios from 'axios'

const api = axios.create({
  // If the backend is running in HTTPS profile, override this value with VITE_API_BASE_URL
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'https://localhost:7282/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

export default api
