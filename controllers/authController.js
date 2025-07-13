const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT
const createToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Set cookie options
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production', // only true in production
  sameSite: 'None', // needed for cross-origin (Vercel -> Vercel)
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    const token = createToken(user._id);
    res.cookie('token', token, cookieOptions);

    console.log(`✅ User signed up: ${email}`);
    res.status(201).json({
      success: true,
      user: { name: user.name, email: user.email },
    });
  } catch (err) {
    console.error('❌ Signup error:', err);
    res.status(500).json({ success: false, message: 'Signup failed', error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    const token = createToken(user._id);
    res.cookie('token', token, cookieOptions);

    console.log(`✅ User logged in: ${email}`);
    res.status(200).json({
      success: true,
      user: { name: user.name, email: user.email },
    });
  } catch (err) {
    console.error('❌ Login error:', err);
    res.status(500).json({ success: false, message: 'Login failed', error: err.message });
  }
};

const logout = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'None',
  });
  console.log('👋 User logged out');
  res.status(200).json({ success: true, message: 'Logged out successfully' });
};

const getMe = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      user: { name: user.name, email: user.email },
    });
  } catch (err) {
    console.error('❌ GetMe error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch user', error: err.message });
  }
};

module.exports = {
  signup,
  login,
  logout,
  getMe,
};
