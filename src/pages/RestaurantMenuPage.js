import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../api';

export default function RestaurantMenuPage() {
  const { id } = useParams();
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    axios.get(`/restaurants/${id}/menu`).then((res) => setMenu(res.data));
  }, [id]);

  const addToCart = async (item) => {
    try {
      await axios.post('/cart/add', { ...item, quantity: 1 });
      alert('Added to cart!');
    } catch (err) {
      alert('Login first!');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Menu</h2>
      {menu.map((item) => (
        <div key={item._id} style={{ border: '1px solid #ddd', padding: '10px', marginBottom: '10px' }}>
          <h3>{item.name} - ₹{item.price}</h3>
          <p>{item.description}</p>
          <button onClick={() => addToCart(item)}>Add to Cart</button>
        </div>
      ))}
    </div>
  );
}
    