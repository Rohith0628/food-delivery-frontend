import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import 'react-toastify/dist/ReactToastify.css';
import '../styles.css';

const AdminDashboard = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [error, setError] = useState(null);
  const [restaurantName, setRestaurantName] = useState('');
  const [restaurantAddress, setRestaurantAddress] = useState('');
  const [restaurantImage, setRestaurantImage] = useState(null);
  const [menuName, setMenuName] = useState('');
  const [menuPrice, setMenuPrice] = useState('');
  const [menuDescription, setMenuDescription] = useState('');
  const [menuImage, setMenuImage] = useState(null);
  const [menuRestaurantId, setMenuRestaurantId] = useState('');
  const [editingRestaurant, setEditingRestaurant] = useState(null);
  const [editingMenuItem, setEditingMenuItem] = useState(null);

  const token = localStorage.getItem('token');
  const apiClient = useMemo(
    () =>
      axios.create({
        baseURL: 'http://localhost:5000/api',
        headers: { Authorization: `Bearer ${token}` },
      }),
    [token]
  );

  const fetchRestaurants = useCallback(async () => {
    try {
      const res = await apiClient.get('/restaurants');
      setRestaurants(res.data);
    } catch (err) {
      setError('Failed to load restaurants.');
      toast.error('Failed to load restaurants.');
    }
  }, [apiClient]);

  useEffect(() => {
    if (token) fetchRestaurants();
  }, [token, fetchRestaurants]);

  const uploadImage = async (imageFile) => {
    if (!imageFile) return null;
    const formData = new FormData();
    formData.append('image', imageFile);
    try {
      const res = await apiClient.post('/upload', formData);
      return `http://localhost:5000${res.data.filePath}`;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Image upload failed.');
      return null;
    }
  };

  const handleAddRestaurant = async (e) => {
    e.preventDefault();
    const imageUrl = await uploadImage(restaurantImage);
    try {
      await apiClient.post('/restaurants', {
        name: restaurantName,
        address: restaurantAddress,
        image: imageUrl,
      });
      toast.success('Restaurant added successfully!');
      e.target.reset();
      setRestaurantName('');
      setRestaurantAddress('');
      setRestaurantImage(null);
      fetchRestaurants();
    } catch (err) {
      toast.error('Failed to add restaurant.');
    }
  };

  const handleAddMenuItem = async (e) => {
    e.preventDefault();
    if (!menuRestaurantId) {
      toast.error('Please select a restaurant.');
      return;
    }
    const imageUrl = await uploadImage(menuImage);
    try {
      await apiClient.post(`/restaurants/${menuRestaurantId}/menu`, {
        name: menuName,
        price: menuPrice,
        description: menuDescription,
        image: imageUrl,
      });
      toast.success('Menu item added successfully!');
      e.target.reset();
      setMenuName('');
      setMenuPrice('');
      setMenuDescription('');
      setMenuImage(null);
      document.getElementById('menu-image-input').value = null;
      fetchRestaurants();
    } catch (err) {
      toast.error('Failed to add menu item.');
    }
  };

  const handleUpdateRestaurant = async (e, imageFile) => {
    e.preventDefault();
    let imageUrl = editingRestaurant.image;
    if (imageFile) {
      const uploaded = await uploadImage(imageFile);
      if (!uploaded) return;
      imageUrl = uploaded;
    }
    try {
      await apiClient.put(`/restaurants/${editingRestaurant._id}`, {
        ...editingRestaurant,
        image: imageUrl,
      });
      toast.success('Restaurant updated successfully!');
      setEditingRestaurant(null);
      fetchRestaurants();
    } catch (err) {
      toast.error('Failed to update restaurant.');
    }
  };

  const handleUpdateMenuItem = async (e, restaurantId) => {
    e.preventDefault();
    const imageFile = e.target.image.files[0];
    let imageUrl = editingMenuItem.image;
    if (imageFile) {
      const uploaded = await uploadImage(imageFile);
      if (!uploaded) return;
      imageUrl = uploaded;
    }
    try {
      await apiClient.put(
        `/restaurants/${restaurantId}/menu/${editingMenuItem._id}`,
        { ...editingMenuItem, image: imageUrl }
      );
      toast.success('Menu item updated successfully!');
      setEditingMenuItem(null);
      fetchRestaurants();
    } catch (err) {
      toast.error('Failed to update menu item.');
    }
  };

  const handleDeleteRestaurant = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This deletes the restaurant and its menu.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
    });

    if (result.isConfirmed) {
      try {
        await apiClient.delete(`/restaurants/${id}`);
        toast.success('Restaurant deleted');
        fetchRestaurants();
      } catch (err) {
        toast.error('Failed to delete restaurant.');
      }
    }
  };

  const handleDeleteMenuItem = async (restaurantId, menuItemId) => {
    const result = await Swal.fire({
      title: 'Delete menu item?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
    });

    if (result.isConfirmed) {
      try {
        await apiClient.delete(
          `/restaurants/${restaurantId}/menu/${menuItemId}`
        );
        toast.success('Menu item deleted');
        fetchRestaurants();
      } catch (err) {
        toast.error('Failed to delete menu item.');
      }
    }
  };
  

  return (
    <div className="container">
      <h2>Admin Dashboard</h2>
      <Link to="/admin/orders" className="button" style={{ marginBottom: '20px', display: 'inline-block' }}>
        Go to Order Management
      </Link>

      <form onSubmit={handleAddRestaurant}>
        <h3>Add Restaurant</h3>
        <input
          placeholder="Name"
          value={restaurantName}
          onChange={(e) => setRestaurantName(e.target.value)}
          required
        />
        <input
          placeholder="Address"
          value={restaurantAddress}
          onChange={(e) => setRestaurantAddress(e.target.value)}
          required
        />
        <input type="file" onChange={(e) => setRestaurantImage(e.target.files[0])} />
        <button type="submit">Add Restaurant</button>
      </form>

      <form onSubmit={handleAddMenuItem} style={{ margin: '30px 0' }}>
        <h3>Add Menu Item</h3>
        <select
          value={menuRestaurantId}
          onChange={(e) => setMenuRestaurantId(e.target.value)}
          required
        >
          <option value="">Select Restaurant</option>
          {restaurants.map((r) => (
            <option key={r._id} value={r._id}>
              {r.name}
            </option>
          ))}
        </select>
        <input
          placeholder="Item Name"
          value={menuName}
          onChange={(e) => setMenuName(e.target.value)}
          required
        />
        <input
          placeholder="Price"
          type="number"
          value={menuPrice}
          onChange={(e) => setMenuPrice(e.target.value)}
          required
        />
        <input
          placeholder="Description"
          value={menuDescription}
          onChange={(e) => setMenuDescription(e.target.value)}
          required
        />
        <input
          id="menu-image-input"
          type="file"
          onChange={(e) => setMenuImage(e.target.files[0])}
        />
        <button type="submit">Add Item</button>
      </form>

      <h3>Restaurant List</h3>
      {restaurants.map((res) => (
        <div key={res._id} className="card">
          {editingRestaurant?._id === res._id ? (
            <form onSubmit={handleUpdateRestaurant}>
              <input
                type="text"
                value={editingRestaurant.name}
                onChange={(e) =>
                  setEditingRestaurant({ ...editingRestaurant, name: e.target.value })
                }
              />
              <input
                type="text"
                value={editingRestaurant.address}
                onChange={(e) =>
                  setEditingRestaurant({ ...editingRestaurant, address: e.target.value })
                }
              />
              <input type="file" name="image" />
              <button type="submit">Save</button>
              <button onClick={() => setEditingRestaurant(null)}>Cancel</button>
            </form>
          ) : (
            <div>
              <strong>{res.name}</strong> - {res.address}
              <button onClick={() => setEditingRestaurant(res)}>Edit</button>
              <button onClick={() => handleDeleteRestaurant(res._id)}>Delete</button>
            </div>
          )}

          <h4 style={{ marginTop: '15px' }}>Menu:</h4>
          <ul>
            {res.menu.map((item) => (
              <li key={item._id}>
                {editingMenuItem?._id === item._id ? (
                  <form onSubmit={(e) => handleUpdateMenuItem(e, res._id)}>
                    <input
                      type="text"
                      value={editingMenuItem.name}
                      onChange={(e) =>
                        setEditingMenuItem({ ...editingMenuItem, name: e.target.value })
                      }
                    />
                    <input
                      type="number"
                      value={editingMenuItem.price}
                      onChange={(e) =>
                        setEditingMenuItem({ ...editingMenuItem, price: e.target.value })
                      }
                    />
                    <input
                      type="text"
                      value={editingMenuItem.description}
                      onChange={(e) =>
                        setEditingMenuItem({ ...editingMenuItem, description: e.target.value })
                      }
                    />
                    <input type="file" name="image" />
                    <button type="submit">Save</button>
                    <button onClick={() => setEditingMenuItem(null)}>Cancel</button>
                  </form>
                ) : (
                  <div>
                    {item.name} - ₹{item.price}
                    <button onClick={() => setEditingMenuItem(item)}>Edit</button>
                    <button onClick={() => handleDeleteMenuItem(res._id, item._id)}>
                      Delete
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}

      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default AdminDashboard;
