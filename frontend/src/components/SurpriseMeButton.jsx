import { useNavigate } from 'react-router-dom';
import { FaDice } from 'react-icons/fa';

function SurpriseMeButton({ movies = [] }) {
  const navigate = useNavigate();

  const handlePickRandom = () => {
    if (!movies || movies.length === 0) return;
    
    // Pick a random index from the movies array
    const randomIndex = Math.floor(Math.random() * movies.length);
    const randomMovie = movies[randomIndex];
    
    // Redirect to the detail route for that movie
    navigate(`/movies/${randomMovie._id}`);
  };

  return (
    <button
      onClick={handlePickRandom}
      className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-5 py-2.5 font-bold text-white shadow-lg transition-transform hover:scale-105"
    >
      <FaDice className="text-lg" />
      Surprise Me!
    </button>
  );
}

export default SurpriseMeButton;