import React, { useState, useEffect } from 'react';
import axios from '../api';
import '../styles.css';

export default function ProfilePage() {
  const [user, setUser] = useState({ username: '', email: '', phone: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('/user/profile');
        setUser(res.data);
      } catch (err) {
        setMessage('Failed to load profile.');
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put('/user/profile', { email: user.email, phone: user.phone });
      setMessage('Profile updated successfully!');
    } catch (err) {
      setMessage('Failed to update profile.');
    }
  };

  return (
    <div className="container">
      <h2>Your Profile</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username</label>
          <input type="text" value={user.username} readOnly disabled />
        </div>
        <div>
          <label>Email</label>
          <input type="email" name="email" value={user.email} onChange={handleChange} required />
        </div>
        <div>
          <label>Phone</label>
          <input type="tel" name="phone" value={user.phone} onChange={handleChange} required />
        </div>
        <button type="submit" className="button">Update Profile</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}