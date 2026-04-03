import axios from 'axios';
import { store } from '@/store';
import { logout, setCredentials } from '@/store/authSlice';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3015';

const apiInstance = axios.create({
  baseURL: BASE_URL,
});

// Request interceptor
apiInstance.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth.accessToken;
    const organizationId = localStorage.getItem('organizationId');

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Only send header if it's a valid ID (not empty, and not the string "null")
    if (organizationId && organizationId !== 'null' && organizationId.trim() !== '') {
      config.headers['x-organization-id'] = organizationId;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = 'Bearer ' + token;
            return apiInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('refreshToken');
      const userId = localStorage.getItem('userId');

      if (!refreshToken || !userId) {
        store.dispatch(logout());
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(`${BASE_URL}/core/auth/refresh`, {
          userId,
          refresh_token: refreshToken,
        });

        const { access_token, refresh_token: newRefreshToken, user } = response.data;
        
        store.dispatch(setCredentials({
          accessToken: access_token,
          user: user,
        }));

        localStorage.setItem('refreshToken', newRefreshToken);
        processQueue(null, access_token);
        
        originalRequest.headers['Authorization'] = 'Bearer ' + access_token;
        return apiInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        store.dispatch(logout());
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export const api = {
  get: (endpoint: string, config?: any) => apiInstance.get(endpoint, config).then(res => res.data),
  post: (endpoint: string, data?: any, config?: any) => apiInstance.post(endpoint, data, config).then(res => res.data),
  patch: (endpoint: string, data?: any, config?: any) => apiInstance.patch(endpoint, data, config).then(res => res.data),
  delete: (endpoint: string, config?: any) => apiInstance.delete(endpoint, config).then(res => res.data),
};
