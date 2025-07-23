import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../api'; // This uses your custom instance with the token

export default function RestaurantMenuPage() {
  const { id } = useParams();
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    // Fetches the menu for the specific restaurant using its ID
    axios.get(`/restaurants/${id}/menu`).then((res) => setMenu(res.data));
  }, [id]);

  const addToCart = async (item) => {
    try {
      // The backend /cart/add route is protected by the auth middleware
      await axios.post('/cart/add', { ...item, quantity: 1 });
      alert('Added to cart!');
    } catch (err) {
    
      const errorMessage = err.response?.data?.message || 'An error occurred. Please log in and try again.';
      console.error("Add to cart error:", err.response); // For developer debugging
      alert(errorMessage);
    }
  };

 return (
    <div className="container">
      <h2>Menu</h2>
      {menu.map((item) => (
        <div key={item._id} className="card">
          <h3>{item.name} - ₹{item.price}</h3>
          <p>{item.description}</p>
          <button onClick={() => addToCart(item)} className="button">Add to Cart</button>
        </div>
      ))}
    </div>
  );
}