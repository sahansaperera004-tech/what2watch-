import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] =
    useState('');

  const submit = (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must contain at least 6 characters.');
      return;
    }

    const users = JSON.parse(
      localStorage.getItem('what2watchUsers') || '[]',
    );

    const alreadyExists = users.some(
      (user) =>
        user.email.toLowerCase() === email.toLowerCase(),
    );

    if (alreadyExists) {
      toast.error('An account with this email already exists.');
      return;
    }

    users.push({
      id: Date.now(),
      name,
      email,
      password,
    });

    localStorage.setItem(
      'what2watchUsers',
      JSON.stringify(users),
    );

    toast.success('Registration successful. Please log in.');
    navigate('/login');
  };

  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center px-6 py-12">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-cinema-900 p-8">
        <p className="text-sm uppercase tracking-widest text-purple-400">
          what2watch
        </p>

        <h1 className="mb-8 mt-2 text-3xl font-black">
          Create an account
        </h1>

        <form onSubmit={submit} className="space-y-5">
          <Field
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <Field
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Field
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Field
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(e.target.value)
            }
            required
          />

          <button
            type="submit"
            className="w-full rounded-lg bg-purple-600 py-3 font-semibold hover:bg-purple-700"
          >
            Register
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Already registered?{' '}
          <Link
            to="/login"
            className="text-purple-400 hover:text-purple-300"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

function Field({
  label,
  type = 'text',
  value,
  onChange,
  required,
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm text-gray-400">
        {label}
      </span>

      <input
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-3 text-white outline-none focus:border-purple-500"
      />
    </label>
  );
}

export default Register;