import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { RecentSearchProvider } from './context/RecentSearchContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <FavoritesProvider>
          <RecentSearchProvider>
            <App />
          </RecentSearchProvider>
        </FavoritesProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);


