import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    fetchAdminOrders();
    // eslint-disable-next-line
  }, []);

  const fetchAdminOrders = async () => {
    try {
      const res = await fetch('/api/admin/orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (!res.ok) throw new Error('Failed to update status');
      
      // Update local state
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (error) {
      alert(error.message);
    }
  };

  if (loading) return <div className="loader"></div>;

  return (
    <div>
      <h2 className="mb-2">Admin Dashboard - Manage Orders</h2>
      
      <div className="card" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
              <th style={{ padding: '1rem' }}>Order ID</th>
              <th style={{ padding: '1rem' }}>Date</th>
              <th style={{ padding: '1rem' }}>Customer (Email)</th>
              <th style={{ padding: '1rem' }}>Amount</th>
              <th style={{ padding: '1rem' }}>Status</th>
              <th style={{ padding: '1rem' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '1rem' }}>#{order.id}</td>
                <td style={{ padding: '1rem' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td style={{ padding: '1rem' }}>{order.user.email}</td>
                <td style={{ padding: '1rem' }}>${order.totalAmount.toFixed(2)}</td>
                <td style={{ padding: '1rem' }}>
                  <span className="badge" style={{ backgroundColor: '#eee', color: '#333' }}>
                    {order.status}
                  </span>
                </td>
                <td style={{ padding: '1rem' }}>
                  <select 
                    className="form-control" 
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                    style={{ padding: '0.25rem', width: 'auto' }}
                  >
                    <option value="PLACED">Placed</option>
                    <option value="PROCESSING">Processing</option>
                    <option value="SHIPPED">Shipped</option>
                    <option value="DELIVERED">Delivered</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && (
          <p className="text-center mt-2">No orders found.</p>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
