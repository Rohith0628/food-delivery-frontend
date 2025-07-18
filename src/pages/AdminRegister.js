import React, { useState } from 'react';
import axios from 'axios';

const AdminRegister = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [adminKey, setAdminKey] = useState('');
  const [message, setMessage] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:5000/api/auth/register-admin', {
        username,
        password,
        adminKey
      });
      setMessage(res.data || 'Admin registered successfully');
    } catch (err) {
      const msg = err.response?.data || 'Registration failed';
      setMessage(msg);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Admin Registration</h2>
      <form onSubmit={handleRegister} style={styles.form}>
        <input
          type="text"
          placeholder="Admin Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Admin Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Secret Key"
          value={adminKey}
          onChange={(e) => setAdminKey(e.target.value)}
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Register Admin</button>
      </form>
      {message && <p style={styles.message}>{message}</p>}
    </div>
  );
};

const styles = {
  container: { maxWidth: 400, margin: '0 auto', padding: 20 },
  form: { display: 'flex', flexDirection: 'column', gap: 10 },
  input: { padding: 10, fontSize: 16 },
  button: { padding: 10, fontSize: 16, backgroundColor: '#333', color: '#fff', border: 'none' },
  message: { marginTop: 10, color: 'red' },
};

export default AdminRegister;
