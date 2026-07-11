import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

function Navbar() {
  const { user, logout } = useAuth();
  const { cart, clearCartState } = useCart();
  const { wishlist } = useWishlist();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    clearCartState();
    navigate('/login');
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">ShopMyUniform</Link>
      
      <div className="nav-links">
        <Link to="/">Shop</Link>
        {user ? (
          <>
            <Link to="/wishlist">Wishlist {wishlist.length > 0 && <span className="badge">{wishlist.length}</span>}</Link>
            <Link to="/cart">Cart {cartCount > 0 && <span className="badge">{cartCount}</span>}</Link>
            <Link to="/orders">Orders</Link>
            {user.role === 'ADMIN' && (
              <Link to="/admin">Admin</Link>
            )}
            <button onClick={handleLogout} className="btn btn-secondary">Logout</button>
          </>
        ) : (
          <div className="nav-actions">
            <Link to="/login" className="btn btn-secondary">Login</Link>
            <Link to="/register" className="btn btn-primary">Sign Up</Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
