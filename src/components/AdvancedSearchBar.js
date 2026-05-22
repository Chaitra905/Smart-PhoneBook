import React, { useState, useCallback, useRef, useEffect } from 'react';
import { FiSearch, FiX, FiAlertCircle } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';
import { useRecentSearch } from '../context/RecentSearchContext';
import SearchSuggestions from './SearchSuggestions';

const AdvancedSearchBar = ({ search, setSearch, contacts, onSearch }) => {
  const { isDark } = useTheme();
  const { addSearch } = useRecentSearch();
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [debounceTimer, setDebounceTimer] = useState(null);
  const lastSavedRef = useRef('');
  const searchRef = useRef(null);

  // Debounced search
  const handleSearchChange = useCallback((value) => {
    setSearch(value);
    
    // Clear existing timer
    if (debounceTimer) clearTimeout(debounceTimer);

    // Set new timer for debounced search
    if (value.trim()) {
      const timer = setTimeout(() => {
        onSearch?.(value);
        setShowSuggestions(true);
        if (lastSavedRef.current !== value) {
          addSearch(value);
          lastSavedRef.current = value;
        }
      }, 300); // 300ms debounce

      setDebounceTimer(timer);
    } else {
      onSearch?.('');
      setShowSuggestions(false);
    }
  }, [addSearch, debounceTimer, onSearch, setSearch]);

  const handleSelectSuggestion = (suggestion) => {
    setSearch(suggestion);
    addSearch(suggestion);
    onSearch?.(suggestion);
    setShowSuggestions(false);
  };

  const handleClear = () => {
    setSearch('');
    onSearch?.('');
    setShowSuggestions(false);
  };

  const handleFocus = () => {
    setShowSuggestions(true);
  };

  const handleBlur = () => {
    // Delay to allow suggestion click
    setTimeout(() => setShowSuggestions(false), 200);
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  return (
    <div className="relative" ref={searchRef}>
      <div className={`flex items-center gap-2 px-4 py-3 rounded-xl backdrop-blur-md transition-all ${
        isDark
          ? 'bg-gray-800/50 border border-gray-700 focus-within:border-purple-500'
          : 'bg-white/50 border border-gray-200 focus-within:border-purple-500'
      }`}>
        <FiSearch className={`text-lg ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
        
        <input
          type="text"
          placeholder="Search by name, email, phone, or company..."
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={`flex-1 bg-transparent outline-none text-base placeholder-gray-500 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}
        />

        {search && (
          <button
            onClick={handleClear}
            className={`p-1 rounded-lg transition-colors ${
              isDark
                ? 'hover:bg-gray-700 text-gray-400 hover:text-white'
                : 'hover:bg-gray-200 text-gray-500 hover:text-gray-900'
            }`}
            title="Clear search"
          >
            <FiX size={18} />
          </button>
        )}
      </div>

      {/* Search Tips */}
      {!search && !showSuggestions && (
        <div className={`mt-2 flex items-start gap-2 text-xs ${
          isDark ? 'text-gray-400' : 'text-gray-600'
        }`}>
          <FiAlertCircle size={14} className="mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold uppercase tracking-wider text-[10px]">Search Tips</p>
            <p>Search by Name, Email, Phone, or Company</p>
          </div>
        </div>
      )}

      {/* Suggestions dropdown */}
      <SearchSuggestions
        contacts={contacts}
        search={search}
        onSelectSuggestion={handleSelectSuggestion}
        showSuggestions={showSuggestions}
      />
    </div>
  );
};

export default AdvancedSearchBar;
