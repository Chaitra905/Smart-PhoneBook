import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useRecentSearch } from '../context/RecentSearchContext';
import { FiClock, FiTrendingUp, FiX } from 'react-icons/fi';

const SearchSuggestions = ({ contacts, search, onSelectSuggestion, showSuggestions }) => {
  const { isDark } = useTheme();
  const { recentSearches, clearSearches } = useRecentSearch();

  if (!showSuggestions || !search && recentSearches.length === 0) {
    return null;
  }

  // Generate suggestions from contacts
  const generateSuggestions = () => {
    if (!search.trim()) {
      return recentSearches.slice(0, 5);
    }

    const query = search.toLowerCase();
    const suggestions = [];
    const seen = new Set();

    contacts.forEach(contact => {
      const fields = [
        { type: 'name', value: contact.name },
        { type: 'email', value: contact.email },
        { type: 'phone', value: contact.phone },
        { type: 'company', value: contact.company },
      ];

      fields.forEach(({ type, value }) => {
        if (!value) return;
        const lowerValue = value.toLowerCase();
        if (lowerValue.includes(query)) {
          const key = `${type}:${value}`;
          if (!seen.has(key)) {
            seen.add(key);
            suggestions.push({ type, value, id: contact.id });
          }
        }
      });
    });

    return suggestions.slice(0, 8);
  };

  const suggestions = generateSuggestions();

  const getIcon = (type) => {
    const icons = {
      name: '👤',
      email: '✉️',
      phone: '📱',
      company: '🏢',
    };
    return icons[type] || '🔍';
  };

  return (
    <div className={`absolute top-full left-0 right-0 mt-2 rounded-xl shadow-2xl z-50 ${
      isDark
        ? 'bg-gray-800 border border-gray-700'
        : 'bg-white border border-gray-200'
    }`}>
      {suggestions.length > 0 && (
        <div className="p-2">
          <div className={`text-xs font-semibold px-3 py-2 ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            <FiTrendingUp className="inline mr-1" />
            Suggestions
          </div>
          {suggestions.map((suggestion, idx) => (
            <button
              key={idx}
              onClick={() => onSelectSuggestion(suggestion.value)}
              className={`w-full text-left px-3 py-2 rounded-lg mb-1 transition-all ${
                isDark
                  ? 'hover:bg-gray-700 text-gray-200'
                  : 'hover:bg-gray-100 text-gray-900'
              }`}
            >
              <span className="mr-2">{getIcon(suggestion.type)}</span>
              <span className="font-medium">{suggestion.value}</span>
              <span className={`ml-2 text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                {suggestion.type}
              </span>
            </button>
          ))}
        </div>
      )}

      {recentSearches.length > 0 && search === '' && (
        <div className={`border-t ${isDark ? 'border-gray-700' : 'border-gray-200'} p-2`}>
          <div className={`text-xs font-semibold px-3 py-2 flex justify-between items-center ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            <span><FiClock className="inline mr-1" /> Recent Searches</span>
            <button
              onClick={clearSearches}
              className={`text-xs hover:text-red-500 transition-colors`}
            >
              Clear
            </button>
          </div>
          {recentSearches.slice(0, 5).map((search, idx) => (
            <button
              key={idx}
              onClick={() => onSelectSuggestion(search.query)}
              className={`w-full text-left px-3 py-2 rounded-lg mb-1 transition-all ${
                isDark
                  ? 'hover:bg-gray-700 text-gray-300'
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              <FiClock className="inline mr-2 text-gray-500" />
              {search.query}
            </button>
          ))}
        </div>
      )}

      {suggestions.length === 0 && search && (
        <div className={`p-6 text-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          <p className="text-sm">No suggestions found</p>
        </div>
      )}
    </div>
  );
};

export default SearchSuggestions;
