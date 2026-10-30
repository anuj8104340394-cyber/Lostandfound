import React from 'react';
import { Link } from 'react-router-dom';

const ItemCard = ({ item }) => {
  // Format date nicely (e.g., Oct 24, 2026)
  const formattedDate = new Date(item.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="item-card">
      <div className="item-image-wrapper">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.title} className="item-image" loading="lazy" />
        ) : (
          <div className="item-no-image">📦</div>
        )}

        <div className="badge-overlay">
          <span className={`badge badge-${item.type.toLowerCase()}`}>
            {item.type}
          </span>
          {item.status === 'Claimed' && (
            <span className="badge badge-claimed">Claimed</span>
          )}
        </div>
      </div>

      <div className="item-card-body">
        <h3 className="item-card-title" title={item.title}>
          {item.title}
        </h3>

        <div className="item-card-meta">
          <span>🏷️ {item.category}</span>
          <span>📍 {item.location}</span>
          <span>📅 {formattedDate}</span>
        </div>

        <div className="item-card-footer">
          <span className="badge-category">{item.category}</span>
          <Link to={`/items/${item._id}`} className="btn btn-outline btn-sm">
            View Details →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
