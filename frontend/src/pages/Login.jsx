import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { user, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to login');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '4rem auto' }} className="card">
      <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Welcome Back</h2>
      {error && <p className="error-text mb-1" style={{ textAlign: 'center' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
          Login
        </button>
      </form>
      <p className="mt-1 text-center" style={{ fontSize: '0.9rem' }}>
        Don't have an account? <Link to="/register" style={{ color: 'var(--accent-color)' }}>Sign up</Link>
      </p>
      
      <div className="mt-2" style={{ padding: '1rem', backgroundColor: 'var(--secondary-color)', borderRadius: 'var(--border-radius)', fontSize: '0.85rem' }}>
        <p><strong>Demo Credentials:</strong></p>
        <p>User: user@shop.com / password123</p>
        <p>Admin: admin@shop.com / admin123</p>
      </div>
    </div>
  );
}

export default Login;
