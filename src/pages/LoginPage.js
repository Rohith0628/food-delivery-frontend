import React, { useState } from 'react';
import axios from '../api';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

export default function LoginPage() {
  const [form, setForm] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post('/auth/login', form);
      // Store token and role
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role); // Important for Navbar
      
      // Dispatch a custom event to notify the Navbar of the change
      window.dispatchEvent(new Event('storageChange'));
      
      alert('Login successful!');
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
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
      <button onClick={handleLogin}>Login</button>
      <p>
        Don't have an account? <a href="/register">Register</a>
      </p>
    </div>
  );
}