import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const submit = (event) => {
    event.preventDefault();

    const storedUsers = JSON.parse(
      localStorage.getItem('what2watchUsers') || '[]',
    );

    const user = storedUsers.find(
      (item) =>
        item.email.toLowerCase() === email.toLowerCase() &&
        item.password === password,
    );

    if (!user) {
      toast.error('Invalid email or password.');
      return;
    }

    localStorage.setItem(
      'what2watchUser',
      JSON.stringify({
        name: user.name,
        email: user.email,
      }),
    );

    toast.success('Login successful.');
    navigate('/');
  };

  return (
    <AuthLayout title="Welcome back">
      <form onSubmit={submit} className="space-y-5">
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full rounded-lg bg-purple-600 py-3 font-semibold hover:bg-purple-700"
        >
          Login
        </button>

        <p className="text-center text-sm text-gray-400">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="text-purple-400 hover:text-purple-300"
          >
            Register
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}

function AuthLayout({ title, children }) {
  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center px-6 py-12">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-cinema-900 p-8">
        <p className="text-sm uppercase tracking-widest text-purple-400">
          what2watch
        </p>

        <h1 className="mt-2 mb-8 text-3xl font-black">
          {title}
        </h1>

        {children}
      </div>
    </div>
  );
}

function Input({
  label,
  type,
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

export default Login;