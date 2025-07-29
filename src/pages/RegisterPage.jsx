import React, { useState } from 'react';
import axios from '../api';
import { useNavigate } from 'react-router-dom';
import './Auth.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
      toast.error("All fields are required");
      return;
    }

    try {
      await axios.post('/auth/register', form);
      toast.success('Registered successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000); // Delay for toast
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
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
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
}
