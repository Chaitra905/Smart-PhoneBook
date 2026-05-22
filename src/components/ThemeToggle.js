import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { FiSun, FiMoon } from 'react-icons/fi';

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-lg transition-all duration-300 ${
        isDark
          ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400'
          : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
      }`}
      aria-label="Toggle theme"
    >
      {isDark ? (
        <FiSun size={20} />
      ) : (
        <FiMoon size={20} />
      )}
    </button>
  );
};

export default ThemeToggle;
