import React, { useEffect, useState, useCallback } from 'react';
import axios from '../api';
import { useNavigate } from 'react-router-dom';
import '../styles.css';

import { toast, ToastContainer } from 'react-toastify'; // ✅ Toast imports
import 'react-toastify/dist/ReactToastify.css';         // ✅ Toast CSS

export default function HomePage() {
  const [restaurants, setRestaurants] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [favoriteIds, setFavoriteIds] = useState(new Set());

  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const fetchData = useCallback(async () => {
    try {
      const resRestaurants = await axios.get('/restaurants', {
        params: { search: searchQuery, sort: sortBy }
      });
      setRestaurants(resRestaurants.data);

      if (token) {
        const resFavorites = await axios.get('/favorites');
        setFavoriteIds(new Set(resFavorites.data.map(f => f._id)));
      }
    } catch (err) {
      toast.error("Failed to load data.");
    }
  }, [searchQuery, sortBy, token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFavoriteToggle = async (e, restaurantId) => {
    e.stopPropagation();
    const isFavorite = favoriteIds.has(restaurantId);
    const endpoint = isFavorite ? '/favorites/remove' : '/favorites/add';

    try {
      await axios.post(endpoint, { restaurantId });

      const newFavoriteIds = new Set(favoriteIds);
      if (isFavorite) {
        newFavoriteIds.delete(restaurantId);
        toast.info("Removed from favorites");
      } else {
        newFavoriteIds.add(restaurantId);
        toast.success("Added to favorites");
      }
      setFavoriteIds(newFavoriteIds);
    } catch (err) {
      toast.error("Could not update favorites");
    }
  };

  return (
    <div className="container">
      <ToastContainer position="top-right" autoClose={1500} hideProgressBar={false} />

      <h2>Discover Restaurants</h2>

      {/* Search and Sort Inputs */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Search restaurants or food..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            flex: 1,
            minWidth: '250px',
            padding: '12px',
            fontSize: '16px',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--border-radius)',
          }}
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{
            padding: '12px',
            fontSize: '16px',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--border-radius)',
          }}
        >
          <option value="">Sort By</option>
          <option value="name_asc">Name (A-Z)</option>
          <option value="name_desc">Name (Z-A)</option>
          <option value="rating_desc">Rating (High to Low)</option>
        </select>
      </div>

      {/* Restaurant List */}
      <div className="restaurant-grid">
        {restaurants.length > 0 ? (
          restaurants.map((r) => (
            <div
              key={r._id}
              className="card"
              onClick={() => navigate(`/restaurant/${r._id}`)}
              style={{ cursor: 'pointer', position: 'relative' }}
            >
              {/* Favorite Button */}
              {token && (
                <button
                  onClick={(e) => handleFavoriteToggle(e, r._id)}
                  style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    fontSize: '24px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    zIndex: 2,
                  }}
                >
                  {favoriteIds.has(r._id) ? '❤️' : '🤍'}
                </button>
              )}
              <h3>{r.name}</h3>
              <p style={{ color: 'var(--text-color-muted)' }}>{r.address}</p>
            </div>
          ))
        ) : (
          <p>No restaurants found matching your search.</p>
        )}
      </div>
    </div>
  );
}
