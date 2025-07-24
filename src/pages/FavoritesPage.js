import React, { useState, useEffect } from 'react';
import axios from '../api';
import { useNavigate } from 'react-router-dom';
import '../styles.css';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await axios.get('/favorites');
        setFavorites(res.data);
      } catch (err) {
        console.error("Failed to fetch favorites:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, []);

  if (loading) {
    return <div className="container"><p>Loading your favorites...</p></div>;
  }

  return (
    <div className="container">
      <h2>Your Favorite Restaurants</h2>
      {favorites.length > 0 ? (
        <div className="restaurant-grid">
          {favorites.map((r) => (
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
      ) : (
        <p>You haven't added any restaurants to your favorites yet. Click the heart icon on a restaurant to save it here!</p>
      )}
    </div>
  );
}