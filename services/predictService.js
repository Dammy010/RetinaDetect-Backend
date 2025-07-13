const path = require('path');
const fs = require('fs');

const runPrediction = async (imagePath) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const filename = path.basename(imagePath);

    const random = Math.random();
    let result;
    if (random < 0.33) result = 'Normal Retina';
    else if (random < 0.66) result = 'Diabetic Retinopathy Detected';
    else result = 'Macular Degeneration Suspected';

    return { result, filename };
  } catch (err) {
    throw new Error('Failed to predict disease');
  }
};

module.exports = { runPrediction };
