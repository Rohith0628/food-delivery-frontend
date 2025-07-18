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
      <h2>Restaurants</h2>
      {restaurants.map((r) => (
        <div
          key={r._id}
          className="card"
          onClick={() => navigate(`/restaurant/${r._id}`)}
        >
          <h3>{r.name}</h3>
          <p>{r.address}</p>
        </div>
      ))}
    </div>
  );
}
