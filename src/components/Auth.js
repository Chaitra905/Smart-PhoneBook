import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FiMail, FiLock, FiUser, FiArrowRight } from 'react-icons/fi';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const { isDark } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        await login(form.email, form.password);
      } else {
        await register(form.username, form.email, form.password);
        setIsLogin(true);
        setError('Registration successful! Please login.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${isDark ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className={`max-w-md w-full rounded-3xl p-8 shadow-2xl backdrop-blur-xl border ${
        isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-white/80 border-white/50'
      }`}>
        <div className="text-center mb-8">
          <h2 className={`text-4xl font-black mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {isLogin ? 'Welcome Back' : 'Join Us'}
          </h2>
          <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
            {isLogin ? 'Login to manage your smart contacts' : 'Create an account to get started'}
          </p>
        </div>

        {error && (
          <div className={`mb-6 p-4 rounded-xl text-sm font-medium ${
            error.includes('successful') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="relative">
              <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Username"
                className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 outline-none transition-all ${
                  isDark ? 'bg-gray-700 border-gray-600 text-white focus:border-purple-500' : 'bg-gray-50 border-gray-200 focus:border-purple-500'
                }`}
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                required
              />
            </div>
          )}
          <div className="relative">
            <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              placeholder="Email Address"
              className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 outline-none transition-all ${
                isDark ? 'bg-gray-700 border-gray-600 text-white focus:border-purple-500' : 'bg-gray-50 border-gray-200 focus:border-purple-500'
              }`}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div className="relative">
            <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              placeholder="Password"
              className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 outline-none transition-all ${
                isDark ? 'bg-gray-700 border-gray-600 text-white focus:border-purple-500' : 'bg-gray-50 border-gray-200 focus:border-purple-500'
              }`}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
            <FiArrowRight />
          </button>
        </form>

        <div className="mt-8 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className={`text-sm font-semibold ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-purple-600'}`}
          >
            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
