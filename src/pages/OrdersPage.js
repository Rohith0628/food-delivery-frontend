import React, { useEffect, useState } from 'react';
import axios from '../api';
import '../styles.css';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('/orders');
      setOrders(res.data);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ✅ NEW: Handler for the cancel order button
  const handleCancelOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        await axios.put(`/orders/${orderId}/cancel`);
        // Refresh the orders list to show the updated status
        fetchOrders();
        alert('Order cancelled successfully.');
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'Failed to cancel order.';
        alert(errorMessage);
      }
    }
  };

  return (
    <div className="container">
      <h2>My Orders</h2>
      {orders.length === 0 ? (
        <p>You have no orders yet.</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="card" style={{ position: 'relative' }}>
            <h4>Order ID: {order._id}</h4>
            <p>Status: <strong style={{ textTransform: 'capitalize' }}>{order.status}</strong></p>
            <p>Total: ₹{order.total.toFixed(2)}</p>
            <ul style={{ paddingLeft: '20px' }}>
              {order.items.map((item, index) => (
                <li key={index}>
                  {item.name} (x{item.quantity})
                </li>
              ))}
            </ul>

            {/* ✅ NEW: Conditionally render the cancel button */}
            {order.status === 'pending' && (
              <button 
                onClick={() => handleCancelOrder(order._id)}
                className="button"
                style={{ position: 'absolute', top: '20px', right: '20px', backgroundColor: '#dc3545' }}
              >
                Cancel Order
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}