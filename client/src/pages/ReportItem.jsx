import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth, API_BASE_URL } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const CATEGORIES = ['Phone', 'Wallet', 'ID Card', 'Bag', 'Keys', 'Books', 'Other'];

const ReportItem = () => {
  const { user, token, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Form states
  const [type, setType] = useState('Lost');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Phone');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [contactName, setContactName] = useState(user?.name || '');
  const [contactInfo, setContactInfo] = useState(user?.email || '');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('Image size must be less than 5MB', 'error');
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      showToast('Please log in before reporting an item.', 'error');
      navigate('/login');
      return;
    }

    if (!title.trim() || !location.trim() || !contactName.trim() || !contactInfo.trim()) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }

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

      if (imageFile) {
        formData.append('image', imageFile);
      }

      const res = await fetch(`${API_BASE_URL}/items`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to submit report');
      }

      showToast(`Item reported successfully!`, 'success');
      navigate(`/items/${data._id}`);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="form-container" style={{ textAlign: 'center' }}>
        <h2>Authentication Required</h2>
        <p style={{ margin: '1rem 0' }}>
          You must be logged in to report a lost or found item. This ensures only you can edit
          or mark your item as claimed.
        </p>
        <Link to="/login" className="btn btn-primary">
          Log In / Register
        </Link>
      </div>
    );
  }

  return (
    <div className="form-container">
      <div className="form-header">
        <h2>Report an Item</h2>
        <p>Post details to help recover or return campus property</p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Item Type: Lost vs Found */}
        <div className="form-group">
          <label>Item Type *</label>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
              <input
                type="radio"
                name="type"
                value="Lost"
                checked={type === 'Lost'}
                onChange={(e) => setType(e.target.value)}
              />
              <span className="badge badge-lost">Lost Something</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
              <input
                type="radio"
                name="type"
                value="Found"
                checked={type === 'Found'}
                onChange={(e) => setType(e.target.value)}
              />
              <span className="badge badge-found">Found Something</span>
            </label>
          </div>
        </div>

        {/* Title */}
        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input
            id="title"
            type="text"
            className="form-control"
            placeholder="e.g., Blue Hydro Flask with Stickers"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Category & Date */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="category">Category *</label>
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

          <div className="form-group">
            <label htmlFor="date">Date Lost / Found *</label>
            <input
              id="date"
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
          <label htmlFor="location">Campus Location *</label>
          <input
            id="location"
            type="text"
            className="form-control"
            placeholder="e.g., Central Library 2nd Floor, Room 204"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>

        {/* Description */}
        <div className="form-group">
          <label htmlFor="description">Detailed Description *</label>
          <textarea
            id="description"
            rows="3"
            className="form-control"
            placeholder="Include distinctive marks, color, brand, or conditions..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>

        {/* Contact Name & Info */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="contactName">Your Name *</label>
            <input
              id="contactName"
              type="text"
              className="form-control"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="contactInfo">Contact Phone or Email *</label>
            <input
              id="contactInfo"
              type="text"
              className="form-control"
              placeholder="e.g., 555-0199 or student@campus.edu"
              value={contactInfo}
              onChange={(e) => setContactInfo(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Photo Upload */}
        <div className="form-group">
          <label htmlFor="photo">Item Photo (Max 5MB, Cloudinary Upload)</label>
          <input
            id="photo"
            type="file"
            accept="image/*"
            className="form-control"
            onChange={handleImageChange}
          />
          {imagePreview && (
            <img src={imagePreview} alt="Upload preview" className="image-preview" />
          )}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="btn btn-primary"
          style={{ width: '100%', marginTop: '1rem', padding: '0.75rem' }}
        >
          {submitting ? 'Submitting & Uploading Image...' : 'Submit Report'}
        </button>
      </form>
    </div>
  );
};

export default ReportItem;
