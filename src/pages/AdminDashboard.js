import React, { useState, useEffect } from 'react';
import axios from '../api';

export default function AdminDashboard() {
  const [restaurant, setRestaurant] = useState({ name: '', address: '' });
  const [menuItem, setMenuItem] = useState({ name: '', price: '', restaurantId: '' });
  const [restaurants, setRestaurants] = useState([]);

  // Fetch existing restaurants
  useEffect(() => {
    axios.get('/restaurants')
      .then(res => setRestaurants(res.data))
      .catch(err => alert('Failed to load restaurants'));
  }, []);

  // Add new restaurant
  const handleAddRestaurant = async () => {
    try {
      await axios.post('/restaurants', restaurant);
      alert('Restaurant added');
      setRestaurant({ name: '', address: '' });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add restaurant');
    }
  };

  // Add menu item to a restaurant
  const handleAddMenuItem = async () => {
    try {
      await axios.post(`/restaurants/${menuItem.restaurantId}/menu`, {
        name: menuItem.name,
        price: menuItem.price
      });
      alert('Menu item added');
      setMenuItem({ name: '', price: '', restaurantId: '' });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add menu item');
    }
  };

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>

      <div className="section">
        <h3>Add Restaurant</h3>
        <input
          placeholder="Restaurant Name"
          value={restaurant.name}
          onChange={(e) => setRestaurant({ ...restaurant, name: e.target.value })}
        />
        <input
          placeholder="Address"
          value={restaurant.address}
          onChange={(e) => setRestaurant({ ...restaurant, address: e.target.value })}
        />
        <button onClick={handleAddRestaurant}>Add Restaurant</button>
      </div>

      <div className="section">
        <h3>Add Menu Item</h3>
        <input
          placeholder="Menu Item Name"
          value={menuItem.name}
          onChange={(e) => setMenuItem({ ...menuItem, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Price"
          value={menuItem.price}
          onChange={(e) => setMenuItem({ ...menuItem, price: e.target.value })}
        />
        <select
          value={menuItem.restaurantId}
          onChange={(e) => setMenuItem({ ...menuItem, restaurantId: e.target.value })}
        >
          <option value="">Select Restaurant</option>
          {restaurants.map(r => (
            <option key={r._id} value={r._id}>{r.name}</option>
          ))}
        </select>
        <button onClick={handleAddMenuItem}>Add Menu Item</button>
      </div>
    </div>
  );
}
