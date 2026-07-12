import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token } = useAuth();

  // Form states
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    categoryId: '',
    imageUrl: '',
    size: ''
  });

  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    slug: ''
  });

  useEffect(() => {
    fetchInitialData();
    // eslint-disable-next-line
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    setError('');
    try {
      await Promise.all([
        fetchAdminOrders(),
        fetchProducts(),
        fetchCategories()
      ]);
    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const fetchAdminOrders = async () => {
    const res = await fetch('/api/admin/orders', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    if (res.ok) setOrders(data);
  };

  const fetchProducts = async () => {
    const res = await fetch('/api/products?limit=100');
    const data = await res.json();
    if (res.ok) setProducts(data.products || []);
  };

  const fetchCategories = async () => {
    const res = await fetch('/api/categories');
    const data = await res.json();
    if (res.ok) setCategories(data);
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
      
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      alert('Order status updated!');
    } catch (error) {
      alert(error.message);
    }
  };

  // Product CRUD Handlers
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const method = editingProduct ? 'PUT' : 'POST';
    const url = editingProduct 
      ? `/api/admin/products/${editingProduct.id}` 
      : '/api/admin/products';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productForm)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save product');

      alert(editingProduct ? 'Product updated successfully!' : 'Product created successfully!');
      setIsAddingProduct(false);
      setEditingProduct(null);
      setProductForm({ name: '', description: '', price: '', stock: '', categoryId: '', imageUrl: '', size: '' });
      fetchProducts();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditProductClick = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      categoryId: product.categoryId,
      imageUrl: product.imageUrl || '',
      size: product.size || ''
    });
    setIsAddingProduct(true);
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete product');
      alert('Product deleted successfully!');
      fetchProducts();
    } catch (err) {
      alert(err.message);
    }
  };

  // Category CRUD Handlers
  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    setError('');
    const method = editingCategory ? 'PUT' : 'POST';
    const url = editingCategory 
      ? `/api/admin/categories/${editingCategory.id}` 
      : '/api/admin/categories';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(categoryForm)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save category');

      alert(editingCategory ? 'Category updated successfully!' : 'Category created successfully!');
      setIsAddingCategory(false);
      setEditingCategory(null);
      setCategoryForm({ name: '', slug: '' });
      fetchCategories();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditCategoryClick = (category) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name,
      slug: category.slug
    });
    setIsAddingCategory(true);
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete category');
      alert('Category deleted successfully!');
      fetchCategories();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div className="loader"></div>;

  return (
    <div>
      <h2 className="mb-2">Admin Dashboard</h2>

      {/* Tabs Menu */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border-color)', marginBottom: '2rem' }}>
        <button 
          onClick={() => { setActiveTab('orders'); setError(''); setIsAddingProduct(false); setIsAddingCategory(false); }}
          className={`btn ${activeTab === 'orders' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0, borderBottom: activeTab === 'orders' ? '2px solid var(--accent-color)' : 'none' }}
        >
          Orders ({orders.length})
        </button>
        <button 
          onClick={() => { setActiveTab('products'); setError(''); setIsAddingProduct(false); setIsAddingCategory(false); }}
          className={`btn ${activeTab === 'products' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0, borderBottom: activeTab === 'products' ? '2px solid var(--accent-color)' : 'none' }}
        >
          Products ({products.length})
        </button>
        <button 
          onClick={() => { setActiveTab('categories'); setError(''); setIsAddingProduct(false); setIsAddingCategory(false); }}
          className={`btn ${activeTab === 'categories' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0, borderBottom: activeTab === 'categories' ? '2px solid var(--accent-color)' : 'none' }}
        >
          Categories ({categories.length})
        </button>
      </div>

      {error && <p className="error-text mb-2">{error}</p>}

      {/* ORDERS TAB */}
      {activeTab === 'orders' && (
        <div className="card" style={{ overflowX: 'auto' }}>
          <h3 className="mb-2">Manage Orders</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                <th style={{ padding: '1rem' }}>Order ID</th>
                <th style={{ padding: '1rem' }}>Date</th>
                <th style={{ padding: '1rem' }}>Customer (Email)</th>
                <th style={{ padding: '1rem' }}>Address</th>
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
                  <td style={{ padding: '1rem' }}>{order.user?.email}</td>
                  <td style={{ padding: '1rem', fontSize: '0.85rem' }}>
                    {order.shippingName}<br />
                    {order.shippingAddress}, {order.shippingCity} ({order.shippingZip})
                  </td>
                  <td style={{ padding: '1rem' }}>₹{order.totalAmount.toFixed(2)}</td>
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
          {orders.length === 0 && <p className="text-center mt-2">No orders found.</p>}
        </div>
      )}

      {/* PRODUCTS TAB */}
      {activeTab === 'products' && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3>Manage Products</h3>
            {!isAddingProduct && (
              <button 
                onClick={() => { setIsAddingProduct(true); setEditingProduct(null); }} 
                className="btn btn-primary"
              >
                Add Product
              </button>
            )}
          </div>

          {isAddingProduct ? (
            <div className="card mb-2" style={{ maxWidth: '600px', margin: '0 auto' }}>
              <h4>{editingProduct ? 'Edit Product' : 'Add New Product'}</h4>
              <form onSubmit={handleProductSubmit} className="mt-1">
                <div className="form-group">
                  <label>Product Name *</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    required 
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Description *</label>
                  <textarea 
                    className="form-control" 
                    required 
                    rows="3"
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
                  <div className="form-group">
                    <label>Price (₹) *</label>
                    <input 
                      type="number" 
                      step="0.01" 
                      className="form-control" 
                      required 
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Stock *</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      required 
                      value={productForm.stock}
                      onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
                  <div className="form-group">
                    <label>Category *</label>
                    <select 
                      className="form-control" 
                      required 
                      value={productForm.categoryId}
                      onChange={(e) => setProductForm({ ...productForm, categoryId: e.target.value })}
                    >
                      <option value="">Select Category</option>
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Size (Optional)</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="e.g. M, L, 32x32"
                      value={productForm.size}
                      onChange={(e) => setProductForm({ ...productForm, size: e.target.value })}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Image URL (Optional)</label>
                  <input 
                    type="url" 
                    className="form-control" 
                    placeholder="https://example.com/image.jpg"
                    value={productForm.imageUrl}
                    onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                  />
                </div>
                <div className="flex gap-1 mt-2">
                  <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                    {editingProduct ? 'Update Product' : 'Create Product'}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => { setIsAddingProduct(false); setEditingProduct(null); setProductForm({ name: '', description: '', price: '', stock: '', categoryId: '', imageUrl: '', size: '' }); }} 
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="card" style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                    <th style={{ padding: '1rem' }}>Image</th>
                    <th style={{ padding: '1rem' }}>Name</th>
                    <th style={{ padding: '1rem' }}>Category</th>
                    <th style={{ padding: '1rem' }}>Price</th>
                    <th style={{ padding: '1rem' }}>Stock</th>
                    <th style={{ padding: '1rem' }}>Size</th>
                    <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '0.5rem 1rem' }}>
                        <img 
                          src={product.imageUrl} 
                          alt={product.name} 
                          style={{ width: '40px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} 
                        />
                      </td>
                      <td style={{ padding: '1rem' }}><strong>{product.name}</strong></td>
                      <td style={{ padding: '1rem' }}>{product.category?.name}</td>
                      <td style={{ padding: '1rem' }}>₹{product.price.toFixed(2)}</td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{ color: product.stock === 0 ? 'var(--danger-color)' : 'inherit' }}>
                          {product.stock}
                        </span>
                      </td>
                      <td style={{ padding: '1rem' }}>{product.size || '-'}</td>
                      <td style={{ padding: '1rem', textAlign: 'right' }}>
                        <button 
                          onClick={() => handleEditProductClick(product)} 
                          className="btn btn-secondary"
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.85rem', marginRight: '0.5rem' }}
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteProduct(product.id)} 
                          className="btn btn-secondary"
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.85rem', color: 'var(--danger-color)', borderColor: 'var(--danger-color)' }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {products.length === 0 && <p className="text-center mt-2">No products found.</p>}
            </div>
          )}
        </div>
      )}

      {/* CATEGORIES TAB */}
      {activeTab === 'categories' && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3>Manage Categories</h3>
            {!isAddingCategory && (
              <button 
                onClick={() => { setIsAddingCategory(true); setEditingCategory(null); }} 
                className="btn btn-primary"
              >
                Add Category
              </button>
            )}
          </div>

          {isAddingCategory ? (
            <div className="card mb-2" style={{ maxWidth: '500px', margin: '0 auto' }}>
              <h4>{editingCategory ? 'Edit Category' : 'Add New Category'}</h4>
              <form onSubmit={handleCategorySubmit} className="mt-1">
                <div className="form-group">
                  <label>Category Name *</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    required 
                    placeholder="e.g. Kids Wear"
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Slug *</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    required 
                    placeholder="e.g. kids"
                    value={categoryForm.slug}
                    onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                  />
                </div>
                <div className="flex gap-1 mt-2">
                  <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                    {editingCategory ? 'Update Category' : 'Create Category'}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => { setIsAddingCategory(false); setEditingCategory(null); setCategoryForm({ name: '', slug: '' }); }} 
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="card" style={{ maxWidth: '700px', margin: '0 auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                    <th style={{ padding: '1rem' }}>ID</th>
                    <th style={{ padding: '1rem' }}>Category Name</th>
                    <th style={{ padding: '1rem' }}>Slug</th>
                    <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map(category => (
                    <tr key={category.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '1rem' }}>#{category.id}</td>
                      <td style={{ padding: '1rem' }}><strong>{category.name}</strong></td>
                      <td style={{ padding: '1rem' }}><code>{category.slug}</code></td>
                      <td style={{ padding: '1rem', textAlign: 'right' }}>
                        <button 
                          onClick={() => handleEditCategoryClick(category)} 
                          className="btn btn-secondary"
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.85rem', marginRight: '0.5rem' }}
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteCategory(category.id)} 
                          className="btn btn-secondary"
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.85rem', color: 'var(--danger-color)', borderColor: 'var(--danger-color)' }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
