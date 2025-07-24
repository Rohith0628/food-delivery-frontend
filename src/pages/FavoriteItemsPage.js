import React, { useState, useEffect } from 'react';
import axios from '../api';
import { useNavigate } from 'react-router-dom';
import '../styles.css';

export default function FavoriteItemsPage() {
  const [favoriteItems, setFavoriteItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFavoriteItems = async () => {
      try {
        const res = await axios.get('/favorite-items');
        setFavoriteItems(res.data);
      } catch (err) {
        console.error("Failed to fetch favorite items:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFavoriteItems();
  }, []);

  if (loading) {
    return <div className="container"><p>Loading your favorite dishes...</p></div>;
  }

  return (
    <div className="container">
      <h2>Your Favorite Food Items</h2>
      {favoriteItems.length > 0 ? (
        <div className="restaurant-grid">
          {favoriteItems.map((item) => (
            <div
              key={item._id}
              className="card"
              onClick={() => navigate(`/restaurant/${item.restaurantId}`)}
              style={{ cursor: 'pointer' }}
            >
              <h3>{item.name}</h3>
              <p><strong>{item.restaurantName}</strong></p>
              <p style={{ color: 'var(--text-color-muted)' }}>{item.description}</p>
              <p>₹{item.price}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>You haven't added any food items to your favorites yet. Click the heart icon on a menu item to save it here!</p>
      )}
    </div>
  );
}