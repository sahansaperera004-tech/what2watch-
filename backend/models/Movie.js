const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  genre: { type: String, required: true },
  year: { type: Number, required: true },
  rating: { type: Number, min: 0, max: 10 },
  duration: { type: Number },
  director: { type: String },
  status: { type: String, enum: ['Watched', 'Watchlist', 'Currently Watching'], default: 'Watchlist' },
  language: { type: String },
  description: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Movie', movieSchema);