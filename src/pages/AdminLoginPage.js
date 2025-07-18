import React, { useState } from 'react';
import axios from '../api';
import { useNavigate } from 'react-router-dom';

export default function AdminLoginPage() {
  const [form, setForm] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!form.username || !form.password) {
      alert("All fields are required");
      return;
    }

    try {
      const res = await axios.post('/auth/login', form);
      if (res.data.role !== 'admin') {
        alert("Access denied. Admins only.");
        return;
      }
      localStorage.setItem('token', res.data.token);
      navigate('/admin/dashboard');
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="auth-container">
      <h2>Admin Login</h2>
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
    </div>
  );
}
