const express = require('express');
const { predictDisease, getUserPredictions, deletePredictionById } = require('../controllers/predictController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, predictDisease); 
router.get('/history', protect, getUserPredictions);
router.delete('/:id', protect, deletePredictionById); 

module.exports = router;
