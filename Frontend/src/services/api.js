import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const path = window.location.pathname || '';
      const hasToken = Boolean(localStorage.getItem('token'));
      const url = String(error.config?.url || '');
      const isAuthCall = url.includes('/auth/login') || url.includes('/auth/me');
      if (!hasToken || isAuthCall) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = path.startsWith('/admin') ? '/admin' : '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
