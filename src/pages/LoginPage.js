import React, { useState } from 'react';
import axios from '../api';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

export default function LoginPage() {
  const [form, setForm] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post('/auth/login', form); // sends { username, password } to backend
      localStorage.setItem('token', res.data.token); // stores JWT for auth
      alert('Login successful!');
      navigate('/'); // redirect to homepage
    } catch (err) {
      alert(err.response?.data || 'Login failed');
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
