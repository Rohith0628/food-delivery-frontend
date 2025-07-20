import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  // Form states
  const [restaurantName, setRestaurantName] = useState('');
  const [restaurantAddress, setRestaurantAddress] = useState('');
  const [menuName, setMenuName] = useState('');
  const [menuPrice, setMenuPrice] = useState('');
  const [menuRestaurantId, setMenuRestaurantId] = useState('');

  // Data states
  const [restaurants, setRestaurants] = useState([]);
  const [error, setError] = useState(null);

  // Get token from storage
  const token = localStorage.getItem('token');

  // Create an Axios instance with base URL and auth header. This is a best practice.
  const apiClient = useMemo(() => {
    return axios.create({
      baseURL: 'http://localhost:5000/api',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }, [token]);

  // Fetch all restaurants when the component loads
  const fetchRestaurants = async () => {
    try {
      const res = await apiClient.get('/restaurants');
      setRestaurants(res.data);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to load restaurants';
      setError(msg);
      console.error(msg);
    }
  };

  useEffect(() => {
    if (token) {
      fetchRestaurants();
    }
  }, [apiClient, token]);

  // Handler to add a new restaurant
  const handleAddRestaurant = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post('/restaurants', {
        name: restaurantName,
        address: restaurantAddress,
      });
      setRestaurantName('');
      setRestaurantAddress('');
      fetchRestaurants(); // Refresh the list
    } catch (err) {
      alert('Add restaurant failed: ' + (err.response?.data?.message || err.message));
    }
  };

  // Handler to delete a restaurant
  const handleDeleteRestaurant = async (id) => {
    if (window.confirm('Are you sure you want to delete this restaurant?')) {
      try {
        await apiClient.delete(`/restaurants/${id}`);
        fetchRestaurants(); // Refresh the list
      } catch (err) {
        alert('Delete restaurant failed: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  // Handler to add a menu item
  const handleAddMenuItem = async (e) => {
    e.preventDefault();
    if (!menuRestaurantId) {
      return alert('Please select a restaurant.');
    }
    try {
      // Corrected endpoint for adding a menu item
      await apiClient.post(`/restaurants/${menuRestaurantId}/menu`, {
        name: menuName,
        price: menuPrice,
      });
      setMenuName('');
      setMenuPrice('');
      fetchRestaurants(); // Refresh restaurant data to show new menu item
    } catch (err) {
      alert('Add menu item failed: ' + (err.response?.data?.message || err.message));
    }
  };

  // Handler to delete a menu item
  const handleDeleteMenuItem = async (restaurantId, menuItemId) => {
     if (window.confirm('Are you sure you want to delete this menu item?')) {
        try {
            // Corrected endpoint for deleting a menu item
            await apiClient.delete(`/restaurants/${restaurantId}/menu/${menuItemId}`);
            fetchRestaurants(); // Refresh data
        } catch (err) {
            alert('Delete menu item failed: ' + (err.response?.data?.message || err.message));
        }
    }
  };

  if (!token) {
    return <div style={{ padding: '20px' }}><h2>Access Denied. Please log in as an admin.</h2></div>;
  }
  
  if (error) {
     return <div style={{ padding: '20px' }}><h2>Error: {error}</h2></div>;
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>Admin Dashboard</h2>

      {/* Add Restaurant Form */}
      <form onSubmit={handleAddRestaurant} style={{ marginBottom: '30px' }}>
        <h3>Add Restaurant</h3>
        <input placeholder="Name" value={restaurantName} onChange={(e) => setRestaurantName(e.target.value)} required />
        <input placeholder="Address" value={restaurantAddress} onChange={(e) => setRestaurantAddress(e.target.value)} required />
        <button type="submit">Add Restaurant</button>
      </form>

      {/* Add Menu Item Form */}
      <form onSubmit={handleAddMenuItem} style={{ marginBottom: '30px' }}>
        <h3>Add Menu Item</h3>
        <select value={menuRestaurantId} onChange={(e) => setMenuRestaurantId(e.target.value)} required>
          <option value="">Select Restaurant</option>
          {restaurants.map((r) => (
            <option key={r._id} value={r._id}>{r.name}</option>
          ))}
        </select>
        <input placeholder="Item Name" value={menuName} onChange={(e) => setMenuName(e.target.value)} required />
        <input placeholder="Price" type="number" value={menuPrice} onChange={(e) => setMenuPrice(e.target.value)} required />
        <button type="submit">Add Item</button>
      </form>

      {/* Restaurant & Menu List */}
      <h3>Restaurant List</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {restaurants.map((res) => (
          <li key={res._id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
            <strong>{res.name}</strong> - {res.address}
            <button onClick={() => handleDeleteRestaurant(res._id)} style={{ float: 'right', backgroundColor: 'red', color: 'white' }}>Delete Restaurant</button>
            
            <h4 style={{marginTop: '15px'}}>Menu:</h4>
            {res.menu && res.menu.length > 0 ? (
                <ul style={{ listStyle: 'circle', paddingLeft: '20px' }}>
                    {res.menu.map((item) => (
                        <li key={item._id}>
                            {item.name} - ₹{item.price}
                            <button onClick={() => handleDeleteMenuItem(res._id, item._id)} style={{ marginLeft: '10px', backgroundColor: 'darkorange', color: 'white' }}>Delete Item</button>
                        </li>
                    ))}
                </ul>
            ) : ( <p>No menu items yet.</p> )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;