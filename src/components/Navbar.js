import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles.css'; // Citing shared styles

export default function Navbar() {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem('token'));

  // This effect listens for login/logout events to update the buttons
  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem('token'));
    };
    window.addEventListener('storageChange', handleStorageChange);
    return () => window.removeEventListener('storageChange', handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role'); // Also remove role on logout
    window.dispatchEvent(new Event('storageChange')); // Notify that storage has changed
    navigate('/login');
  };

  return (
    <nav className="navbar">
      {/* The brand link now correctly uses <Link> for navigation */}
      <Link to="/" className="navbar-brand">🍔 Food App</Link>
      <div className="navbar-buttons">
        {token ? (
          // Buttons to show when a user is logged in
          <>
            <Link to="/cart" className="navbar-button">Cart</Link>
            <button onClick={handleLogout} className="navbar-button">Logout</button>
          </>
        ) : (
          // Buttons to show when no one is logged in
          <>
            <Link to="/login" className="navbar-button">Login</Link>
            <Link to="/register" className="navbar-button">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}