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

  const handleRemoveItem = async (itemId) => {
    try {
      await axios.delete(`/favorite-items/${itemId}`);
      setFavoriteItems(prev => prev.filter(item => item._id !== itemId));
    } catch (err) {
      console.error("Error removing item:", err);
      alert("Failed to remove favorite item.");
    }
  };

  if (loading) {
    return <div className="container"><p>Loading your favorite dishes...</p></div>;
  }

  return (
    <div className="container">
      <h2 className="favorite-title">Your Favorite Food Items</h2>
      {favoriteItems.length > 0 ? (
        <div className="restaurant-grid">
          {favoriteItems.map((item) => (
            <div key={item._id} className="card">
              <div
                className="card-header"
                onClick={() => navigate(`/restaurant/${item.restaurantId}`)}
                style={{ cursor: 'pointer' }}
              >
                <h3>{item.name}</h3>
                <p><strong>{item.restaurantName}</strong></p>
                <p className="description">{item.description}</p>
                <p>₹{item.price}</p>
              </div>
              <button className="remove-btn" onClick={() => handleRemoveItem(item._id)}>💔 Remove</button>
            </div>
          ))}
        </div>
      ) : (
        <p className="favorite-empty-message">
          You haven't added any food items to your favorites yet. <br />
          Click the ❤️ icon on a menu item to save it here!
        </p>
      )}
    </div>
  );
}
