import React, { useEffect, useState } from 'react';
import axios from '../api';

export default function CartPage() {
  const [cart, setCart] = useState({ items: [] });

  const fetchCart = async () => {
    const res = await axios.get('/cart');
    setCart(res.data);
  };

  const clearCart = async () => {
    await axios.delete('/cart');
    fetchCart();
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Your Cart</h2>
      {cart.items.map((item, i) => (
        <div key={i} style={{ borderBottom: '1px solid #ccc', marginBottom: '10px' }}>
          <h4>{item.name}</h4>
          <p>Qty: {item.quantity} — ₹{item.price}</p>
        </div>
      ))}
      <button onClick={clearCart}>Clear Cart</button>
    </div>
  );
}
