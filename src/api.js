// api.js
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

axios.defaults.withCredentials = true

const api = axios.create({
    baseURL:'https://event-remainder-app.onrender.com/api',
    // baseURL: 'http://localhost:5000/api',
});

api.interceptors.request.use(config => {
    const userId = localStorage.getItem('userId');

    if (userId) {
        config.headers['user-id'] = userId;
    }
    return config;
});

export default api;
