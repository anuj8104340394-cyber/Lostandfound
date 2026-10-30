import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect destination after login (defaults to home)
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      showToast('Please enter both email and password', 'error');
      return;
    }

    const result = await login(email, password);
    if (result.success) {
      showToast('Logged in successfully!', 'success');
      navigate(from, { replace: true });
    } else {
      showToast(result.message || 'Login failed', 'error');
    }
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <h2>Campus Portal Login</h2>
        <p>Sign in to manage and report campus items</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="login-email">Campus Email</label>
          <input
            id="login-email"
            type="email"
            placeholder="student@campus.edu"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="login-pass">Password</label>
          <input
            id="login-pass"
            type="password"
            placeholder="••••••••"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary"
          style={{ width: '100%', marginTop: '0.75rem', padding: '0.75rem' }}
        >
          {loading ? 'Logging in...' : 'Sign In'}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.85rem' }}>
        Don't have an account?{' '}
        <Link to="/register" style={{ color: '#3b82f6', fontWeight: '600' }}>
          Create an account
        </Link>
      </p>
    </div>
  );
};

export default Login;
