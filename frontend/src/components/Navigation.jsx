import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  FaBars,
  FaFilm,
  FaTimes,
  FaUser,
  FaUserShield,
} from 'react-icons/fa';

import SurpriseMeButton from './SurpriseMeButton';
import { useGetMoviesQuery } from '../redux/moviesApiSlice';

function Navigation() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  // Fetch movies to pass to SurpriseMeButton
  const { data: movies = [] } = useGetMoviesQuery();

  const user = JSON.parse(localStorage.getItem('what2watchUser') || 'null');

  const logout = () => {
    localStorage.removeItem('what2watchUser');
    setOpen(false);
    navigate('/');
  };

  const navClass = ({ isActive }) =>
    `transition ${
      isActive
        ? 'text-purple-400'
        : 'text-gray-300 hover:text-white'
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-cinema-950/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <Link
          to="/"
          className="flex items-center gap-2 text-xl font-bold"
          onClick={() => setOpen(false)}
        >
          <FaFilm className="text-purple-500" />
          <span>what2watch</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          <NavLink to="/" className={navClass}>
            Home
          </NavLink>

          <NavLink to="/browse" className={navClass}>
            Browse
          </NavLink>

          <NavLink to="/admin" className={navClass}>
            <span className="flex items-center gap-2">
              <FaUserShield />
              Admin
            </span>
          </NavLink>

          {/* Surprise Me Button */}
          <SurpriseMeButton movies={movies} />

          {user ? (
            <button
              onClick={logout}
              className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-gray-200 hover:bg-white/20"
            >
              <FaUser />
              Logout
            </button>
          ) : (
            <NavLink
              to="/login"
              className="rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
            >
              Login / Register
            </NavLink>
          )}
        </nav>

        {/* Mobile Toggle Button */}
        <button
          className="text-xl md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle navigation"
        >
          {open ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {open && (
        <nav className="border-t border-white/10 px-4 pb-4 md:hidden">
          <div className="flex flex-col gap-3 pt-4">
            <NavLink
              to="/"
              className={navClass}
              onClick={() => setOpen(false)}
            >
              Home
            </NavLink>

            <NavLink
              to="/browse"
              className={navClass}
              onClick={() => setOpen(false)}
            >
              Browse
            </NavLink>

            <NavLink
              to="/admin"
              className={navClass}
              onClick={() => setOpen(false)}
            >
              Admin Dashboard
            </NavLink>

            {/* Mobile Surprise Me Button */}
            <div className="py-1">
              <SurpriseMeButton movies={movies} />
            </div>

            {user ? (
              <button
                onClick={logout}
                className="rounded-lg bg-white/10 px-4 py-2 text-left"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="rounded-lg bg-purple-600 px-4 py-2 text-center"
              >
                Login / Register
              </Link>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}

export default Navigation;