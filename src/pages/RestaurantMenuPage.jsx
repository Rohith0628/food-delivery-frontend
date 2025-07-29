import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../api';
import { toast } from 'react-toastify'; // ✅ import toast
import 'react-toastify/dist/ReactToastify.css';
import '../styles.css';

export default function RestaurantMenuPage() {
  const { id } = useParams();

  const [menu, setMenu] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [favoriteItemIds, setFavoriteItemIds] = useState(new Set());

  const token = localStorage.getItem('token');

  const fetchMenuData = useCallback(async () => {
    try {
      const resMenu = await axios.get(`/restaurants/${id}/menu`, {
        params: {
          search: searchQuery,
          sort: sortBy
        }
      });
      setMenu(resMenu.data);

      if (token) {
        const resFavorites = await axios.get('/favorite-items/ids');
        setFavoriteItemIds(new Set(resFavorites.data));
      }
    } catch (err) {
      console.error("Failed to load menu data:", err);
    }
  }, [id, searchQuery, sortBy, token]);

  useEffect(() => {
    fetchMenuData();
  }, [fetchMenuData]);

  const handleFavoriteToggle = async (e, menuItemId) => {
    e.stopPropagation();
    const isFavorite = favoriteItemIds.has(menuItemId);
    const endpoint = isFavorite ? '/favorite-items/remove' : '/favorite-items/add';

    try {
      await axios.post(endpoint, { menuItemId });
      const newFavoriteIds = new Set(favoriteItemIds);
      if (isFavorite) {
        newFavoriteIds.delete(menuItemId);
        toast.info("Removed from favorites");
      } else {
        newFavoriteIds.add(menuItemId);
        toast.success("Added to favorites");
      }
      setFavoriteItemIds(newFavoriteIds);
    } catch (err) {
      toast.error("Failed to update favorites. Please try again.");
    }
  };

  const addToCart = async (item) => {
    try {
      await axios.post('/cart/add', { ...item, quantity: 1 });
      toast.success('Added to cart!');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'An error occurred. Please log in and try again.';
      toast.error(errorMessage);
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
          style={{
            flex: 1,
            minWidth: '250px',
            padding: '12px',
            fontSize: '16px',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--border-radius)'
          }}
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{
            padding: '12px',
            fontSize: '16px',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--border-radius)'
          }}
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
          {/* Favorite Button */}
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
