import React, { createContext, useContext, useState, useEffect } from 'react';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favorite-contacts');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('favorite-contacts', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (contactId) => {
    setFavorites(prev =>
      prev.includes(contactId)
        ? prev.filter(id => id !== contactId)
        : [...prev, contactId]
    );
  };

  const isFavorite = (contactId) => favorites.includes(contactId);

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within FavoritesProvider');
  }
  return context;
};
