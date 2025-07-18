import React, { useState } from 'react';
import axios from '../api';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

export default function RegisterPage() {
  const [form, setForm] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await axios.post('/auth/register', form);
      alert('Registered successfully! Please log in.');
      navigate('/login');
    } catch (err) {
      alert(err.response?.data || 'Registration failed');
    }
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>
      <input
        type="text"
        placeholder="Username"
        value={form.username}
        onChange={(e) => setForm({ ...form, username: e.target.value })}
      />
      <input
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      <button onClick={handleRegister}>Register</button>
      <p>
        Already have an account? <a href="/login">Login</a>
      </p>
    </div>
  );
}
