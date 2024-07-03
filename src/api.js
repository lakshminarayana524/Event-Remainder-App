// api.js
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
});

api.interceptors.request.use(config => {
    const userId = localStorage.getItem('userId');

    if (userId) {
        config.headers['user-id'] = userId;
    }
    return config;
});

export default api;
