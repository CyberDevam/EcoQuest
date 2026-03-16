import axios from 'axios';

const API_URL = 'https://ecoquest-prw3.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Add a request interceptor to handle JSON headers
api.interceptors.request.use(
  (config) => {
    config.headers['Content-Type'] = 'application/json';
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle unauthorized errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
)

export default api;
