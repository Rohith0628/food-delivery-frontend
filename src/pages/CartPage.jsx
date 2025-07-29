import React, { useEffect, useState, useMemo } from 'react';
import axios from '../api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; // ✅ Add toast import
import 'react-toastify/dist/ReactToastify.css';
import '../styles.css';

export default function CartPage() {
  const [cart, setCart] = useState({ items: [] });
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const res = await axios.get('/cart');
      setCart(res.data || { items: [] });
    } catch (err) {
      console.error('Failed to fetch cart:', err);
      toast.error('Failed to fetch cart.');
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleUpdateQuantity = async (productId, action) => {
    try {
      const endpoint = action === 'increment' ? '/cart/increment' : '/cart/decrement';
      const res = await axios.post(endpoint, { productId });
      setCart(res.data);
    } catch (err) {
      console.error(`Failed to ${action} item:`, err);
      toast.error(`Failed to ${action} item`);
    }
  };

  const cartTotal = useMemo(() => {
    return cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cart.items]);

  const handlePlaceOrder = async () => {
    try {
      await axios.post('/orders', {
        items: cart.items,
        total: cartTotal
      });
      await axios.delete('/cart'); // Clear cart after placing order
      toast.success('Order placed successfully!');
      setTimeout(() => navigate('/orders'), 1000); // short delay for toast visibility
    } catch (err) {
      toast.error('Failed to place order. Please try again.');
    }
  };

  return (
    <div className="container" style={{ maxWidth: '800px' }}>
      <h2>Your Cart</h2>
      {cart.items && cart.items.length > 0 ? (
        <>
          {cart.items.map((item) => (
            <div
              key={item.productId || item._id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '15px',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '8px',
              }}
            >
              <div>
                <h4>{item.name}</h4>
                <p>₹{item.price.toFixed(2)}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <button onClick={() => handleUpdateQuantity(item.productId, 'decrement')}>-</button>
                <span style={{ margin: '0 10px' }}>{item.quantity}</span>
                <button onClick={() => handleUpdateQuantity(item.productId, 'increment')}>+</button>
              </div>
            </div>
          ))}
          <div style={{ textAlign: 'right', marginTop: '20px' }}>
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
