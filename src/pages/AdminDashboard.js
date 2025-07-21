import React, { useState, useEffect, useMemo, useCallback } from 'react'; // 1. Import useCallback
import axios from 'axios';
import '../styles.css';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  // State variables
  const [restaurants, setRestaurants] = useState([]);
  const [error, setError] = useState(null);
  const [restaurantName, setRestaurantName] = useState('');
  const [restaurantAddress, setRestaurantAddress] = useState('');
  const [menuName, setMenuName] = useState('');
  const [menuPrice, setMenuPrice] = useState('');
  const [menuDescription, setMenuDescription] = useState('');
  const [menuRestaurantId, setMenuRestaurantId] = useState('');

  const token = localStorage.getItem('token');

  const apiClient = useMemo(() => {
    return axios.create({
      baseURL: 'http://localhost:5000/api',
      headers: { 'Authorization': `Bearer ${token}` }
    });
  }, [token]);

  // 2. Wrap the function in useCallback
  const fetchRestaurants = useCallback(async () => {
    try {
      const res = await apiClient.get('/restaurants');
      setRestaurants(res.data);
    } catch (err) {
      console.error("Failed to load restaurants:", err.response || err);
      setError('Failed to load restaurants.');
    }
  }, [apiClient]); // The function depends on apiClient

  // 3. Add fetchRestaurants to the dependency array
  useEffect(() => {
    if (token) {
      fetchRestaurants();
    }
  }, [token, fetchRestaurants]); // Now the dependency array is complete


  const handleAddRestaurant = async (e) => {
    e.preventDefault();
    await apiClient.post('/restaurants', { name: restaurantName, address: restaurantAddress });
    setRestaurantName('');
    setRestaurantAddress('');
    fetchRestaurants(); // This will now call the memoized function
  };

  const handleDeleteRestaurant = async (id) => {
    if (window.confirm("Are you sure?")) {
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
    if (window.confirm("Are you sure?")) {
        await apiClient.delete(`/restaurants/${restaurantId}/menu/${menuItemId}`);
        fetchRestaurants();
    }
  };

  if (error) return <div className="container"><h2>Error: {error}</h2></div>;
  if (!token) return <div className="container"><h2>Access Denied</h2></div>;

  return (
    <div className="container">
      <h2>Admin Dashboard</h2>
      <Link to="/admin/orders" className="button" style={{marginBottom: '20px', display: 'inline-block'}}>
        Go to Order Management
      </Link>

      {/* Restaurant & Menu Forms */}
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

      {/* Restaurant and Menu Item List */}
      <h3>Restaurant List</h3>
      {restaurants.map(res => (
        <div key={res._id} className="card">
          <strong>{res.name}</strong> - {res.address}
          <button onClick={() => handleDeleteRestaurant(res._id)} style={{ float: 'right', backgroundColor: 'red', color: 'white' }}>Delete</button>
          <h4 style={{ marginTop: '15px' }}>Menu:</h4>
          {res.menu.length > 0 ? (
            <ul style={{ listStyle: 'circle', paddingLeft: '20px' }}>
              {res.menu.map(item => (
                <li key={item._id}>
                  {item.name} - ₹{item.price}
                  <button onClick={() => handleDeleteMenuItem(res._id, item._id)} style={{ marginLeft: '10px', backgroundColor: 'darkorange' }}>Delete</button>
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