import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function Cart() {
  const { cart, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  const totalAmount = cart.reduce((acc, item) => acc + (item.quantity * item.product.price), 0);

  const handleUpdateQuantity = async (id, newQuantity, maxStock) => {
    if (newQuantity < 1) return;
    if (newQuantity > maxStock) return alert('Cannot exceed available stock');
    try {
      await updateQuantity(id, newQuantity);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleRemove = async (id) => {
    try {
      await removeFromCart(id);
    } catch (error) {
      alert(error.message);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="card text-center" style={{ maxWidth: '600px', margin: '4rem auto' }}>
        <h2>Your Cart is Empty</h2>
        <p className="mt-1 mb-2">Looks like you haven't added any items yet.</p>
        <Link to="/" className="btn btn-primary">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="grid" style={{ gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
      <div>
        <h2 className="mb-2">Shopping Cart</h2>
        <div className="card grid" style={{ gap: '1.5rem' }}>
          {cart.map(item => (
            <div key={item.id} style={{ display: 'flex', gap: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
              <img 
                src={item.product.imageUrl} 
                alt={item.product.name} 
                style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: 'var(--border-radius)' }} 
              />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div className="flex justify-between">
                  <Link to={`/product/${item.product.id}`} style={{ fontWeight: '600', fontSize: '1.1rem' }}>
                    {item.product.name}
                  </Link>
                  <span style={{ fontWeight: '700' }}>${(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
                <div style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: 'auto' }}>
                  ${item.product.price.toFixed(2)} each
                </div>
                
                <div className="flex justify-between items-center mt-1">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <button 
                      className="btn btn-secondary" 
                      style={{ padding: '0.2rem 0.6rem' }}
                      onClick={() => handleUpdateQuantity(item.id, item.quantity - 1, item.product.stock)}
                    >-</button>
                    <span>{item.quantity}</span>
                    <button 
                      className="btn btn-secondary" 
                      style={{ padding: '0.2rem 0.6rem' }}
                      onClick={() => handleUpdateQuantity(item.id, item.quantity + 1, item.product.stock)}
                    >+</button>
                  </div>
                  <button 
                    className="btn btn-danger" 
                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                    onClick={() => handleRemove(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <div className="card" style={{ position: 'sticky', top: '100px' }}>
          <h3 className="mb-1">Order Summary</h3>
          <div className="flex justify-between mb-1" style={{ color: 'var(--text-light)' }}>
            <span>Subtotal</span>
            <span>${totalAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-1" style={{ color: 'var(--text-light)' }}>
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <div className="flex justify-between mb-2" style={{ fontWeight: '700', fontSize: '1.25rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
            <span>Total</span>
            <span>${totalAmount.toFixed(2)}</span>
          </div>
          
          <button 
            className="btn btn-primary" 
            style={{ width: '100%' }}
            onClick={() => navigate('/checkout')}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;
