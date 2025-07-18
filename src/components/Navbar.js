import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles.css';

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <span className="navbar-brand">🍔 Food App</span>
      <div className="navbar-buttons">
        {token ? (
          <button onClick={handleLogout} className="navbar-button">Logout</button>
        ) : (
          <>
            <button onClick={() => navigate('/login')} className="navbar-button">Login</button>
            <button onClick={() => navigate('/register')} className="navbar-button">Register</button>
          </>
        )}
      </div>
    </nav>
  );
}
