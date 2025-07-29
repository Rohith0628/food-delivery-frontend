import React, { useEffect, useState } from 'react';
import axios from '../api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles.css';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('/orders');
      setOrders(res.data);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      toast.error('Failed to load orders.');
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ✅ Custom Confirm Toast Component
  const ConfirmToast = ({ message, onConfirm, onCancel }) => (
    <div>
      <p>{message}</p>
      <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
        <button
          onClick={onConfirm}
          style={{ padding: '5px 10px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          Yes
        </button>
        <button
          onClick={onCancel}
          style={{ padding: '5px 10px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          No
        </button>
      </div>
    </div>
  );

  // ✅ Updated cancel handler with custom toast
  const handleCancelOrder = (orderId) => {
    const toastId = toast(
      <ConfirmToast
        message="Are you sure you want to cancel this order?"
        onConfirm={async () => {
          toast.dismiss(toastId);
          try {
            await axios.put(`/orders/${orderId}/cancel`);
            fetchOrders();
            toast.success('Order cancelled successfully.');
          } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to cancel order.';
            toast.error(errorMessage);
          }
        }}
        onCancel={() => toast.dismiss(toastId)}
      />,
      {
        autoClose: false,
        closeOnClick: false,
        closeButton: false,
      }
    );
  };

  return (
    <div className="container">
      <h2>My Orders</h2>

      {orders.length === 0 ? (
        <p className="muted-text">You have no orders yet.</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="card order-card">
            <div className="order-header">
              <h4>Order ID: {order._id}</h4>
              <p>Status: <strong className={`status-${order.status}`}>{order.status}</strong></p>
              <p>Total: ₹{order.total.toFixed(2)}</p>
            </div>

            <ul className="order-items">
              {order.items.map((item, index) => (
                <li key={index}>
                  {item.name} (x{item.quantity})
                </li>
              ))}
            </ul>

            {order.status === 'pending' && (
              <button
                onClick={() => handleCancelOrder(order._id)}
                className="button cancel-button"
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
