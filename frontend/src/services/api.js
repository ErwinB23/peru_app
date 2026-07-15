import axios from 'axios';

export const AUTH_UNAUTHORIZED_EVENT = 'auth:unauthorized';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 15000
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
    const status = error.response?.status;
    const requestUrl = error.config?.url || '';
    const hasStoredToken = Boolean(localStorage.getItem('token'));
    const isPublicAuthRequest =
      requestUrl.includes('/auth/login') || requestUrl.includes('/auth/register');

    if (status === 401 && hasStoredToken && !isPublicAuthRequest) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.dispatchEvent(
        new CustomEvent(AUTH_UNAUTHORIZED_EVENT, {
          detail: {
            message: error.response?.data?.error || 'La sesión expiró'
          }
        })
      );
    }

    return Promise.reject(error);
  }
);

export default api;
