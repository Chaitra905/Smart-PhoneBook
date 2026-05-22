import React, { useState, useEffect } from 'react';

const RecentSearchContext = React.createContext();

export const RecentSearchProvider = ({ children }) => {
  const [recentSearches, setRecentSearches] = useState(() => {
    const saved = localStorage.getItem('recent-searches');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('recent-searches', JSON.stringify(recentSearches));
  }, [recentSearches]);

  const addSearch = (query) => {
    if (!query.trim()) return;
    
    setRecentSearches(prev => {
      const filtered = prev.filter(s => s.query !== query);
      return [{ query, timestamp: new Date().toISOString() }, ...filtered].slice(0, 10);
    });
  };

  const clearSearches = () => setRecentSearches([]);

  return (
    <RecentSearchContext.Provider value={{ recentSearches, addSearch, clearSearches }}>
      {children}
    </RecentSearchContext.Provider>
  );
};

export const useRecentSearch = () => {
  const context = React.useContext(RecentSearchContext);
  if (!context) {
    throw new Error('useRecentSearch must be used within RecentSearchProvider');
  }
  return context;
};
