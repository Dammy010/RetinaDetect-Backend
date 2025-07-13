const Prediction = require('../models/Prediction');
const { runPrediction } = require('../services/predictService');

exports.predictDisease = async (req, res) => {
  try {
    const base64Image = req.body.image;

    if (!base64Image || !base64Image.startsWith('data:image')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or missing base64 image',
      });
    }

    const matches = base64Image.match(/^data:(.+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return res.status(400).json({
        success: false,
        message: 'Invalid base64 image format',
      });
    }

    const mimetype = matches[1];
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, 'base64');

    const { result, imageBase64 } = await runPrediction(buffer, `upload.${mimetype.split('/')[1] || 'jpg'}`);
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

exports.getUserPredictions = async (req, res) => {
  try {
    const predictions = await Prediction.find({ user: req.user._id }).sort({ createdAt: -1 });

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

exports.deletePredictionById = async (req, res) => {
  try {
    const prediction = await Prediction.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!prediction) {
      return res.status(404).json({
        success: false,
        message: 'Prediction not found or already deleted',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Prediction deleted successfully',
      deletedId: prediction._id,
    });
  } catch (error) {
    console.error('❌ Delete Prediction Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete prediction',
      error: error.message || 'Server error',
    });
  }
};
