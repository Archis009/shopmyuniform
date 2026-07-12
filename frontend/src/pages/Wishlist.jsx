import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

function Wishlist() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleRemove = async (id) => {
    try {
      await removeFromWishlist(id);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleAddToCart = async (item) => {
    if (item.product.stock < 1) return alert('Out of stock');
    try {
      await addToCart(item.productId, 1);
      await removeFromWishlist(item.id);
      alert('Moved to cart!');
    } catch (error) {
      alert(error.message);
    }
  };

  if (wishlist.length === 0) {
    return (
      <div className="card text-center" style={{ maxWidth: '600px', margin: '4rem auto' }}>
        <h2>Your Wishlist is Empty</h2>
        <p className="mt-1 mb-2">Save items you like and they will show up here.</p>
        <Link to="/" className="btn btn-primary">Discover Products</Link>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-2">Your Wishlist</h2>
      <div className="grid grid-cols-4">
        {wishlist.map(item => (
          <div key={item.id} className="product-card">
            <Link to={`/product/${item.product.id}`}>
              <img src={item.product.imageUrl} alt={item.product.name} className="product-image" />
            </Link>
            <div className="product-info">
              <Link to={`/product/${item.product.id}`} className="product-title">{item.product.name}</Link>
              <span className="product-price mb-1">₹{item.product.price.toFixed(2)}</span>
              
              <div className="flex gap-1" style={{ marginTop: 'auto' }}>
                <button 
                  className="btn btn-primary" 
                  style={{ flex: 1, padding: '0.4rem', fontSize: '0.85rem' }}
                  onClick={() => handleAddToCart(item)}
                  disabled={item.product.stock < 1}
                >
                  Move to Cart
                </button>
                <button 
                  className="btn btn-secondary" 
                  style={{ padding: '0.4rem 0.6rem' }}
                  onClick={() => handleRemove(item.id)}
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Wishlist;
