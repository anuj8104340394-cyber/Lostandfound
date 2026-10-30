import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="form-container" style={{ textAlign: 'center', padding: '3.5rem 1.5rem' }}>
      <div style={{ fontSize: '4.5rem', marginBottom: '0.5rem' }}>🔍 404</div>
      <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.75rem', color: '#1e293b' }}>
        Page Lost on Campus
      </h2>
      <p style={{ color: '#64748b', fontSize: '1rem', maxWidth: '440px', margin: '0 auto 1.75rem' }}>
        We searched everywhere, but this page could not be found. It may have been moved, deleted, or claimed!
      </p>

      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link to="/" className="btn btn-primary">
          ← Return to Home
        </Link>
        <Link to="/report" className="btn btn-outline">
          Report an Item
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
