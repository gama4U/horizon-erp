
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
const api = axios.create();

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('sessionToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    config.baseURL = import.meta.env.VITE_REST_BASE_URL;
    config.timeout = 60000;
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    const statusCode = error.response?.status
    if (statusCode === 401) {
      localStorage.removeItem('sessionToken');
      localStorage.removeItem('sessionUser');
    }
    return Promise.reject(error)
  }
);

export default api;
