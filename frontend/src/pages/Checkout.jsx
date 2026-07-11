import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

function Checkout() {
  const { cart, clearCartState } = useCart();
  const { token } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    zip: '',
    card: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const totalAmount = cart.reduce((acc, item) => acc + (item.quantity * item.product.price), 0);

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError('');
    
    // Simple client side validation
    if (formData.card.length < 16) {
      return setError('Please enter a valid 16-digit card number.');
    }

    setLoading(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to place order');
      
      clearCartState();
      navigate('/orders');
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid" style={{ gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
      <div>
        <h2 className="mb-2">Checkout</h2>
        <div className="card">
          <h3 className="mb-1">Shipping Information</h3>
          {error && <p className="error-text mb-1">{error}</p>}
          <form onSubmit={handlePlaceOrder}>
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" name="name" className="form-control" required onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <label>Address</label>
              <input type="text" name="address" className="form-control" required onChange={handleInputChange} />
            </div>
            <div className="grid grid-cols-2">
              <div className="form-group">
                <label>City</label>
                <input type="text" name="city" className="form-control" required onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label>ZIP Code</label>
                <input type="text" name="zip" className="form-control" required onChange={handleInputChange} />
              </div>
            </div>
            
            <h3 className="mt-2 mb-1">Payment Information (Simulated)</h3>
            <div className="form-group">
              <label>Card Number (Enter 16 digits)</label>
              <input 
                type="text" 
                name="card" 
                className="form-control" 
                maxLength="16" 
                required 
                onChange={handleInputChange} 
              />
            </div>
            
            <button 
              type="submit" 
              className="btn btn-primary mt-1" 
              style={{ width: '100%', padding: '1rem' }}
              disabled={loading}
            >
              {loading ? 'Processing...' : `Pay $${totalAmount.toFixed(2)}`}
            </button>
          </form>
        </div>
      </div>
      
      <div>
        <div className="card" style={{ position: 'sticky', top: '100px' }}>
          <h3 className="mb-1">Order Summary</h3>
          <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
            {cart.map(item => (
              <div key={item.id} className="flex justify-between mb-1" style={{ fontSize: '0.9rem' }}>
                <span>{item.quantity}x {item.product.name}</span>
                <span>${(item.product.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          
          <div className="flex justify-between mb-2" style={{ fontWeight: '700', fontSize: '1.25rem' }}>
            <span>Total</span>
            <span>${totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
