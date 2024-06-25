import React, { useEffect } from 'react';
import EventsSchedule from './eventsSchedule';
import './styles/dash.css';
import { useNavigate } from 'react-router-dom';
import { isAuth } from './auth';

const Dash = () => {
    const navigate = useNavigate();
    const handleAdd = () => {
        navigate('/create');
    };

    useEffect(() => {
        const checkAuth = async () => {
            const authenticated = await isAuth(navigate);
            if (authenticated) {
                console.log("logged in");
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
        </div>
    );
};

export default Dash;
