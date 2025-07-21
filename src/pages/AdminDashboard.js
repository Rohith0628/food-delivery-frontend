import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import '../styles.css';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  // --- All State Declarations ---
  const [restaurants, setRestaurants] = useState([]);
  const [error, setError] = useState(null);
  const [restaurantName, setRestaurantName] = useState('');
  const [restaurantAddress, setRestaurantAddress] = useState('');
  const [menuName, setMenuName] = useState('');
  const [menuPrice, setMenuPrice] = useState('');
  const [menuDescription, setMenuDescription] = useState('');
  const [menuRestaurantId, setMenuRestaurantId] = useState('');
  const [editingRestaurant, setEditingRestaurant] = useState(null);
  const [editingMenuItem, setEditingMenuItem] = useState(null);

  const token = localStorage.getItem('token');

  const apiClient = useMemo(() => {
    return axios.create({
      baseURL: 'http://localhost:5000/api',
      headers: { 'Authorization': `Bearer ${token}` }
    });
  }, [token]);

  const fetchRestaurants = useCallback(async () => {
    try {
      const res = await apiClient.get('/restaurants');
      setRestaurants(res.data);
    } catch (err) {
      setError('Failed to load restaurants.');
    }
  }, [apiClient]);

  useEffect(() => {
    if (token) {
      fetchRestaurants();
    }
  }, [token, fetchRestaurants]);

  // --- CRUD Handlers ---

  const handleAddRestaurant = async (e) => {
    e.preventDefault();
    await apiClient.post('/restaurants', { name: restaurantName, address: restaurantAddress });
    setRestaurantName('');
    setRestaurantAddress('');
    fetchRestaurants();
  };
  
  const handleDeleteRestaurant = async (id) => {
    if (window.confirm("Are you sure you want to delete this restaurant?")) {
      await apiClient.delete(`/restaurants/${id}`);
      fetchRestaurants();
    }
  };

  const handleAddMenuItem = async (e) => {
    e.preventDefault();
    if (!menuRestaurantId) return alert('Please select a restaurant.');
    await apiClient.post(`/restaurants/${menuRestaurantId}/menu`, {
      name: menuName,
      price: menuPrice,
      description: menuDescription
    });
    setMenuName('');
    setMenuPrice('');
    setMenuDescription('');
    fetchRestaurants();
  };
  
  const handleDeleteMenuItem = async (restaurantId, menuItemId) => {
    if (window.confirm("Are you sure you want to delete this menu item?")) {
      await apiClient.delete(`/restaurants/${restaurantId}/menu/${menuItemId}`);
      fetchRestaurants();
    }
  };

  const handleUpdateRestaurant = async (e) => {
    e.preventDefault();
    await apiClient.put(`/restaurants/${editingRestaurant._id}`, {
      name: editingRestaurant.name,
      address: editingRestaurant.address
    });
    setEditingRestaurant(null);
    fetchRestaurants();
  };

  const handleUpdateMenuItem = async (e, restaurantId) => {
    e.preventDefault();
    await apiClient.put(`/restaurants/${restaurantId}/menu/${editingMenuItem._id}`, {
      name: editingMenuItem.name,
      price: editingMenuItem.price,
      description: editingMenuItem.description
    });
    setEditingMenuItem(null);
    fetchRestaurants();
  };

  // ✅ --- DIAGNOSTIC: New handler for clicking the edit button ---
  const handleEditClick = (item, type) => {
      console.log(`--- EDIT BUTTON CLICKED ---`);
      console.log(`Editing ${type} with ID:`, item._id);
      console.log('Item data:', item);
      if (type === 'restaurant') {
          setEditingRestaurant(item);
      } else {
          setEditingMenuItem(item);
      }
  };


  // --- Render Logic ---
  if (error) return <div className="container"><h2>Error: {error}</h2></div>;
  if (!token) return <div className="container"><h2>Access Denied</h2></div>;

  return (
    <div className="container">
      <h2>Admin Dashboard</h2>
      <Link to="/admin/orders" className="button" style={{ marginBottom: '20px', display: 'inline-block' }}>
        Go to Order Management
      </Link>

      {/* --- Add Forms --- */}
      <form onSubmit={handleAddRestaurant}>
        <h3>Add Restaurant</h3>
        <input placeholder="Name" value={restaurantName} onChange={e => setRestaurantName(e.target.value)} required />
        <input placeholder="Address" value={restaurantAddress} onChange={e => setRestaurantAddress(e.target.value)} required />
        <button type="submit">Add Restaurant</button>
      </form>

      <form onSubmit={handleAddMenuItem} style={{ margin: '30px 0' }}>
        <h3>Add Menu Item</h3>
        <select value={menuRestaurantId} onChange={e => setMenuRestaurantId(e.target.value)} required>
          <option value="">Select Restaurant</option>
          {restaurants.map(r => <option key={r._id} value={r._id}>{r.name}</option>)}
        </select>
        <input placeholder="Item Name" value={menuName} onChange={e => setMenuName(e.target.value)} required />
        <input placeholder="Price" type="number" value={menuPrice} onChange={e => setMenuPrice(e.target.value)} required />
        <input placeholder="Description" value={menuDescription} onChange={e => setMenuDescription(e.target.value)} required />
        <button type="submit">Add Item</button>
      </form>

      {/* --- Restaurant & Menu List --- */}
      <h3>Restaurant List</h3>
      {restaurants.map(res => (
        <div key={res._id} className="card">
          {editingRestaurant?._id === res._id ? (
            <form onSubmit={handleUpdateRestaurant}>
              <input type="text" value={editingRestaurant.name} onChange={e => setEditingRestaurant({ ...editingRestaurant, name: e.target.value })} />
              <input type="text" value={editingRestaurant.address} onChange={e => setEditingRestaurant({ ...editingRestaurant, address: e.target.value })} />
              <button type="submit">Save</button>
              <button type="button" onClick={() => setEditingRestaurant(null)}>Cancel</button>
            </form>
          ) : (
            <div>
              <strong>{res.name}</strong> - {res.address}
              <button onClick={() => handleEditClick(res, 'restaurant')} style={{ marginLeft: '10px' }}>Edit</button>
              <button onClick={() => handleDeleteRestaurant(res._id)} style={{ float: 'right', backgroundColor: 'red', color: 'white' }}>Delete</button>
            </div>
          )}

          <h4 style={{ marginTop: '15px' }}>Menu:</h4>
          {res.menu.length > 0 ? (
            <ul style={{ listStyle: 'circle', paddingLeft: '20px' }}>
              {res.menu.map(item => (
                <li key={item._id}>
                  {editingMenuItem?._id === item._id ? (
                    <form onSubmit={(e) => handleUpdateMenuItem(e, res._id)}>
                      <input type="text" value={editingMenuItem.name} onChange={e => setEditingMenuItem({ ...editingMenuItem, name: e.target.value })} />
                      <input type="number" value={editingMenuItem.price} onChange={e => setEditingMenuItem({ ...editingMenuItem, price: e.target.value })} />
                      <input type="text" value={editingMenuItem.description} onChange={e => setEditingMenuItem({ ...editingMenuItem, description: e.target.value })} />
                      <button type="submit">Save</button>
                      <button type="button" onClick={() => setEditingMenuItem(null)}>Cancel</button>
                    </form>
                  ) : (
                    <div>
                      {item.name} - ₹{item.price} - <em>{item.description}</em>
                      <button onClick={() => handleEditClick(item, 'menuItem')} style={{ marginLeft: '10px' }}>Edit</button>
                      <button onClick={() => handleDeleteMenuItem(res._id, item._id)} style={{ marginLeft: '10px', backgroundColor: 'darkorange' }}>Delete</button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : <p>No menu items yet.</p>}
        </div>
      ))}
    </div>
  );
};

export default AdminDashboard;