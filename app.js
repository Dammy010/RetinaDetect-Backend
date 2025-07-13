const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/authRoutes');
const predictRoutes = require('./routes/predictRoutes');

const app = express();


app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'https://retina-detect-frontend.vercel.app',
  credentials: true,
}));


app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

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
