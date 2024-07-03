import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';
import Loader from './loader';
import './styles/event_details.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';


const EventDetails = () => {
    const { eventId } = useParams();
    const [event, setEvent] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [eventTime, setEventTime] = useState('');
    const [reminderDate, setReminderDate] = useState('');
    const [reminderTime, setReminderTime] = useState('');
    const [load, setLoad] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setLoad(true);
        const fetchEventDetails = async () => {
            // console.log("Event Id :" + eventId);
            try {
                const res = await api.get(`/event/getdetails/${eventId}`);
                setEvent(res.data.event);
                setTitle(res.data.event.title);
                setDescription(res.data.event.description);
                setEventDate(new Date(res.data.event.eventDate).toISOString().substring(0, 10));
                setEventTime(new Date(res.data.event.eventDate).toISOString().substring(11, 16));
                setReminderDate(new Date(res.data.event.reminderDate).toISOString().substring(0, 10));
                setReminderTime(new Date(res.data.event.reminderDate).toISOString().substring(11, 16));
                setLoad(false);
            } catch (err) {
                console.log("Unable to fetch the data for the event details: " + err);
                setLoad(false);
            }
        };
        fetchEventDetails();
    }, [eventId]);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = async () => {
        setLoad(true);
        try {
            await api.put(`/event/update/${eventId}`, { 
                title, 
                description, 
                eventDate: `${eventDate}T${eventTime}`, 
                reminderDate: `${reminderDate}T${reminderTime}` 
            });
            console.log("Update: "+eventId)
            setEvent({ title, description, eventDate: `${eventDate}T${eventTime}`, reminderDate: `${reminderDate}T${reminderTime}` });
            setIsEditing(false);
            setLoad(false);
        } catch (err) {
            console.log("Unable to update the event details: " + err);
            setLoad(false);
        }
    };

    const handleDelete = async()=>{
        setLoad(true);
        try{
            await api.delete(`/event/delete/${eventId}`)
            // console.log("Delete: "+eventId)
            toast.success("Successfully deleted");
            navigate('/dash')
            setLoad(false);
        }catch(err){
            toast.error("Deletion falied")
            console.log("Unable to delete" + err);
            setLoad(false);
        }
    }

    const handleBack = ()=>{
        navigate('/dash');
    }

    if (load) {
        return <Loader />;
    }

    return (
        <div className="details-body">
            <div className='details-container'>
            <button className='button-back' onClick={handleBack}>Back</button>
                <div className='details-content'>
                    <div className='event-details'>
                        {!isEditing ? (
                            <>
                                <h1>{event.title}</h1>
                                <div className="event-details-row">
                                    <p className="label">Description:</p>
                                    <p className="value">{event.description}</p>
                                </div>
                                <div className="event-details-row">
                                    <p className="label">Event Date:</p>
                                    <p className="value">{new Date(event.eventDate).toLocaleDateString()} {new Date(event.eventDate).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}</p>
                                </div>
                                <div className="event-details-row">
                                    <p className="label">Reminder Date:</p>
                                    <p className="value">{new Date(event.reminderDate).toLocaleDateString()} {new Date(event.reminderDate).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}</p>
                                </div>
                                <div className="buttons-conitions">
                                    <button className="edit-button" onClick={handleEdit}>Edit</button>
                                    <button className="delete-button" onClick={handleDelete}>Delete</button>
                                </div>
                            </>
                        ) : (
                            <div className="edit-form">
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                                <input
                                    type="date"
                                    value={eventDate}
                                    onChange={(e) => setEventDate(e.target.value)}
                                />
                                <input
                                    type="time"
                                    value={eventTime}
                                    onChange={(e) => setEventTime(e.target.value)}
                                />
                                <input
                                    type="date"
                                    value={reminderDate}
                                    onChange={(e) => setReminderDate(e.target.value)}
                                />
                                <input
                                    type="time"
                                    value={reminderTime}
                                    onChange={(e) => setReminderTime(e.target.value)}
                                />
                                <button className="edit-button" onClick={handleSave}>Save</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <ToastContainer/>
        </div>
    );
};

export default EventDetails;
