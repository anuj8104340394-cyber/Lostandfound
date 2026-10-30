import React, { useState, useEffect, useCallback } from 'react';
import ItemCard from '../components/ItemCard';
import { API_BASE_URL } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const CATEGORIES = ['All', 'Phone', 'Wallet', 'ID Card', 'Bag', 'Keys', 'Books', 'Other'];

const Home = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters state
  const [search, setSearch] = useState('');
  const [type, setType] = useState('All');
  const [category, setCategory] = useState('All');
  const [date, setDate] = useState('');
  const [showClaimed, setShowClaimed] = useState(false);

  // Fetch items based on active filters
  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const params = new URLSearchParams();
      if (search.trim()) params.append('search', search.trim());
      if (type !== 'All') params.append('type', type);
      if (category !== 'All') params.append('category', category);
      if (date) params.append('date', date);
      if (showClaimed) params.append('showClaimed', 'true');

      const res = await fetch(`${API_BASE_URL}/items?${params.toString()}`);
      if (!res.ok) {
        throw new Error('Failed to load items');
      }

      const data = await res.json();
      setItems(data);
    } catch (err) {
      setError(err.message || 'Error connecting to backend server');
    } finally {
      setLoading(false);
    }
  }, [search, type, category, date, showClaimed]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleClearFilters = () => {
    setSearch('');
    setType('All');
    setCategory('All');
    setDate('');
    setShowClaimed(false);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <h1>Campus Lost & Found</h1>
        <p>
          Reconnecting students and staff with their missing belongings. Report what you've lost
          or return what you've found!
        </p>
        <div>
          <Link to="/report" className="btn btn-primary">
            + Report an Item
          </Link>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section className="filter-card">
        <div className="filter-grid">
          {/* Keyword Search */}
          <div className="filter-group">
            <label htmlFor="search">Search</label>
            <input
              id="search"
              type="text"
              placeholder="Search by title, location..."
              className="form-control"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Type Filter */}
          <div className="filter-group">
            <label htmlFor="type">Type</label>
            <select
              id="type"
              className="form-control"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="All">All Types</option>
              <option value="Lost">Lost</option>
              <option value="Found">Found</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="filter-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              className="form-control"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Date Filter */}
          <div className="filter-group">
            <label htmlFor="date">Date</label>
            <input
              id="date"
              type="date"
              className="form-control"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          {/* Clear Filters Button */}
          <div className="filter-group">
            <button
              onClick={handleClearFilters}
              className="btn btn-outline"
              type="button"
              style={{ width: '100%' }}
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Toggle Claimed items */}
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={showClaimed}
            onChange={(e) => setShowClaimed(e.target.checked)}
          />
          Show resolved/claimed items
        </label>
      </section>

      {/* Error Message */}
      {error && (
        <div className="toast toast-error" style={{ marginBottom: '1.5rem', position: 'static' }}>
          <span>{error}</span>
        </div>
      )}

      {/* Items Grid / Loading / Empty State */}
      {loading ? (
        <div className="loading-box">
          <div className="spinner"></div>
          <p>Loading items...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="empty-box">
          <h3>No items found</h3>
          <p>Try adjusting your search filters or report a new item.</p>
        </div>
      ) : (
        <div className="items-grid">
          {items.map((item) => (
            <ItemCard key={item._id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
