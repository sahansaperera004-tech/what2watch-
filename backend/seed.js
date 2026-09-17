require('dotenv').config();
const fs = require('fs');
const csv = require('csv-parser');
const mongoose = require('mongoose');
const Movie = require('./models/Movie');

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

const movies = [];

fs.createReadStream('cinepick_movies.csv')
  .pipe(csv())
  .on('data', (row) => {
    movies.push({
      title: row.Title,
      genre: row.Genre,
      year: Number(row.Year),
      rating: Number(row.Rating),
      duration: Number(row.Duration),
      director: row.Director,
      status: row.Status,
      language: row.Language,
      description: row.Description
    });
  })
  .on('end', async () => {
    try {
      await Movie.deleteMany({}); // clear existing data first
      await Movie.insertMany(movies);
      console.log(`Seeded ${movies.length} movies successfully`);
    } catch (err) {
      console.error('Seed error:', err);
    } finally {
      mongoose.connection.close();
    }
  });