const path = require('path');
const { runPrediction } = require('../services/predictService');

exports.predictDisease = async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const imagePath = req.file.path;

    const { result, filename } = await runPrediction(imagePath);

    res.status(200).json({
      success: true,
      message: 'Prediction successful',
      result,
      image: `${req.protocol}://${req.get('host')}/uploads/${filename}`
    });
  } catch (err) {
    console.error('❌ Prediction Error:', err.message);
    res.status(500).json({
      success: false,
      message: 'Prediction failed',
      error: err.message,
    });
  }
};
