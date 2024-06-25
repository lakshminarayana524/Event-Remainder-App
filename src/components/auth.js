import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../api';

// Function to check if the user is authenticated
export const isAuth = async (navigate) => {
    try {
        const response = await api.get(`/auth/verify-session`);
        if (response.data.isAuthenticated) {
            return true;
        } else {
            navigate('/login'); // Redirect to login page
            return false;
        }
    } catch (error) {
        console.error('Error checking authentication:', error);
        toast.error('Something went wrong. Please try again.');
        navigate('/login'); // Redirect to login page
        return false;
    }
};
