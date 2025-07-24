import React, { useEffect, useState, useCallback } from 'react';
import axios from '../api';
import { useNavigate } from 'react-router-dom';
import '../styles.css';

export default function HomePage() {
  // State for restaurant data, search, and sorting
  const [restaurants, setRestaurants] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('');
  
  // State for managing user's favorites
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const fetchData = useCallback(async () => {
    try {
      // Fetch restaurants with the current search and sort parameters
      const resRestaurants = await axios.get('/restaurants', {
        params: {
          search: searchQuery,
          sort: sortBy
        }
      });
      setRestaurants(resRestaurants.data);

      // If the user is logged in, fetch their favorite restaurant IDs
      if (token) {
        const resFavorites = await axios.get('/favorites');
        // Create a Set of favorite IDs for quick lookups
        setFavoriteIds(new Set(resFavorites.data.map(f => f._id)));
      }
    } catch (err) {
      console.error("Failed to fetch page data:", err);
    }
  }, [searchQuery, sortBy, token]); // Dependencies: The function will update if these values change.

  // This useEffect hook calls fetchData whenever the fetchData function itself changes.
  // This happens when searchQuery, sortBy, or the user's login status (token) changes.
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Function to add or remove a restaurant from favorites
  const handleFavoriteToggle = async (e, restaurantId) => {
    e.stopPropagation(); // Prevents the card's main click event from firing
    const isFavorite = favoriteIds.has(restaurantId);
    const endpoint = isFavorite ? '/favorites/remove' : '/favorites/add';
    
    try {
      await axios.post(endpoint, { restaurantId });
      // Update the state locally for an instant UI response without a full re-fetch
      const newFavoriteIds = new Set(favoriteIds);
      if (isFavorite) {
        newFavoriteIds.delete(restaurantId);
      } else {
        newFavoriteIds.add(restaurantId);
      }
      setFavoriteIds(newFavoriteIds);
    } catch (err) {
      alert("Could not update favorites. Please try again.");
    }
  };

  return (
    <div className="container">
      <h2>Discover Restaurants</h2>
      
      {/* --- Search and Sort UI --- */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Search restaurants or food..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ flex: 1, minWidth: '250px', padding: '12px', fontSize: '16px', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius)' }}
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{ padding: '12px', fontSize: '16px', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius)' }}
        >
          <option value="">Sort By</option>
          <option value="name_asc">Name (A-Z)</option>
          <option value="name_desc">Name (Z-A)</option>
          <option value="rating_desc">Rating (High to Low)</option>
        </select>
      </div>

      {/* --- Restaurant List --- */}
      <div className="restaurant-grid">
        {restaurants.length > 0 ? (
          restaurants.map((r) => (
            <div
              key={r._id}
              className="card"
              onClick={() => navigate(`/restaurant/${r._id}`)}
              style={{ cursor: 'pointer', position: 'relative' }}
            >
              {/* --- Favorite Button --- */}
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
                    zIndex: 2 
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
