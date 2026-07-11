import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  
  const { addToCart } = useCart();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { user } = useAuth();

  useEffect(() => {
    fetchProduct();
    // eslint-disable-next-line
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await fetch(`/api/products/${id}`);
      if (!res.ok) throw new Error('Product not found');
      const data = await res.json();
      setProduct(data);
    } catch (error) {
      console.error(error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loader"></div>;
  if (!product) return null;

  const isWishlisted = wishlist.some(w => w.productId === product.id);

  const toggleWishlist = async () => {
    if (!user) return alert('Please login to use wishlist');
    const wishlistItem = wishlist.find(w => w.productId === product.id);
    try {
      if (wishlistItem) {
        await removeFromWishlist(wishlistItem.id);
      } else {
        await addToWishlist(product.id);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const handleAddToCart = async () => {
    if (!user) return alert('Please login to add to cart');
    if (product.stock < quantity) return alert('Not enough stock');
    try {
      await addToCart(product.id, quantity);
      alert('Added to cart!');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="card grid grid-cols-2" style={{ gap: '3rem', maxWidth: '1000px', margin: '0 auto' }}>
      <div>
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          style={{ width: '100%', borderRadius: 'var(--border-radius)', objectFit: 'cover' }} 
        />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div className="flex justify-between items-center mb-1">
          <span className="badge">{product.category?.name}</span>
          <button 
            onClick={toggleWishlist}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem' }}
          >
            {isWishlisted ? '❤️' : '🤍'}
          </button>
        </div>
        
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{product.name}</h1>
        <h2 style={{ fontSize: '1.75rem', color: 'var(--primary-color)', marginBottom: '1.5rem' }}>
          ${product.price.toFixed(2)}
        </h2>
        
        <p style={{ color: 'var(--text-light)', marginBottom: '2rem', fontSize: '1.1rem', lineHeight: 1.6 }}>
          {product.description}
        </p>

        {product.size && (
          <div className="mb-1">
            <strong>Size:</strong> {product.size}
          </div>
        )}

        <div className="mb-2">
          <strong>Availability:</strong>{' '}
          {product.stock > 0 ? (
            <span style={{ color: 'var(--success-color)' }}>{product.stock} in stock</span>
          ) : (
            <span style={{ color: 'var(--danger-color)' }}>Out of stock</span>
          )}
        </div>

        {product.stock > 0 && (
          <div style={{ display: 'flex', gap: '1rem', marginTop: 'auto' }}>
            <input 
              type="number" 
              min="1" 
              max={product.stock}
              className="form-control" 
              style={{ width: '80px' }}
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
            />
            <button className="btn btn-accent" style={{ flex: 1 }} onClick={handleAddToCart}>
              Add to Cart
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductDetail;
