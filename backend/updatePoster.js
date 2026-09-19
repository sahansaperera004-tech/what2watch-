const mongoose = require('mongoose');
const Movie = require('./models/Movie');
require('dotenv').config();

// Replace with your TMDB API Key
const TMDB_API_KEY = 'e6aeb0146b1062171954663a43fa29eb'; 
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

async function updateMoviePosters() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/what2watch');
    console.log('Connected to MongoDB...');

    // Fetch all movies that don't have a custom poster URL yet
    const movies = await Movie.find({});
    console.log(`Found ${movies.length} movies to update.`);

    for (let movie of movies) {
      if (movie.posterUrl && !movie.posterUrl.includes('placeholder')) {
        continue; // Skip if it already has a real poster
      }

      try {
        // Search TMDB API for the movie title
        const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(movie.title)}`;
        const response = await fetch(searchUrl);
        const data = await response.json();

        if (data.results && data.results.length > 0 && data.results[0].poster_path) {
          const posterUrl = `${TMDB_IMAGE_BASE}${data.results[0].poster_path}`;
          movie.posterUrl = posterUrl;
          await movie.save();
          console.log(`Updated poster for: ${movie.title}`);
        } else {
          console.log(`No poster found for: ${movie.title}`);
        }
      } catch (err) {
        console.error(`Error fetching poster for ${movie.title}:`, err.message);
      }

      // Small delay to respect TMDB API rate limits
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    console.log('Finished updating all movie posters!');
    process.exit(0);
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
}

updateMoviePosters();