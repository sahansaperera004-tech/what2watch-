import { useState } from 'react';
import { toast } from 'react-toastify';
import {
  FaEdit,
  FaPlus,
  FaTrash,
  FaTimes,
} from 'react-icons/fa';

import {
  useCreateMovieMutation,
  useDeleteMovieMutation,
  useGetMoviesQuery,
  useUpdateMovieMutation,
} from '../redux/moviesApiSlice';

const emptyMovie = {
  title: '',
  genre: '',
  year: new Date().getFullYear(),
  rating: '',
  duration: '',
  director: '',
  status: 'Watchlist',
  language: 'English',
  description: '',
};

function AdminDashboard() {
  const {
    data: movies = [],
    isLoading,
    isError,
  } = useGetMoviesQuery();

  const [createMovie, { isLoading: creating }] =
    useCreateMovieMutation();

  const [updateMovie, { isLoading: updating }] =
    useUpdateMovieMutation();

  const [deleteMovie, { isLoading: deleting }] =
    useDeleteMovieMutation();

  const [form, setForm] = useState(emptyMovie);
  const [editingId, setEditingId] = useState(null);

  const editing = Boolean(editingId);

  const changeField = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setForm(emptyMovie);
    setEditingId(null);
  };

  const submit = async (event) => {
    event.preventDefault();

    const payload = {
      ...form,
      year: Number(form.year),
      rating:
        form.rating === '' ? undefined : Number(form.rating),
      duration:
        form.duration === ''
          ? undefined
          : Number(form.duration),
    };

    try {
      if (editing) {
        await updateMovie({
          id: editingId,
          ...payload,
        }).unwrap();

        toast.success('Movie updated.');
      } else {
        await createMovie(payload).unwrap();

        toast.success('Movie created.');
      }

      resetForm();
    } catch (error) {
      toast.error(
        error?.data?.message || 'Movie operation failed.',
      );
    }
  };

  const startEdit = (movie) => {
    setEditingId(movie._id);

    setForm({
      title: movie.title || '',
      genre: movie.genre || '',
      year: movie.year || '',
      rating: movie.rating ?? '',
      duration: movie.duration ?? '',
      director: movie.director || '',
      status: movie.status || 'Watchlist',
      language: movie.language || '',
      description: movie.description || '',
    });

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const removeMovie = async (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this movie?',
    );

    if (!confirmed) return;

    try {
      await deleteMovie(id).unwrap();
      toast.success('Movie deleted.');

      if (editingId === id) {
        resetForm();
      }
    } catch (error) {
      toast.error(
        error?.data?.message || 'Could not delete movie.',
      );
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-purple-400">
          Administration
        </p>

        <h1 className="mt-2 text-4xl font-black">
          Movie Dashboard
        </h1>

        <p className="mt-2 text-gray-400">
          Create, edit and delete movies from MongoDB.
        </p>
      </div>

      <section className="mb-10 rounded-2xl border border-white/10 bg-cinema-900 p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            {editing ? 'Edit movie' : 'Add movie'}
          </h2>

          {editing && (
            <button
              onClick={resetForm}
              className="flex items-center gap-2 text-gray-400 hover:text-white"
            >
              <FaTimes />
              Cancel
            </button>
          )}
        </div>

        <form
          onSubmit={submit}
          className="grid gap-5 md:grid-cols-2"
        >
          <Field
            label="Title"
            name="title"
            value={form.title}
            onChange={changeField}
            required
          />

          <Field
            label="Genre"
            name="genre"
            value={form.genre}
            onChange={changeField}
            required
          />

          <Field
            label="Year"
            name="year"
            type="number"
            value={form.year}
            onChange={changeField}
            required
          />

          <Field
            label="Rating"
            name="rating"
            type="number"
            min="0"
            max="10"
            step="0.1"
            value={form.rating}
            onChange={changeField}
          />

          <Field
            label="Duration (minutes)"
            name="duration"
            type="number"
            value={form.duration}
            onChange={changeField}
          />

          <Field
            label="Director"
            name="director"
            value={form.director}
            onChange={changeField}
          />

          <Field
            label="Language"
            name="language"
            value={form.language}
            onChange={changeField}
          />

          <label className="block">
            <span className="mb-2 block text-sm text-gray-400">
              Status
            </span>

            <select
              name="status"
              value={form.status}
              onChange={changeField}
              className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-3 text-white"
            >
              <option value="Watchlist">Watchlist</option>
              <option value="Watched">Watched</option>
              <option value="Currently Watching">
                Currently Watching
              </option>
            </select>
          </label>

          <label className="block md:col-span-2">
            <span className="mb-2 block text-sm text-gray-400">
              Description
            </span>

            <textarea
              name="description"
              value={form.description}
              onChange={changeField}
              rows="4"
              className="w-full rounded-lg border border-white/10 bg-black/30 p-3 text-white"
            />
          </label>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={creating || updating}
              className="flex items-center gap-2 rounded-lg bg-purple-600 px-6 py-3 font-semibold hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {editing ? <FaEdit /> : <FaPlus />}

              {creating || updating
                ? 'Saving...'
                : editing
                  ? 'Update Movie'
                  : 'Create Movie'}
            </button>
          </div>
        </form>
      </section>

      <section>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            Movie collection
          </h2>

          <span className="text-gray-400">
            {movies.length} movies
          </span>
        </div>

        {isLoading && (
          <p className="text-gray-400">
            Loading movies...
          </p>
        )}

        {isError && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-5 text-red-300">
            Could not connect to the backend.
          </div>
        )}

        {!isLoading && !isError && (
          <div className="overflow-x-auto rounded-2xl border border-white/10">
            <table className="min-w-full divide-y divide-white/10">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-4 py-4 text-left text-sm text-gray-400">
                    Title
                  </th>

                  <th className="px-4 py-4 text-left text-sm text-gray-400">
                    Genre
                  </th>

                  <th className="px-4 py-4 text-left text-sm text-gray-400">
                    Year
                  </th>

                  <th className="px-4 py-4 text-left text-sm text-gray-400">
                    Rating
                  </th>

                  <th className="px-4 py-4 text-right text-sm text-gray-400">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/10">
                {movies.map((movie) => (
                  <tr key={movie._id}>
                    <td className="px-4 py-4 font-semibold">
                      {movie.title}
                    </td>

                    <td className="px-4 py-4 text-gray-400">
                      {movie.genre}
                    </td>

                    <td className="px-4 py-4 text-gray-400">
                      {movie.year}
                    </td>

                    <td className="px-4 py-4 text-yellow-400">
                      {movie.rating ?? 'N/A'}
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => startEdit(movie)}
                          className="rounded-lg bg-blue-500/10 p-3 text-blue-400 hover:bg-blue-500/20"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>

                        <button
                          onClick={() =>
                            removeMovie(movie._id)
                          }
                          disabled={deleting}
                          className="rounded-lg bg-red-500/10 p-3 text-red-400 hover:bg-red-500/20"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function Field({
  label,
  name,
  type = 'text',
  value,
  onChange,
  required = false,
  min,
  max,
  step,
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm text-gray-400">
        {label}
      </span>

      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        min={min}
        max={max}
        step={step}
        className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-3 text-white outline-none focus:border-purple-500"
      />
    </label>
  );
}

export default AdminDashboard;