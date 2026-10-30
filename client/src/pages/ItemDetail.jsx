import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth, API_BASE_URL } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const ItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const { showToast } = useToast();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch item details
  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/items/${id}`);
        if (!res.ok) {
          throw new Error('Item not found');
        }
        const data = await res.json();
        setItem(data);
      } catch (err) {
        showToast(err.message || 'Error loading item', 'error');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id, navigate, showToast]);

  // Check if current user is the owner
  const isOwner =
    user &&
    item &&
    item.createdBy &&
    (item.createdBy._id === user.id || item.createdBy === user.id);

  // Toggle Claimed status
  const handleToggleClaim = async () => {
    setActionLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/items/${id}/claim`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const updated = await res.json();
      if (!res.ok) {
        throw new Error(updated.message || 'Failed to update status');
      }

      setItem(updated);
      showToast(
        `Item marked as ${updated.status === 'Claimed' ? 'Claimed/Resolved' : 'Open'}!`,
        'success'
      );
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Delete Item
  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      'Are you sure you want to permanently delete this report?'
    );
    if (!confirmDelete) return;

    setActionLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/items/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to delete item');
      }

      showToast('Item report deleted successfully', 'success');
      navigate('/');
    } catch (err) {
      showToast(err.message, 'error');
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-box">
        <div className="spinner"></div>
        <p>Loading item details...</p>
      </div>
    );
  }

  if (!item) return null;

  const formattedDate = new Date(item.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div>
      <div style={{ marginBottom: '1.25rem' }}>
        <Link to="/" className="btn btn-outline btn-sm">
          ← Back to Items
        </Link>
      </div>

      <div className="detail-container">
        <div className="detail-grid">
          {/* Image */}
          <div className="detail-image-box">
            {item.imageUrl ? (
              <img src={item.imageUrl} alt={item.title} className="detail-image" />
            ) : (
              <div style={{ fontSize: '5rem', color: '#94a3b8' }}>📦</div>
            )}
          </div>

          {/* Details */}
          <div className="detail-info">
            <div className="detail-badges">
              <span className={`badge badge-${item.type.toLowerCase()}`}>
                {item.type}
              </span>
              <span className={`badge ${item.status === 'Claimed' ? 'badge-claimed' : 'badge-found'}`}>
                Status: {item.status}
              </span>
              <span className="badge-category">{item.category}</span>
            </div>

            <h1 className="detail-title">{item.title}</h1>

            <div className="item-card-meta" style={{ fontSize: '0.95rem' }}>
              <span>📍 <strong>Location:</strong> {item.location}</span>
              <span>📅 <strong>Date:</strong> {formattedDate}</span>
              {item.createdBy?.name && (
                <span>👤 <strong>Reported by:</strong> {item.createdBy.name}</span>
              )}
            </div>

            <div>
              <h3 style={{ fontSize: '1.05rem', marginBottom: '0.4rem' }}>Description</h3>
              <p className="detail-description">{item.description}</p>
            </div>

            {/* Contact Box */}
            <div className="detail-contact-box">
              <h4>📞 Contact & Recovery Information</h4>
              <p><strong>Name:</strong> {item.contactName}</p>
              <p>
                <strong>Phone / Email:</strong>{' '}
                <a href={`mailto:${item.contactInfo}`} style={{ color: '#2563eb', textDecoration: 'underline' }}>
                  {item.contactInfo}
                </a>
              </p>
            </div>

            {/* Actions for Item Owner */}
            {isOwner && (
              <div className="detail-actions">
                <button
                  onClick={handleToggleClaim}
                  disabled={actionLoading}
                  className={`btn ${item.status === 'Open' ? 'btn-success' : 'btn-outline'}`}
                >
                  {item.status === 'Open' ? '✓ Mark as Claimed/Returned' : '↺ Reopen Item'}
                </button>

                <Link to={`/edit/${item._id}`} className="btn btn-outline">
                  ✏️ Edit
                </Link>

                <button
                  onClick={handleDelete}
                  disabled={actionLoading}
                  className="btn btn-danger"
                >
                  🗑️ Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;
