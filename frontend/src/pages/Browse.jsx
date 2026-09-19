import { Link } from 'react-router-dom';
import { FaArrowRight, FaFilm } from 'react-icons/fa';

import HeroSlider from '../components/HeroSlider';
import MovieCard from '../components/MovieCard';
import { useGetMoviesQuery } from '../redux/moviesApiSlice';

function Home() {
  const {
    data: movies = [],
    isLoading,
    isError,
  } = useGetMoviesQuery();

  const genres = [
    ...new Set(
      movies
        .map((movie) => movie.genre)
        .filter(Boolean),
    ),
  ].slice(0, 8);

  const popularMovies = [...movies]
    .sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0))
    .slice(0, 8);

  return (
    <div>
      <HeroSlider movies={movies} />

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-purple-400">
              Explore
            </p>

            <h2 className="mt-1 text-3xl font-bold">
              Browse by genre
            </h2>
          </div>

          <Link
            to="/browse"
            className="hidden items-center gap-2 text-purple-400 hover:text-purple-300 sm:flex"
          >
            All movies
            <FaArrowRight />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {genres.map((genre) => (
            <Link
              key={genre}
              to={`/browse?genre=${encodeURIComponent(genre)}`}
              className="movie-gradient rounded-xl border border-white/10 p-6 text-center font-semibold transition hover:border-purple-500 hover:text-purple-300"
            >
              <FaFilm className="mx-auto mb-3 text-2xl text-purple-400" />
              {genre}
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <p className="text-sm uppercase tracking-widest text-purple-400">
              Popular
            </p>
            <h2 className="text-3xl font-bold">
              Top rated movies
            </h2>
          </div>

          <Link
            to="/browse"
            className="flex items-center gap-2 text-purple-400"
          >
            Browse all
            <FaArrowRight />
          </Link>
        </div>

        {isLoading && (
          <p className="text-gray-400">Loading movies...</p>
        )}

        {isError && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-5 text-red-300">
            Could not connect to the movie API. Make sure your backend is running on port 5000.
          </div>
        )}

        {!isLoading && !isError && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {popularMovies.map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Home;