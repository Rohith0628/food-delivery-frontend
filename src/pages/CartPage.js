import React, { useEffect, useState, useMemo } from 'react';
import axios from '../api';
import { useNavigate } from 'react-router-dom';
import '../styles.css';

export default function CartPage() {
  const [cart, setCart] = useState({ items: [] });
  const navigate = useNavigate();

  const fetchCart = async () => {
    // ... (fetchCart logic remains the same)
    try {
        const res = await axios.get('/cart');
        setCart(res.data || { items: [] });
    } catch (err) {
        console.error('Failed to fetch cart:', err);
    }
  };
  
  useEffect(() => {
    fetchCart();
  }, []);

  const handleUpdateQuantity = async (productId, action) => {
    // ... (handleUpdateQuantity logic remains the same)
     try {
        const endpoint = action === 'increment' ? '/cart/increment' : '/cart/decrement';
        const res = await axios.post(endpoint, { productId });
        setCart(res.data);
    } catch (err) {
        console.error(`Failed to ${action} item:`, err);
    }
  };
  
  const cartTotal = useMemo(() => {
      return cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cart.items]);

  // --- NEW: Place Order function ---
  const handlePlaceOrder = async () => {
    try {
        await axios.post('/orders', {
            items: cart.items,
            total: cartTotal
        });
        await axios.delete('/cart'); // Clear cart after placing order
        alert('Order placed successfully!');
        navigate('/orders'); // Navigate to orders page
    } catch (err) {
        alert('Failed to place order.');
    }
  };

  return (
    <div className="container" style={{ maxWidth: '800px' }}>
      <h2>Your Cart</h2>
      {cart.items && cart.items.length > 0 ? (
        <>
          {cart.items.map((item) => (
             <div key={item.productId || item._id} style={{display: 'flex', justifyContent: 'space-between'}}>
                <div>
                    <h4>{item.name}</h4>
                    <p>₹{item.price.toFixed(2)}</p>
                </div>
                <div>
                    <button onClick={() => handleUpdateQuantity(item.productId, 'decrement')}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => handleUpdateQuantity(item.productId, 'increment')}>+</button>
                </div>
            </div>
          ))}
          <div style={{textAlign: 'right'}}>
            <h3>Total: ₹{cartTotal.toFixed(2)}</h3>
            <button onClick={handlePlaceOrder} className="button">Place Order</button>
          </div>
        </>
      ) : (
        <p>Your cart is empty.</p>
      )}
      <button onClick={() => navigate('/')} className="button" style={{ marginTop: '20px' }}>
        Continue Shopping
      </button>
    </div>
  );
}