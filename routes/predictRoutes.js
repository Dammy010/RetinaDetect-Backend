const express = require('express');
const multer = require('../config/multerConfig');
const { predictDisease, getUserPredictions } = require('../controllers/predictController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, multer.single('image'), predictDisease);
router.get('/history', protect, getUserPredictions); // new route

module.exports = router;
