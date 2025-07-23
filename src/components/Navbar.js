import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../ThemeContext'; // <-- Import the useTheme hook
import '../styles.css';

export default function Navbar() {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem('token'));
  const { theme, toggleTheme } = useTheme(); // <-- Get theme and toggle function

  
  useEffect(() => {
    const handleStorageChange = () => setToken(localStorage.getItem('token'));
    window.addEventListener('storageChange', handleStorageChange);
    return () => window.removeEventListener('storageChange', handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.dispatchEvent(new Event('storageChange'));
    navigate('/login');
  };

   return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">Food App</Link>
      <div className="navbar-buttons">
        
        {/* --- THEME TOGGLE BUTTON --- */}
        <button onClick={toggleTheme} className="navbar-button">
          {theme === 'light' ? 'Dark' : 'Light'} Mode
        </button>

        {token ? (
          <>
            <Link to="/cart" className="navbar-button">Cart</Link>
             <Link to="/profile" className="navbar-button">Profile</Link>
            <Link to="/orders" className="navbar-button">My Orders</Link>
            <button onClick={handleLogout} className="navbar-button">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="navbar-button">Login</Link>
            <Link to="/register" className="navbar-button">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}