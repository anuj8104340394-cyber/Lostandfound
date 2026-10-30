const express = require('express');
const router = express.Router();
const {
  getItems,
  getItemById,
  createItem,
  updateItem,
  claimItem,
  deleteItem
} = require('../controllers/item.controller');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Wrapper middleware to catch Multer file validation errors cleanly
const handleUpload = (req, res, next) => {
  const uploadSingle = upload.single('image');

  uploadSingle(req, res, (err) => {
    if (err) {
      // Handle file size or file type errors
      return res.status(400).json({ message: err.message || 'File upload error' });
    }
    next();
  });
};

// Public Routes
router.get('/', getItems);
router.get('/:id', getItemById);

// Protected Routes (Requires login)
router.post('/', protect, handleUpload, createItem);
router.put('/:id', protect, handleUpload, updateItem);
router.patch('/:id/claim', protect, claimItem);
router.delete('/:id', protect, deleteItem);

module.exports = router;
