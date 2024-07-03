import api from '../api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const isAuth = async (navigate) => {
    try {
        const response = await api.get('/auth/verify-session');
        if (response.data.isAuthenticated) {
            return true;
        } else {
            navigate('/login');
            return false;
        }
    } catch (error) {
        console.error('Error checking authentication:', error);
        toast.error('Something went wrong. Please try again.');
        navigate('/login');
        return false;
    }
};
