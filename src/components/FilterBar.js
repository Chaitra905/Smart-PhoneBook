import React from 'react';

function FilterBar({
  sortBy,
  setSortBy,
  companyFilter,
  setCompanyFilter,
  tagFilter,
  setTagFilter,
  locationFilter,
  setLocationFilter,
  showFavoritesOnly,
  setShowFavoritesOnly,
  showRecentOnly,
  setShowRecentOnly,
  companyOptions
}) {
  return (
    <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-lg p-5 space-y-4">
      <div>
        <label className="block text-gray-700 font-semibold mb-2">Sort By:</label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all bg-white cursor-pointer font-medium"
        >
          <option value="name">📝 Name (A-Z)</option>
          <option value="date">📅 Newest First</option>
          <option value="company">🏢 Company</option>
        </select>
      </div>

      <div>
        <label className="block text-gray-700 font-semibold mb-2">Company Filter</label>
        <select
          value={companyFilter}
          onChange={(e) => setCompanyFilter(e.target.value)}
          className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all bg-white cursor-pointer font-medium"
        >
          <option value="">All companies</option>
          {companyOptions.map((company) => (
            <option key={company} value={company}>
              {company}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-gray-700 font-semibold mb-2">Tag Filter</label>
        <input
          value={tagFilter}
          onChange={(e) => setTagFilter(e.target.value)}
          placeholder="e.g. VIP, Team Lead"
          className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all bg-white font-medium"
        />
      </div>

      <div>
        <label className="block text-gray-700 font-semibold mb-2">Location Filter</label>
        <input
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          placeholder="City, state, country"
          className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all bg-white font-medium"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <label className="inline-flex items-center gap-2 text-gray-700 font-semibold">
          <input
            type="checkbox"
            checked={showFavoritesOnly}
            onChange={(e) => setShowFavoritesOnly(e.target.checked)}
            className="form-checkbox h-5 w-5 text-purple-600"
          />
          Favorites only
        </label>
        <label className="inline-flex items-center gap-2 text-gray-700 font-semibold">
          <input
            type="checkbox"
            checked={showRecentOnly}
            onChange={(e) => setShowRecentOnly(e.target.checked)}
            className="form-checkbox h-5 w-5 text-purple-600"
          />
          Recently added
        </label>
      </div>
    </div>
  );
}

export default FilterBar;
