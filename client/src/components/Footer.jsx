import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} Campus Lost & Found Web Portal. All rights reserved.</p>
      <div className="footer-cloud-badges">
        <span className="cloud-badge">☁️ Azure VM (IaaS)</span>
        <span className="cloud-badge">🚀 Render (PaaS)</span>
        <span className="cloud-badge">🍃 MongoDB Atlas (DBaaS)</span>
        <span className="cloud-badge">🖼️ Cloudinary (Storage aaS)</span>
        <span className="cloud-badge">🛡️ Cloudflare (Security aaS)</span>
      </div>
    </footer>
  );
};

export default Footer;
