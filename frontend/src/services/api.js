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

    const responseData = error.response?.data;

    if (
      responseData?.code === 'VALIDATION_ERROR' &&
      Array.isArray(responseData.details) &&
      responseData.details.length > 0
    ) {
      responseData.error = responseData.details
        .map((item) => `${item.field}: ${item.message}`)
        .join(' · ');
    }

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
