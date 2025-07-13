const sharp = require('sharp');

const runPrediction = async (buffer, originalName) => {
  try {
    // Simulate prediction time (e.g., ML model delay)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Optimize image and convert to base64
    const optimizedBuffer = await sharp(buffer).jpeg().toBuffer();
    const imageBase64 = optimizedBuffer.toString('base64');

    // Dummy prediction logic (replace with real model logic)
    const random = Math.random();
    const result =
      random < 0.33
        ? 'Normal Retina'
        : random < 0.66
        ? 'Diabetic Retinopathy Detected'
        : 'Macular Degeneration Suspected';

    return {
      result,
      filename: originalName,
      imageBase64,
    };
  } catch (err) {
    console.error('❌ Prediction error:', err.message);
    throw new Error('Failed to process and predict image');
  }
};

module.exports = { runPrediction };
