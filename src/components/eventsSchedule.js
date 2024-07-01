import React, { useEffect, useState } from 'react';
import './styles/eventsch.css';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const EventsSchedule = () => {
    const [events, setEvents] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await api.get('/event/getevents');
                setEvents(response.data);
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        };
        fetchEvents();
    }, []);

    const handleClick=(eventId)=>{
        console.log("Schedule:" + eventId)
        navigate(`/event_detail/${eventId}`);
    }

    return (
        <div className='events-body'>
            <div className='events-container'>
                <div className='event-content'>
                    <div className='event-details'>
                        <h2>Events Scheduled</h2>
                        {events.length > 0 ? (
                            <div className='event-cards'>
                                {events.map(event => (
                                    <div className='event-card' key={event._id} onClick={()=>handleClick(event._id)}>
                                        <div className='event-name'>
                                            <h3>{event.title}</h3>
                                            <div className='event-details'>
                                                <p className='event-desc'>{event.description}</p>
                                                <p className='event-time'>{new Date(event.eventDate).toLocaleString()}</p>
                                                <p className='event-time'>{new Date(event.reminderDate).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p>No events scheduled</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventsSchedule;
