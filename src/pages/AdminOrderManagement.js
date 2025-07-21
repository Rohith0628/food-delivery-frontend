import React, { useState, useEffect, useMemo } from 'react';
import axios from '../api';
import '../styles.css';

const AdminOrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  const apiClient = useMemo(() => {
    return axios.create({
      baseURL: 'http://localhost:5000/api',
      headers: { 'Authorization': `Bearer ${token}` }
    });
  }, [token]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) return;
      try {
        const res = await apiClient.get('/orders/all');
        setOrders(res.data);
      } catch (err) {
        console.error("Failed to load orders:", err.response || err);
        setError('Failed to load orders.');
      }
    };
    fetchOrders();
  }, [apiClient, token]);

  const categorizedOrders = useMemo(() => {
    const active = orders.filter(o => o.status === 'confirmed' || o.status === 'on the way');
    const pending = orders.filter(o => o.status === 'pending');
    const completed = orders.filter(o => o.status === 'delivered' || o.status === 'cancelled');
    return { active, pending, completed };
  }, [orders]);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await apiClient.put(`/orders/${orderId}/status`, { status: newStatus });
      setOrders(orders.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
      alert('Order status updated!');
    } catch (err) {
      alert('Failed to update status.');
    }
  };

  const OrderList = ({ orders, title }) => (
    <div style={{ marginBottom: '30px' }}>
      <h3>{title}</h3>
      {orders.length > 0 ? (
        orders.map(order => (
          <div key={order._id} className="card">
            <h4>Order ID: {order._id}</h4>
            <p>User: {order.userId?.username || 'N/A'}</p>
            <p>Total: ₹{order.total.toFixed(2)}</p>
            <ul style={{ paddingLeft: '20px', fontSize: '0.9em' }}>
              {order.items.map((item, index) => <li key={index}>{item.name} (x{item.quantity})</li>)}
            </ul>
            <select value={order.status} onChange={(e) => handleUpdateStatus(order._id, e.target.value)}>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="on the way">On the Way</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        ))
      ) : (
        <p>No orders in this category.</p>
      )}
    </div>
  );

  if (error) return <div className="container"><h2>Error: {error}</h2></div>;
  if (!token) return <div className="container"><h2>Access Denied</h2></div>;

  return (
    <div className="container">
      <h2>Order Management</h2>
      <OrderList orders={categorizedOrders.active} title="Active Orders (Confirmed & On the Way)" />
      <OrderList orders={categorizedOrders.pending} title="Pending Orders" />
      <OrderList orders={categorizedOrders.completed} title="Completed & Cancelled Orders" />
    </div>
  );
};

export default AdminOrderManagement;