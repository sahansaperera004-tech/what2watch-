import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  FaArrowLeft,
  FaClock,
  FaGlobe,
  FaStar,
  FaUserTie,
} from 'react-icons/fa';
import { toast } from 'react-toastify';

import { useGetMovieQuery } from '../redux/moviesApiSlice';

function MovieDetails() {
  const { id } = useParams();

  const {
    data: movie,
    isLoading,
    isError,
  } = useGetMovieQuery(id);

  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');

  const reviewKey = `what2watchReviews-${id}`;

  const reviews = JSON.parse(
    localStorage.getItem(reviewKey) || '[]',
  );

  const submitReview = (event) => {
    event.preventDefault();

    if (!review.trim()) {
      toast.error('Please write a review first.');
      return;
    }

    const updatedReviews = [
      ...reviews,
      {
        id: Date.now(),
        rating,
        text: review.trim(),
        date: new Date().toLocaleDateString(),
      },
    ];

    localStorage.setItem(
      reviewKey,
      JSON.stringify(updatedReviews),
    );

    setReview('');
    setRating(5);

    toast.success('Review saved on this device.');
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-20 text-gray-400">
        Loading movie...
      </div>
    );
  }

  if (isError || !movie) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-6 text-red-300">
          Movie could not be found.
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <Link
        to="/browse"
        className="mb-8 inline-flex items-center gap-2 text-gray-400 hover:text-white"
      >
        <FaArrowLeft />
        Back to Browse
      </Link>

      <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
        {/* Movie Poster Container */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-cinema-900 shadow-2xl">
          <img
            src={movie.posterUrl || 'https://via.placeholder.com/300x450?text=No+Poster+Available'}
            alt={movie.title}
            className="h-full max-h-[480px] w-full object-cover"
          />
          <div className="absolute top-4 left-4">
            <span className="rounded-full bg-purple-600 px-3 py-1 text-xs font-semibold text-white shadow-md">
              {movie.genre}
            </span>
          </div>
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-yellow-500/10 px-3 py-1 text-yellow-400">
              ⭐ {Number(movie.rating || 0).toFixed(1)}
            </span>

            <span className="rounded-full bg-white/10 px-3 py-1">
              {movie.year}
            </span>

            <span className="rounded-full bg-white/10 px-3 py-1">
              {movie.status || 'Watchlist'}
            </span>
          </div>

          <h1 className="mt-6 text-4xl font-black">
            {movie.title}
          </h1>

          <p className="mt-4 leading-7 text-gray-300">
            {movie.description ||
              'No description is available for this movie.'}
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <Metadata
              icon={<FaUserTie />}
              label="Director"
              value={movie.director || 'Unknown'}
            />

            <Metadata
              icon={<FaGlobe />}
              label="Language"
              value={movie.language || 'Unknown'}
            />

            <Metadata
              icon={<FaClock />}
              label="Duration"
              value={
                movie.duration
                  ? `${movie.duration} minutes`
                  : 'Unknown'
              }
            />

            <Metadata
              icon={<FaStar />}
              label="Rating"
              value={`${Number(movie.rating || 0).toFixed(1)} / 10`}
            />
          </div>
        </div>
      </div>

      <section className="mt-12 grid gap-8 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-cinema-900 p-6">
          <h2 className="text-2xl font-bold">
            Write a review
          </h2>

          <form
            onSubmit={submitReview}
            className="mt-5 space-y-4"
          >
            <label className="block">
              <span className="mb-2 block text-sm text-gray-400">
                Rating
              </span>

              <select
                value={rating}
                onChange={(e) =>
                  setRating(Number(e.target.value))
                }
                className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-3 text-white"
              >
                {[1, 2, 3, 4, 5].map((value) => (
                  <option key={value} value={value}>
                    {value} / 5
                  </option>
                ))}
              </select>
            </label>

            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              rows="5"
              placeholder="What did you think?"
              className="w-full rounded-lg border border-white/10 bg-black/30 p-3 text-white outline-none focus:border-purple-500"
            />

            <button
              type="submit"
              className="rounded-lg bg-purple-600 px-5 py-3 font-semibold hover:bg-purple-700"
            >
              Submit Review
            </button>
          </form>
        </div>

        <div>
          <h2 className="text-2xl font-bold">
            Reviews on this device
          </h2>

          <div className="mt-5 space-y-4">
            {reviews.length === 0 && (
              <p className="text-gray-400">
                No reviews yet.
              </p>
            )}

            {reviews.map((item) => (
              <article
                key={item.id}
                className="rounded-xl border border-white/10 bg-cinema-900 p-5"
              >
                <div className="flex justify-between gap-4">
                  <span className="text-yellow-400">
                    {'★'.repeat(item.rating)}
                  </span>

                  <span className="text-xs text-gray-500">
                    {item.date}
                  </span>
                </div>

                <p className="mt-3 text-gray-300">
                  {item.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function Metadata({ icon, label, value }) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-cinema-900 p-4">
      <div className="text-purple-400">{icon}</div>

      <div>
        <p className="text-xs uppercase tracking-wider text-gray-500">
          {label}
        </p>

        <p className="font-semibold">{value}</p>
      </div>
    </div>
  );
}

export default MovieDetails;