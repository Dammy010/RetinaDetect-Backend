const express = require('express');
const { predictDisease, getUserPredictions, deletePredictionById } = require('../controllers/predictController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, predictDisease); // ✅ Now accepts base64 in JSON
router.get('/history', protect, getUserPredictions);
router.delete('/:id', protect, deletePredictionById); // ✅ Allow delete by ID

module.exports = router;
