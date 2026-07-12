import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';

function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { user } = useAuth();

  // Filters & Pagination state
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('newest');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, category, sort, minPrice, maxPrice, page]);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        search,
        category,
        sort,
        page,
        limit: 8
      });
      if (minPrice) query.append('minPrice', minPrice);
      if (maxPrice) query.append('maxPrice', maxPrice);
      
      const res = await fetch(`/api/products?${query.toString()}`);
      const data = await res.json();
      setProducts(data.products || []);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1); // Reset to first page on new search
    fetchProducts();
  };

  const toggleWishlist = async (productId) => {
    if (!user) return alert('Please login to use wishlist');
    
    const wishlistItem = wishlist.find(w => w.productId === productId);
    try {
      if (wishlistItem) {
        await removeFromWishlist(wishlistItem.id);
      } else {
        await addToWishlist(productId);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const handleAddToCart = async (productId, stock) => {
    if (!user) return alert('Please login to add to cart');
    if (stock < 1) return alert('Out of stock');
    try {
      await addToCart(productId, 1);
      alert('Added to cart!');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div>
      <div className="card mb-2" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem', flex: 1, minWidth: '250px' }}>
          <input 
            type="text" 
            className="form-control" 
            placeholder="Search products..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">Search</button>
        </form>
        
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
            <input 
              type="number" 
              placeholder="Min $" 
              className="form-control" 
              style={{ width: '80px' }}
              value={minPrice}
              onChange={(e) => { setMinPrice(e.target.value); setPage(1); }}
            />
            <span style={{ color: 'var(--text-light)' }}>-</span>
            <input 
              type="number" 
              placeholder="Max $" 
              className="form-control" 
              style={{ width: '80px' }}
              value={maxPrice}
              onChange={(e) => { setMaxPrice(e.target.value); setPage(1); }}
            />
          </div>

          <select 
            className="form-control" 
            value={category} 
            onChange={(e) => { setCategory(e.target.value); setPage(1); }}
            style={{ width: 'auto' }}
          >
            <option value="">All Categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <select 
            className="form-control" 
            value={sort} 
            onChange={(e) => { setSort(e.target.value); setPage(1); }}
            style={{ width: 'auto' }}
          >
            <option value="newest">Newest Arrivals</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loader"></div>
      ) : products.length === 0 ? (
        <div className="text-center mt-2">
          <h3>No products found</h3>
          <p>Try adjusting your search or filters.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-4">
            {products.map(product => {
              const isWishlisted = wishlist.some(w => w.productId === product.id);
              return (
                <div key={product.id} className="product-card">
                  <Link to={`/product/${product.id}`}>
                    <img src={product.imageUrl} alt={product.name} className="product-image" />
                  </Link>
                  <div className="product-info">
                    <div className="flex justify-between items-center mb-1">
                      <span className="badge">{product.category?.name}</span>
                      <button 
                        onClick={() => toggleWishlist(product.id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.25rem' }}
                      >
                        {isWishlisted ? '❤️' : '🤍'}
                      </button>
                    </div>
                    <Link to={`/product/${product.id}`} className="product-title">{product.name}</Link>
                    <div className="flex justify-between items-center mt-1">
                      <span className="product-price">${product.price.toFixed(2)}</span>
                      {product.stock > 0 ? (
                        <button 
                          className="btn btn-accent" 
                          onClick={() => handleAddToCart(product.id, product.stock)}
                          style={{ padding: '0.25rem 0.75rem', fontSize: '0.9rem' }}
                        >
                          Add +
                        </button>
                      ) : (
                        <span className="text-light">Out of Stock</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-1 mt-2">
              <button 
                className="btn btn-secondary" 
                disabled={page === 1} 
                onClick={() => setPage(p => p - 1)}
              >
                Previous
              </button>
              <span>Page {page} of {totalPages}</span>
              <button 
                className="btn btn-secondary" 
                disabled={page === totalPages} 
                onClick={() => setPage(p => p + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Home;
