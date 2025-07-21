import React, { useState } from 'react';
import axios from '../api';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

export default function RegisterPage() {
  const [form, setForm] = useState({
    username: '',
    password: '',
    email: '',
    phone: ''
  });

  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!form.username || !form.password || !form.email || !form.phone) {
      alert("All fields are required");
      return;
    }

    try {
      await axios.post('/auth/register', form);
      alert('Registered successfully! Please log in.');
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>
      <input type="text" placeholder="Username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })}/>
      <input type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}/>
      <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}/>
      <input type="tel" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}/>
      <button onClick={handleRegister}>Register</button>
    </div>
  );
}