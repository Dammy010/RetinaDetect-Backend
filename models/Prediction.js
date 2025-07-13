const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  result: { type: String, required: true },
  image: { type: String, required: true }, 
}, { timestamps: true });

module.exports = mongoose.model('Prediction', predictionSchema);
