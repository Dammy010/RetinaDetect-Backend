const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const predictRoutes = require('./routes/predictRoutes');

const app = express();

const uploadsDir = path.resolve('uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('📁 uploads/ folder created.');
}

app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/uploads', express.static(uploadsDir));

app.use('/api/auth', authRoutes);
app.use('/api/predict', predictRoutes);

app.get('/', (req, res) => {
  res.send('✅ RetinaDetect backend is running');
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Endpoint not found' });
});


app.use((err, req, res, next) => {
  console.error('❌ Global Error:', err.stack);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

module.exports = app;
