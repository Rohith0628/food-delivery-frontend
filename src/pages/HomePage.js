import React, { useEffect, useState } from 'react';
import axios from '../api';
import { useNavigate } from 'react-router-dom';
import '../styles.css';

export default function HomePage() {
  const [restaurants, setRestaurants] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/restaurants').then((res) => setRestaurants(res.data));
  }, []);

  return (
    <div className="container">
      <h2>Our Restaurants</h2>
      <div className="restaurant-grid">
        {restaurants.map((r) => (
          <div
            key={r._id}
            className="card"
            onClick={() => navigate(`/restaurant/${r._id}`)}
            style={{ cursor: 'pointer' }}
          >
            <h3>{r.name}</h3>
            <p style={{ color: 'var(--text-color-muted)' }}>{r.address}</p>
          </div>
        ))}
      </div>
    </div>
  );
}