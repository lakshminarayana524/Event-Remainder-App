import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import './styles/create.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateEvent = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        eventDate: '',
        reminderDate: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/event/create', formData);
            if (res.data.msg === 'Event Created') {
                toast.success('Event created successfully!');
                navigate('/dash');
            }
        } catch (error) {
            console.error('Error creating event:', error);
            toast.error('Failed to create event. Please try again.');
        }
    };

    return (
        <div className="create-event-container">
            <h2>Create Event</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="title" placeholder="Title" value={formData.title} onChange={handleChange} required />
                <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange}></textarea>
                <input type="datetime-local" name="eventDate" value={formData.eventDate} onChange={handleChange} required />
                <input type="datetime-local" name="reminderDate" value={formData.reminderDate} onChange={handleChange} required />
                <button type="submit">Create Event</button>
            </form>
        </div>
    );
};

export default CreateEvent;
