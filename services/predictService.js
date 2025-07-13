const sharp = require('sharp');
const path = require('path');

const runPrediction = async (buffer, originalName) => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const optimizedBuffer = await sharp(buffer).jpeg().toBuffer();
    const imageBase64 = optimizedBuffer.toString('base64');

    const random = Math.random();
    let result;
    if (random < 0.33) result = 'Normal Retina';
    else if (random < 0.66) result = 'Diabetic Retinopathy Detected';
    else result = 'Macular Degeneration Suspected';

    return {
      result,
      filename: originalName,
      imageBase64,
    };
  } catch (err) {
    throw new Error('Failed to process and predict image');
  }
};

module.exports = { runPrediction };
