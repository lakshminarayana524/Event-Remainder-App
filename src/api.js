// api.js
import axios from 'axios';

axios.defaults.withCredentials=true;

const api = axios.create({
    baseURL: 'https://event-remainder-app.onrender.com/api',
    // baseURL:'http://localhost:5000/api',
    withCredentials: true,
});

api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
