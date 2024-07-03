// src/components/NavBar.js
import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import './NavBar.css'; // Create this CSS file for styling the navbar

const NavBar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/dash">Dashboard</Link>
        <Link to="/create">Create Event</Link>
      </div>
      <div className="navbar-profile">
        <Link to="/profile">
          <FontAwesomeIcon icon={faUser} className="profile-icon" />
        </Link>
      </div>
    </nav>
  );
};

export default NavBar;
