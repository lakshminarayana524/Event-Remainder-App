import React from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/home.css'; // Import styles

const Home = () => {
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate('/login');
    };

    return (
        <div className="home-container">
            <div className="content">
                <h1>Welcome to Event Reminder</h1>
                <p className="subtitle">Your go-to app for managing all your events and reminders!</p>
                <div className="description">
                    <p>Never miss an important event again with our easy-to-use event management tool.</p>
                    <p>Organize your schedule, set reminders, and stay on top of your plans effortlessly.</p>
                    <p>Get started today by logging in and taking control of your events.</p>
                </div>
                <button onClick={handleLogin}>Login</button>
            </div>
        </div>
    );
};

export default Home;
