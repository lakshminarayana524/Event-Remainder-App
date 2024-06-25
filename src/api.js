import axios from 'axios';

const api = axios.create({
    // baseURL:"https://event-remainder-app.onrender.com/api",
    baseURL: 'http://localhost:5000/api',
    withCredentials: true,
});

export default api;
