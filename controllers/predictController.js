const Prediction = require('../models/Prediction');
const { runPrediction } = require('../services/predictService');

// POST /api/predict
exports.predictDisease = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file uploaded' });
    }

    const { buffer, originalname, mimetype = 'image/jpeg' } = req.file;

    const { result, imageBase64 } = await runPrediction(buffer, originalname);
    const imageDataUri = `data:${mimetype};base64,${imageBase64}`;

    const prediction = await Prediction.create({
      user: req.user._id,
      result,
      image: imageDataUri,
    });

    res.status(200).json({
      success: true,
      message: 'Prediction successful',
      result,
      image: imageDataUri,
      predictionId: prediction._id,
    });
  } catch (error) {
    console.error('❌ Prediction Error:', error);
    res.status(500).json({
      success: false,
      message: 'Prediction failed',
      error: error.message || 'Server error',
    });
  }
};

// GET /api/predict/history
exports.getUserPredictions = async (req, res) => {
  try {
    const predictions = await Prediction.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Fetched prediction history successfully',
      count: predictions.length,
      predictions,
    });
  } catch (error) {
    console.error('❌ Fetch History Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch prediction history',
      error: error.message || 'Server error',
    });
  }
};
