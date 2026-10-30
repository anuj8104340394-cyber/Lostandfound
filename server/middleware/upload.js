const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

// Check if valid Cloudinary credentials are provided
const isCloudinaryConfigured = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloudinary_cloud_name' &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_KEY !== 'your_cloudinary_api_key'
);

let storage;

if (isCloudinaryConfigured) {
  // Production / Cloud storage with automatic optimization
  storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'campus-lost-found',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      // Image optimization transformations:
      // 1. auto resize down to max 800x800 bounding box
      // 2. auto compression quality
      // 3. auto modern format conversion (e.g. WebP / AVIF based on browser)
      transformation: [
        { width: 800, height: 800, crop: 'limit' },
        { quality: 'auto' },
        { fetch_format: 'auto' }
      ]
    }
  });
} else {
  // Development / Local storage fallback: writes to server/uploads/
  const uploadDir = path.join(__dirname, '../uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    }
  });
}

// File filter: accept images only
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type! Only JPG, JPEG, PNG, and WEBP images are allowed.'), false);
  }
};

// Multer upload middleware (5MB limit)
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 MB maximum file size
  },
  fileFilter: fileFilter
});

module.exports = upload;
