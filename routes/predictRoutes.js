const express = require('express');
const multer = require('../config/multerConfig');
const { predictDisease } = require('../controllers/predictController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, multer.single('image'), predictDisease);

module.exports = router;
