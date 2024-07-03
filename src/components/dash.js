import React, { useEffect } from 'react';
import EventsSchedule from './eventsSchedule';
import './styles/dash.css';
import { useNavigate } from 'react-router-dom';
import { isAuth } from './auth';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

const Dash = () => {
    const navigate = useNavigate();
    const handleAdd = () => {
        navigate('/create');
    };

    useEffect(() => {
        const checkAuth = async () => {
            const authenticated = await isAuth(navigate);
            if (!authenticated) {
                console.log("not auth");
            }
        };
        checkAuth();
    }, [navigate]);

    return (
        <div className='dash-container'>
            <EventsSchedule />
            <button className='add-button' onClick={handleAdd}>
                <i className='fas fa-plus'></i>
            </button>
            <ToastContainer/>
        </div>
    );
};

export default Dash;
