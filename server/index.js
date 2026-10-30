const path = require('path');
// Always load .env relative to server root
require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const connectDB = require('./config/db');
const authRoutes = require('./routes/auth.routes');
const itemRoutes = require('./routes/item.routes');

// Initialize database connection
connectDB();

const app = express();

// 1. Security HTTP Headers (Security as a Service)
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

// 2. CORS configuration (Restricting access to the configured frontend client URL)
const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (origin === clientUrl || clientUrl === '*' || origin.includes('localhost') || origin.includes('127.0.0.1')) {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked request from origin: ${origin}`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// 3. Rate Limiters (Security as a Service)

// General loose rate limiter for items & general browsing (300 requests / 15 mins)
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Too many requests from this IP, please try again after 15 minutes.'
  }
});
app.use('/api', generalLimiter);

// Strict rate limiter for Authentication routes (10 attempts / 15 mins to prevent brute-force attacks)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Too many login/registration attempts from this IP. Please wait 15 minutes before trying again.'
  }
});
app.use('/api/auth', authLimiter);

// 4. Request Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 5. Serve local static uploads directory (fallback when not using Cloudinary)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 6. Health Check Endpoints (Deployment verification & Uptime monitoring)
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.status(200).json({
    status: 'OK',
    uptime: `${Math.floor(process.uptime())}s`,
    timestamp: new Date().toISOString(),
    services: {
      server: 'running',
      database: dbStatus
    },
    environment: process.env.NODE_ENV || 'development'
  });
});

app.get('/', (req, res) => {
  res.json({
    status: 'healthy',
    message: 'Campus Lost and Found API is running successfully',
    healthCheck: '/api/health',
    timestamp: new Date().toISOString()
  });
});

// 7. Application Routes
app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);

// 8. 404 Route Not Found Handler
app.use((req, res, next) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// 9. Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error'
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
