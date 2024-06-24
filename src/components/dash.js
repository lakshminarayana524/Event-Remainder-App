import React from 'react';
import EventsSchedule from './eventsSchedule';
import './styles/dash.css';
import { useNavigate } from 'react-router-dom';

const Dash = () => {
    const navigate = useNavigate();
    const handleAdd = () =>{
        navigate('/create')
    }

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
