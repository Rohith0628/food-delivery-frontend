import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles.css';

export default function Navbar() {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem('token'));

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
      <Link to="/" className="navbar-brand">SwiftServe</Link>
      <div className="navbar-buttons">
        <Link to="/home" className="navbar-button">Home</Link> {/* ✅ Home Button */}

        {token ? (
          <>
            <Link to="/cart" className="navbar-button">Cart</Link>
            <Link to="/orders" className="navbar-button">Orders</Link>
            <Link to="/profile" className="navbar-button">Profile</Link>
            <Link to="/favorites" className="navbar-button">Favorites</Link>
            <Link to="/favorite-items" className="navbar-button">Favorite Items</Link>
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
