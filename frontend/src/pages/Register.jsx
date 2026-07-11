import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (password.length < 6) throw new Error('Password must be at least 6 characters');
      await register(email, password, 'USER'); // Default to USER
      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to register');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '4rem auto' }} className="card">
      <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Create an Account</h2>
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
            minLength={6}
          />
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
          Sign Up
        </button>
      </form>
      <p className="mt-1 text-center" style={{ fontSize: '0.9rem' }}>
        Already have an account? <Link to="/login" style={{ color: 'var(--accent-color)' }}>Login</Link>
      </p>
    </div>
  );
}

export default Register;
