import React, { useEffect, useState, useMemo } from 'react';
import axios from '../api';
import { useNavigate } from 'react-router-dom';
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
        alert('Could not load your cart. Please try again.');
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
        // --- THIS IS THE FIX ---
        // Display the actual error message from the backend API
        const errorMessage = err.response?.data?.message || `Could not update cart. Please try again.`;
        console.error(`Failed to ${action} item:`, err.response || err);
        alert(errorMessage);
    }
  };
  
  const clearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
        try {
            await axios.delete('/cart');
            fetchCart();
        } catch(err) {
            alert('Could not clear cart.');
        }
    }
  };
  
  const cartTotal = useMemo(() => {
      if (!cart || !cart.items) return 0;
      return cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cart.items]);


  return (
    <div className="container" style={{ maxWidth: '800px' }}>
      <h2>Your Cart</h2>
      {cart && cart.items && cart.items.length > 0 ? (
        <>
          {cart.items.map((item) => (
            <div key={item.productId || item._id} style={styles.cartItem}>
              <div style={styles.itemDetails}>
                <h4>{item.name}</h4>
                <p>₹{item.price.toFixed(2)}</p>
              </div>
              <div style={styles.quantityControl}>
                <button onClick={() => handleUpdateQuantity(item.productId, 'decrement')} style={styles.quantityButton}>-</button>
                <span style={styles.quantityText}>{item.quantity}</span>
                <button onClick={() => handleUpdateQuantity(item.productId, 'increment')} style={styles.quantityButton}>+</button>
              </div>
            </div>
          ))}
          <div style={styles.cartSummary}>
            <h3>Total: ₹{cartTotal.toFixed(2)}</h3>
            <button onClick={clearCart} className="button" style={{ backgroundColor: '#dc3545' }}>Clear Cart</button>
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

// ... styles remain the same
const styles = {
    cartItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid #ddd',
        padding: '15px 0',
    },
    itemDetails: {
        flex: 1,
    },
    quantityControl: {
        display: 'flex',
        alignItems: 'center',
    },
    quantityButton: {
        padding: '5px 10px',
        margin: '0 5px',
        cursor: 'pointer',
        border: '1px solid #ccc',
        backgroundColor: '#f8f9fa',
    },
    quantityText: {
        padding: '0 10px',
        fontWeight: 'bold',
    },
    cartSummary: {
        marginTop: '20px',
        textAlign: 'right',
    }
};