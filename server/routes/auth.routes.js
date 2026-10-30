const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth');

// Register user
router.post('/register', registerUser);

// Login user
router.post('/login', loginUser);

// Get current user profile (requires token)
router.get('/me', protect, getMe);

module.exports = router;
