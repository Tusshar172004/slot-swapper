import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/api.js';
import { saveAuth } from '../utils/auth.js';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', form);
      saveAuth(res.data);
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white overflow-hidden">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-xl shadow-md p-8">
        <h2 className="text-2xl font-bold text-center text-indigo-600 mb-6">Login</h2>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-indigo-400 outline-none transition"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-indigo-400 outline-none transition"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-md font-semibold hover:bg-indigo-700 transition"
          >
            Login
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Don’t have an account?{' '}
          <Link to="/signup" className="text-indigo-600 font-medium hover:underline">
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
}
