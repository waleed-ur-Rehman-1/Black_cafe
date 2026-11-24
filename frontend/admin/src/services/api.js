import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1',
  withCredentials: true,
});

api.interceptors.response.use(
  r => r,
  err => {
    if (err.response?.status === 401 && !location.pathname.includes('/login')) {
      location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;