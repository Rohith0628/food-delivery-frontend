import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import '../styles.css';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  // --- States for Creating Items ---
  const [restaurants, setRestaurants] = useState([]);
  const [error, setError] = useState(null);
  const [restaurantName, setRestaurantName] = useState('');
  const [restaurantAddress, setRestaurantAddress] = useState('');
  const [restaurantImage, setRestaurantImage] = useState(null); // For file object
  const [menuName, setMenuName] = useState('');
  const [menuPrice, setMenuPrice] = useState('');
  const [menuDescription, setMenuDescription] = useState('');
  const [menuImage, setMenuImage] = useState(null); // For file object
  const [menuRestaurantId, setMenuRestaurantId] = useState('');

  // --- States for Editing Items ---
  const [editingRestaurant, setEditingRestaurant] = useState(null);
  const [editingMenuItem, setEditingMenuItem] = useState(null);

  const token = localStorage.getItem('token');

  const apiClient = useMemo(() => {
    return axios.create({
      baseURL: 'http://localhost:5000/api', // Make sure this matches your backend URL
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

  // --- Unified Image Upload Function ---
  const uploadImage = async (imageFile) => {
    if (!imageFile) return null;
    const formData = new FormData();
    formData.append('image', imageFile);
    try {
      const res = await apiClient.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      // The backend returns a path like /uploads/filename.jpeg
      // We prepend the server's base URL to make it a full URL
      return `http://localhost:5000${res.data.filePath}`;
    } catch (err) {
      alert('Image upload failed. Please ensure the file is a valid image and under 1MB.');
      return null;
    }
  };

  // --- Updated CRUD Handlers ---

  const handleAddRestaurant = async (e) => {
    e.preventDefault();
    const imageUrl = await uploadImage(restaurantImage);
    await apiClient.post('/restaurants', {
      name: restaurantName,
      address: restaurantAddress,
      image: imageUrl
    });
    setRestaurantName('');
    setRestaurantAddress('');
    setRestaurantImage(null);
    document.getElementById('restaurant-image-input').value = null; // Clear file input
    fetchRestaurants();
  };

  const handleAddMenuItem = async (e) => {
    e.preventDefault();
    if (!menuRestaurantId) return alert('Please select a restaurant.');
    const imageUrl = await uploadImage(menuImage);
    await apiClient.post(`/restaurants/${menuRestaurantId}/menu`, {
      name: menuName,
      price: menuPrice,
      description: menuDescription,
      image: imageUrl
    });
    setMenuName('');
    setMenuPrice('');
    setMenuDescription('');
    setMenuImage(null);
    document.getElementById('menu-image-input').value = null; // Clear file input
    fetchRestaurants();
  };
  
  const handleUpdateRestaurant = async (e, imageFile) => {
    e.preventDefault();
    let imageUrl = editingRestaurant.image; // Keep old image by default
    if (imageFile) {
      imageUrl = await uploadImage(imageFile);
      if (!imageUrl) return; // Stop if upload fails
    }
    await apiClient.put(`/restaurants/${editingRestaurant._id}`, {
      ...editingRestaurant,
      image: imageUrl
    });
    setEditingRestaurant(null);
    fetchRestaurants();
  };
  
  const handleUpdateMenuItem = async (e, restaurantId, imageFile) => {
    e.preventDefault();
    let imageUrl = editingMenuItem.image;
    if (imageFile) {
        imageUrl = await uploadImage(imageFile);
        if (!imageUrl) return;
    }
    await apiClient.put(`/restaurants/${restaurantId}/menu/${editingMenuItem._id}`, {
        ...editingMenuItem,
        image: imageUrl
    });
    setEditingMenuItem(null);
    fetchRestaurants();
  };

 const handleDeleteRestaurant = async (id) => {
        if (window.confirm("Are you sure you want to delete this restaurant and all its menu items?")) {
            try {
                await apiClient.delete(`/restaurants/${id}`);
                fetchRestaurants(); // Refresh the list
            } catch (err) {
                alert('Failed to delete restaurant.');
            }
        }
    };
    
  const handleDeleteMenuItem = async (restaurantId, menuItemId) => {
    if (window.confirm("Are you sure you want to delete this menu item?")) {
        try {
            await apiClient.delete(`/restaurants/${restaurantId}/menu/${menuItemId}`);
            fetchRestaurants(); // Refresh the list
        } catch (err) { 
            alert('Failed to delete menu item.');
        }
    }
  };


  // --- Render Logic ---
  if (error) return <div className="container"><h2>Error: {error}</h2></div>;
  if (!token) return <div className="container"><h2>Access Denied</h2></div>;

  return (
    <div className="container">
      <h2>Admin Dashboard</h2>
      <Link to="/admin/orders" className="button" style={{marginBottom: '20px', display: 'inline-block'}}>
        Go to Order Management
      </Link>

      {/* --- ADD FORMS --- */}
      <form onSubmit={handleAddRestaurant}>
        <h3>Add Restaurant</h3>
        <input placeholder="Name" value={restaurantName} onChange={e => setRestaurantName(e.target.value)} required />
        <input placeholder="Address" value={restaurantAddress} onChange={e => setRestaurantAddress(e.target.value)} required />
        <input type="file" id="restaurant-image-input" onChange={e => setRestaurantImage(e.target.files[0])} />
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
        <input type="file" id="menu-image-input" onChange={e => setMenuImage(e.target.files[0])} />
        <button type="submit">Add Item</button>
      </form>

      {/* --- Restaurant & Menu List with Edit Forms --- */}
      <h3>Restaurant List</h3>
      {restaurants.map(res => (
        <div key={res._id} className="card">
          {editingRestaurant?._id === res._id ? (
            <form onSubmit={(e) => {
                const imageFile = e.target.image?.files[0];
                handleUpdateRestaurant(e, imageFile);
            }}>
              <input type="text" value={editingRestaurant.name} onChange={e => setEditingRestaurant({...editingRestaurant, name: e.target.value})} />
              <input type="text" value={editingRestaurant.address} onChange={e => setEditingRestaurant({...editingRestaurant, address: e.target.value})} />
              <input type="file" name="image" />
              <button type="submit">Save</button>
              <button type="button" onClick={() => setEditingRestaurant(null)}>Cancel</button>
            </form>
          ) : (
            <div>
              <strong>{res.name}</strong> - {res.address}
              <button onClick={() => setEditingRestaurant(res)} style={{ marginLeft: '10px' }}>Edit</button>
              <button onClick={() => handleDeleteRestaurant(res._id)} style={{ float: 'right', backgroundColor: 'red', color: 'white' }}>Delete</button>
            </div>
          )}

          <h4 style={{ marginTop: '15px' }}>Menu:</h4>
          {res.menu.map(item => (
            <li key={item._id}>
              {editingMenuItem?._id === item._id ? (
                <form onSubmit={(e) => {
                    const imageFile = e.target.image?.files[0];
                    handleUpdateMenuItem(e, res._id, imageFile);
                }}>
                  <input type="text" value={editingMenuItem.name} onChange={e => setEditingMenuItem({...editingMenuItem, name: e.target.value})} />
                  <input type="number" value={editingMenuItem.price} onChange={e => setEditingMenuItem({...editingMenuItem, price: e.target.value})} />
                  <input type="text" value={editingMenuItem.description} onChange={e => setEditingMenuItem({...editingMenuItem, description: e.target.value})} />
                  <input type="file" name="image" />
                  <button type="submit">Save</button>
                  <button type="button" onClick={() => setEditingMenuItem(null)}>Cancel</button>
                </form>
              ) : (
                <div>
                  {item.name} - ₹{item.price}
                  <button onClick={() => setEditingMenuItem(item)} style={{ marginLeft: '10px' }}>Edit</button>
                  <button onClick={() => handleDeleteMenuItem(res._id, item._id)} style={{ marginLeft: '10px' }}>Delete</button>
                </div>
              )}
            </li>
          ))}
        </div>
      ))}
    </div>
  );
};

export default AdminDashboard;