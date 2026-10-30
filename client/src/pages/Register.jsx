import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { register, loading } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      showToast('Please fill in all fields', 'error');
      return;
    }

    if (password.length < 6) {
      showToast('Password must be at least 6 characters long', 'error');
      return;
    }

    if (password !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }

    const result = await register(name, email, password);
    if (result.success) {
      showToast('Account registered successfully!', 'success');
      navigate('/');
    } else {
      showToast(result.message || 'Registration failed', 'error');
    }
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <h2>Register Campus Account</h2>
        <p>Join the community to report and claim lost belongings</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="reg-name">Full Name</label>
          <input
            id="reg-name"
            type="text"
            placeholder="Alex Johnson"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="reg-email">Campus Email</label>
          <input
            id="reg-email"
            type="email"
            placeholder="alex@campus.edu"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="reg-pass">Password (Min. 6 chars)</label>
          <input
            id="reg-pass"
            type="password"
            placeholder="••••••••"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="reg-confirm">Confirm Password</label>
          <input
            id="reg-confirm"
            type="password"
            placeholder="••••••••"
            className="form-control"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary"
          style={{ width: '100%', marginTop: '0.75rem', padding: '0.75rem' }}
        >
          {loading ? 'Creating Account...' : 'Register Account'}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.85rem' }}>
        Already have an account?{' '}
        <Link to="/login" style={{ color: '#3b82f6', fontWeight: '600' }}>
          Log In
        </Link>
      </p>
    </div>
  );
};

export default Register;
