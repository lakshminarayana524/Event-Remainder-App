import React, { useEffect, useState } from 'react';
import './styles/eventsch.css'
import api from '../api';

const EventsSchedule = () => {
    const [events, setEvents] = useState([]);

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

    return (
        <div className='events-body'>
            <div className='events-container'>
                <div className='event-content'>
                    <div className='event-details'>
                        <h2>Events Scheduled</h2>
                        {events.length > 0 ? (
                            <div className='event-cards'>
                                {events.map(event => (
                                    <div className='event-card' key={event.id}>
                                        <div className='event-name'>
                                            <h3>{event.name}</h3>
                                            <div className='event-details' key={event._id}>
                                                <p className='event-desc'>{event.title}</p>
                                                <p className='event-time'>{new Date(event.eventDate).toLocaleString()}</p>
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
