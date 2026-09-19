import SliderPackage from 'react-slick';
const Slider = SliderPackage.default || SliderPackage;
import { Link } from 'react-router-dom';
import { FaPlay, FaStar } from 'react-icons/fa';

function HeroSlider({ movies = [] }) {
  const featured = [...movies]
    .sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0))
    .slice(0, 5);

  if (!featured.length) {
    return (
      <section className="movie-gradient flex min-h-[420px] items-center justify-center px-6">
        <div className="text-center">
          <p className="mb-2 text-purple-400">what2watch</p>
          <h1 className="text-4xl font-black sm:text-6xl">
            Find your next movie
          </h1>
          <p className="mt-4 text-gray-400">
            Start the backend and add some movies to MongoDB.
          </p>
        </div>
      </section>
    );
  }

  const settings = {
    dots: true,
    infinite: featured.length > 1,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4500,
    arrows: false,
  };

  return (
    <section className="overflow-hidden">
      <Slider {...settings}>
        {featured.map((movie) => (
          <div key={movie._id}>
            <div className="movie-gradient relative flex min-h-[500px] items-center">
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/75 to-transparent" />

              <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-20">
                <div className="max-w-2xl">
                  <p className="mb-3 font-semibold uppercase tracking-[0.25em] text-purple-400">
                    Featured Movie
                  </p>

                  <h1 className="text-4xl font-black leading-tight sm:text-6xl">
                    {movie.title}
                  </h1>

                  <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-gray-300">
                    <span>{movie.year}</span>
                    <span>{movie.genre}</span>
                    <span className="flex items-center gap-1 text-yellow-400">
                      <FaStar />
                      {Number(movie.rating || 0).toFixed(1)}
                    </span>
                  </div>

                  <p className="mt-5 line-clamp-2 max-w-xl text-gray-300">
                    {movie.description ||
                      'Discover details, ratings and information about this movie.'}
                  </p>

                  <Link
                    to={`/movies/${movie._id}`}
                    className="mt-8 inline-flex items-center gap-2 rounded-lg bg-purple-600 px-6 py-3 font-semibold hover:bg-purple-700"
                  >
                    <FaPlay />
                    View Movie
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </section>
  );
}

export default HeroSlider;