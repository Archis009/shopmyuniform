import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders', {
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'PLACED': return '#3498db';
      case 'PROCESSING': return '#f39c12';
      case 'SHIPPED': return '#9b59b6';
      case 'DELIVERED': return '#2ecc71';
      default: return '#7f8c8d';
    }
  };

  if (loading) return <div className="loader"></div>;

  if (orders.length === 0) {
    return (
      <div className="card text-center" style={{ maxWidth: '600px', margin: '4rem auto' }}>
        <h2>No Orders Yet</h2>
        <p className="mt-1">You haven't placed any orders.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-2">Your Order History</h2>
      <div className="grid">
        {orders.map(order => (
          <div key={order.id} className="card">
            <div className="flex justify-between items-center mb-1 pb-1" style={{ borderBottom: '1px solid var(--border-color)' }}>
              <div>
                <strong>Order #{order.id}</strong>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>
                  {new Date(order.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span 
                  className="badge" 
                  style={{ backgroundColor: getStatusColor(order.status), color: 'white' }}
                >
                  {order.status}
                </span>
                <div style={{ fontWeight: '700', marginTop: '0.25rem' }}>
                  ${order.totalAmount.toFixed(2)}
                </div>
              </div>
            </div>
            
            <div>
              {order.orderItems.map(item => (
                <div key={item.id} className="flex justify-between" style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                  <span>{item.quantity}x {item.product.name}</span>
                  <span>${(item.priceAtPurchase * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OrderHistory;
