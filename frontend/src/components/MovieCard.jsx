import { Link } from 'react-router-dom';
import { FaStar, FaClock } from 'react-icons/fa';

function MovieCard({ movie }) {
  return (
    <Link
      to={`/movies/${movie._id}`}
      className="group overflow-hidden rounded-2xl border border-white/10 bg-cinema-900 transition hover:-translate-y-1 hover:border-purple-500/50"
    >
      <div className="movie-gradient relative flex aspect-[2/3] items-end overflow-hidden p-4">
                <img 
          src=src={movie.posterUrl || 'https://via.placeholder.com/300x450?text=No+Poster'} 
          alt={movie.title} 
          className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-110" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

        <div className="relative z-10 w-full">
          <div className="mb-2 flex flex-wrap gap-2">
            <span className="rounded-full bg-purple-600/90 px-2 py-1 text-xs">
              {movie.genre}
            </span>

            {movie.status && (
              <span className="rounded-full bg-black/60 px-2 py-1 text-xs">
                {movie.status}
              </span>
            )}
          </div>

          <h3 className="line-clamp-2 text-lg font-bold text-white">
            {movie.title}
          </h3>
        </div>
      </div>

      <div className="space-y-2 p-4">
        <div className="flex items-center justify-between text-sm text-gray-400">
          <span>{movie.year}</span>

          <span className="flex items-center gap-1 text-yellow-400">
            <FaStar />
            {Number(movie.rating || 0).toFixed(1)}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-400">
          <FaClock />
          {movie.duration ? `${movie.duration} min` : 'Duration N/A'}
        </div>
      </div>
    </Link>
  );
}

export default MovieCard;