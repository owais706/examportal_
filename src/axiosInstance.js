import axios from 'axios';

// Create an Axios instance with default configuration
const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080', // Your backend URL
    timeout: 1000,
});

// Interceptor to add JWT token to headers
axiosInstance.interceptors.request.use((config) => {
    const token = new URLSearchParams(window.location.search).get('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default axiosInstance;
