import { useSearchParams, Link } from 'react-router-dom';
import { useGetMoviesQuery } from '../redux/moviesApiSlice';

const GENRES = ['All', 'Action', 'Sci-Fi', 'Horror', 'Comedy', 'Drama', 'Fantasy', 'Thriller', 'Crime'];

function Browse() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeGenre = searchParams.get('genre') || 'All';

  // Fetch movies from RTK Query endpoint
  const { data: movies = [], isLoading, isError } = useGetMoviesQuery();

  // Filter movies array by active genre selection
  const filteredMovies = activeGenre === 'All'
    ? movies
    : movies.filter(
        (m) => m.genre?.toLowerCase() === activeGenre.toLowerCase()
      );

  if (isLoading) {
    return <div className="p-10 text-center text-white">Loading movie catalog...</div>;
  }

  if (isError) {
    return <div className="p-10 text-center text-red-500">Could not connect to the backend server.</div>;
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 text-white">
      <h1 className="mb-2 text-4xl font-black">Browse Movies</h1>
      <p className="mb-8 text-gray-400">Filter through our collection by category.</p>

      {/* Genre Filter Buttons */}
      <div className="mb-10 flex flex-wrap gap-3">
        {GENRES.map((genreName) => (
          <button
            key={genreName}
            onClick={() => setSearchParams(genreName === 'All' ? {} : { genre: genreName })}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${
              activeGenre.toLowerCase() === genreName.toLowerCase()
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {genreName}
          </button>
        ))}
      </div>

      {/* Movie Grid */}
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {filteredMovies.map((movie) => (
          <Link
            key={movie._id}
            to={`/movies/${movie._id}`}
            className="group flex flex-col overflow-hidden rounded-xl bg-gray-900 border border-gray-800 transition-transform hover:-translate-y-1"
          >
            <img
              src={movie.posterUrl || 'https://via.placeholder.com/300x450?text=No+Poster+Available'}
              alt={movie.title}
              className="h-72 w-full object-cover transition-opacity group-hover:opacity-80"
            />
            <div className="flex flex-1 flex-col justify-between p-4">
              <h3 className="font-bold text-white truncate">{movie.title}</h3>
              <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
                <span>{movie.genre}</span>
                <span className="text-yellow-400">★ {Number(movie.rating || 0).toFixed(1)}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredMovies.length === 0 && (
        <p className="mt-8 text-center text-gray-500">No movies found for the selected genre.</p>
      )}
    </div>
  );
}

export default Browse;