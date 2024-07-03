import React, { useState,useEffect } from 'react';
import EventsSchedule from './eventsSchedule';
import './styles/dash.css';
import { useNavigate } from 'react-router-dom';
import { isAuth } from './auth';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import Loader from './loader'

const Dash = () => {
    const navigate = useNavigate();

    const [load,setload]=useState(false);

    const handleAdd = () => {
        navigate('/create');
    };

    const handleLogout = async() => {
        setload(true);
        localStorage.clear();
        toast.info('Logged out successfully');
        await new Promise(resolve => setTimeout(resolve, 2000));

        setload(false);
        navigate('/');
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

    if(load){
        return <Loader/>
    }

    return (
        <div className='dash-container'>
            <EventsSchedule />
            <button className='add-button' onClick={handleAdd}>
                <i className='fas fa-plus'></i>
            </button>
            <button className='logout-button' onClick={handleLogout}>
                <i className='fas fa-sign-out-alt'></i>
            </button>
            <ToastContainer/>
        </div>
    );
};

export default Dash;
