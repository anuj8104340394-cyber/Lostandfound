import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth, API_BASE_URL } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const CATEGORIES = ['Phone', 'Wallet', 'ID Card', 'Bag', 'Keys', 'Books', 'Other'];

const EditItem = () => {
  const { id } = useParams();
  const { user, token, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [type, setType] = useState('Lost');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Phone');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Open');
  const [existingImage, setExistingImage] = useState('');
  const [newImageFile, setNewImageFile] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/items/${id}`);
        if (!res.ok) throw new Error('Item not found');
        const data = await res.json();

        // Check ownership
        const ownerId = data.createdBy?._id || data.createdBy;
        if (user && ownerId && ownerId !== user.id) {
          showToast('Unauthorized: You can only edit your own items', 'error');
          navigate('/');
          return;
        }

        setType(data.type);
        setTitle(data.title);
        setCategory(data.category);
        setLocation(data.location);
        setDate(data.date ? new Date(data.date).toISOString().split('T')[0] : '');
        setContactName(data.contactName);
        setContactInfo(data.contactInfo);
        setDescription(data.description);
        setStatus(data.status);
        setExistingImage(data.imageUrl);
      } catch (err) {
        showToast(err.message, 'error');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchItem();
    } else {
      navigate('/login');
    }
  }, [id, isAuthenticated, user, navigate, showToast]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('Image size must be less than 5MB', 'error');
        return;
      }
      setNewImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('type', type);
      formData.append('title', title.trim());
      formData.append('category', category);
      formData.append('location', location.trim());
      formData.append('date', date);
      formData.append('contactName', contactName.trim());
      formData.append('contactInfo', contactInfo.trim());
      formData.append('description', description.trim());
      formData.append('status', status);

      if (newImageFile) {
        formData.append('image', newImageFile);
      }

      const res = await fetch(`${API_BASE_URL}/items/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to update item');
      }

      showToast('Item updated successfully!', 'success');
      navigate(`/items/${id}`);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSubmitting(false);
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

  return (
    <div className="form-container">
      <div className="form-header">
        <h2>Edit Item Report</h2>
        <p>Update information for this item</p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Type & Status */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="edit-type">Type</label>
            <select
              id="edit-type"
              className="form-control"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="Lost">Lost</option>
              <option value="Found">Found</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="edit-status">Status</label>
            <select
              id="edit-status"
              className="form-control"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="Open">Open</option>
              <option value="Claimed">Claimed / Resolved</option>
            </select>
          </div>
        </div>

        {/* Title */}
        <div className="form-group">
          <label htmlFor="edit-title">Title *</label>
          <input
            id="edit-title"
            type="text"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Category & Date */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="edit-category">Category *</label>
            <select
              id="edit-category"
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

          <div className="form-group">
            <label htmlFor="edit-date">Date *</label>
            <input
              id="edit-date"
              type="date"
              className="form-control"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Location */}
        <div className="form-group">
          <label htmlFor="edit-location">Location *</label>
          <input
            id="edit-location"
            type="text"
            className="form-control"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>

        {/* Description */}
        <div className="form-group">
          <label htmlFor="edit-desc">Description *</label>
          <textarea
            id="edit-desc"
            rows="3"
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>

        {/* Contact info */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="edit-cname">Contact Name *</label>
            <input
              id="edit-cname"
              type="text"
              className="form-control"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="edit-cinfo">Contact Info *</label>
            <input
              id="edit-cinfo"
              type="text"
              className="form-control"
              value={contactInfo}
              onChange={(e) => setContactInfo(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Replace Image */}
        <div className="form-group">
          <label htmlFor="edit-img">Change Photo (optional)</label>
          <input
            id="edit-img"
            type="file"
            accept="image/*"
            className="form-control"
            onChange={handleImageChange}
          />
          {preview ? (
            <img src={preview} alt="New Preview" className="image-preview" />
          ) : (
            existingImage && (
              <img src={existingImage} alt="Current" className="image-preview" />
            )
          )}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="btn btn-primary"
          style={{ width: '100%', marginTop: '1rem', padding: '0.75rem' }}
        >
          {submitting ? 'Saving Changes...' : 'Update Item'}
        </button>
      </form>
    </div>
  );
};

export default EditItem;
