import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8081/', // ← 본인 API 주소
  timeout: 10000,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken'); // 또는 sessionStorage 등
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;