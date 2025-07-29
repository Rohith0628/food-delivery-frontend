import React, { useState } from 'react';
import axios from '../api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';  // ✅ Import toast
import 'react-toastify/dist/ReactToastify.css';
import './Auth.css';

export default function LoginPage() {
  const [form, setForm] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post('/auth/login', form);
      
      // Store token and role
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role); // For Navbar update

      // Notify Navbar
      window.dispatchEvent(new Event('storageChange'));

      // ✅ Show toast instead of alert
      toast.success('Login successful!');

      // Navigate after slight delay for user to see the toast
      setTimeout(() => navigate('/'), 1000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
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
