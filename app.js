const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/authRoutes');
const predictRoutes = require('./routes/predictRoutes');

const app = express();

// ✅ CORS setup for frontend on Vercel
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'https://retina-detect-frontend.vercel.app/predict',
  credentials: true,
}));

// ✅ Middleware
app.use(express.json({ limit: '10mb' })); // Accept base64 payloads
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/predict', predictRoutes);

// ✅ Root
app.get('/', (req, res) => {
  res.send('✅ RetinaDetect backend is running');
});

// ❌ Fallback 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Endpoint not found' });
});

// ✅ Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Global Error:', err.stack);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

module.exports = app;
