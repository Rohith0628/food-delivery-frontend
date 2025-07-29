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

  const handleRemove = async (restaurantId) => {
    try {
      await axios.delete(`/favorites/${restaurantId}`);
      setFavorites(prev => prev.filter(r => r._id !== restaurantId));
    } catch (err) {
      console.error("Error removing favorite:", err);
      alert("Failed to remove favorite.");
    }
  };

  if (loading) {
    return <div className="container"><p>Loading your favorites...</p></div>;
  }

  return (
    <div className="container">
      <h2 className="favorite-title">Your Favorite Restaurants</h2>
      {favorites.length > 0 ? (
        <div className="restaurant-grid">
          {favorites.map((r) => (
            <div key={r._id} className="card">
              <div className="card-header" onClick={() => navigate(`/restaurant/${r._id}`)} style={{ cursor: 'pointer' }}>
                <h3>{r.name}</h3>
                <p className="address">{r.address}</p>
              </div>
              <button className="remove-btn" onClick={() => handleRemove(r._id)}>💔 Remove</button>
            </div>
          ))}
        </div>
      ) : (
        <p className="favorite-empty-message">
          You haven't added any restaurants to your favorites yet. <br />
          Click the ❤️ icon on a restaurant to save it here!
        </p>
      )}
    </div>
  );
}
