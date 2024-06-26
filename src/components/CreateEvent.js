import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import './styles/create.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { isAuth } from './auth';
import Loader from './loader';

const CreateEvent = () => {
    const navigate = useNavigate();
    const [load ,setload]= useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        eventDate: '',
        reminderDate: ''
    });

    useEffect(() => {
        setload(true);
        const checkAuth = async () => {
            const authenticated = await isAuth(navigate);
            if (authenticated) {
                console.log('Authenticated')
                setload(false);
            }else{

                navigate('/login');
                setload(false);
            }   
        };
        checkAuth();
    }, [navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        setload(true);
        e.preventDefault();
        try {
            const res = await api.post('/event/create', formData);
            if (res.data.msg === 'Event Created') {
                toast.success('Event created successfully!');
                navigate('/dash');
                setload(false)
            }
        } catch (error) {
            console.error('Error creating event:', error);
            setload(false);
            toast.error('Failed to create event. Please try again.');
        }
    };

    const handleBack = ()=>{
        navigate('/dash');
    }

    if (load) {
        return<Loader/>;
    }

    return (
        <div className="container">
            <button className='button-back' onClick={handleBack}>Back</button>
        <div className="create-event-container">
            <h2>Create Event</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="title" placeholder="Title" value={formData.title} onChange={handleChange} required />
                <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange}></textarea>
                <input type="datetime-local" name="eventDate" value={formData.eventDate} onChange={handleChange} required />
                <input type="datetime-local" name="reminderDate" value={formData.reminderDate} onChange={handleChange} required />
                <button type="submit">Create Event</button>
            </form>
            <ToastContainer />
        </div>
        </div>
    );
};

export default CreateEvent;
