import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../api';
import '../styles.css';

export default function RestaurantMenuPage() {
  const { id } = useParams();
  
  // State for menu data, search, and sorting
  const [menu, setMenu] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('');
  
  // State for managing user's favorite items
  const [favoriteItemIds, setFavoriteItemIds] = useState(new Set());
  
  const token = localStorage.getItem('token');

  // This function fetches all necessary data from the backend
  const fetchMenuData = useCallback(async () => {
    try {
      // Fetch the menu with the current search and sort parameters
      const resMenu = await axios.get(`/restaurants/${id}/menu`, {
        params: {
          search: searchQuery,
          sort: sortBy
        }
      });
      setMenu(resMenu.data);

      // If the user is logged in, fetch their favorite item IDs
      if (token) {
        const resFavorites = await axios.get('/favorite-items/ids');
        setFavoriteItemIds(new Set(resFavorites.data));
      }
    } catch (err) {
      console.error("Failed to load menu data:", err);
    }
  }, [id, searchQuery, sortBy, token]); // The function depends on these values

  // useEffect hook to call fetchMenuData whenever its dependencies change
  useEffect(() => {
    fetchMenuData();
  }, [fetchMenuData]);

  // Function to add or remove an item from favorites
  const handleFavoriteToggle = async (e, menuItemId) => {
    e.stopPropagation(); // Prevent any parent click events
    const isFavorite = favoriteItemIds.has(menuItemId);
    const endpoint = isFavorite ? '/favorite-items/remove' : '/favorite-items/add';
    
    try {
      await axios.post(endpoint, { menuItemId });
      // Update the state locally for an instant UI response
      const newFavoriteIds = new Set(favoriteItemIds);
      if (isFavorite) {
        newFavoriteIds.delete(menuItemId);
      } else {
        newFavoriteIds.add(menuItemId);
      }
      setFavoriteItemIds(newFavoriteIds);
    } catch (err) {
      alert("Failed to update favorites. Please try again.");
    }
  };

  const addToCart = async (item) => {
    try {
      await axios.post('/cart/add', { ...item, quantity: 1 });
      alert('Added to cart!');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'An error occurred. Please log in and try again.';
      alert(errorMessage);
    }
  };

  return (
    <div className="container">
      <h2>Menu</h2>

      {/* --- Search and Sort UI --- */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Search menu items..."
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
          <option value="price_asc">Price (Low to High)</option>
          <option value="price_desc">Price (High to Low)</option>
          <option value="rating_desc">Rating (High to Low)</option>
        </select>
      </div>

      {/* --- Menu Item List --- */}
      {menu.map((item) => (
        <div key={item._id} className="card" style={{ position: 'relative' }}>
          {/* --- Favorite Button --- */}
          {token && (
            <button
              onClick={(e) => handleFavoriteToggle(e, item._id)}
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
              {favoriteItemIds.has(item._id) ? '❤️' : '🤍'}
            </button>
          )}
          <h3>{item.name} - ₹{item.price}</h3>
          <p style={{ color: 'var(--text-color-muted)' }}>{item.description}</p>
          <button onClick={() => addToCart(item)} className="button">Add to Cart</button>
        </div>
      ))}
    </div>
  );
}