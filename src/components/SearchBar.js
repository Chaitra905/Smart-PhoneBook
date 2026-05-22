import React from 'react';

function SearchBar({ search, setSearch }) {
  return (
    <div className="relative mb-8 group">
      <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-25 group-hover:opacity-100 transition duration-1000"></div>
      
      <div className="relative flex items-center bg-white/95 backdrop-blur-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
        <span className="text-3xl text-purple-600 ml-5 animate-pulse">🔍</span>
        <input
          type="text"
          placeholder="Search by name, phone, email, company..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-4 ml-3 text-gray-800 placeholder-gray-400 focus:outline-none bg-transparent font-medium"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="mr-5 text-2xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-all transform hover:scale-110 active:scale-95"
            title="Clear search"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}

export default SearchBar;
