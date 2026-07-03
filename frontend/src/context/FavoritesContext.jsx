import React, { createContext, useContext, useState, useEffect } from 'react';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  // Modularity: Extract load/save logic so it can be swapped with Supabase later
  const loadFavorites = () => {
    try {
      const stored = localStorage.getItem('kalos-dex-favorites');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error("Failed to load favorites", e);
      return [];
    }
  };

  const saveFavorites = (favs) => {
    try {
      localStorage.setItem('kalos-dex-favorites', JSON.stringify(favs));
    } catch (e) {
      console.error("Failed to save favorites", e);
    }
  };

  useEffect(() => {
    setFavorites(loadFavorites());
  }, []);

  const toggleFavorite = (pokemonName) => {
    setFavorites((prev) => {
      let updated;
      if (prev.includes(pokemonName)) {
        updated = prev.filter((name) => name !== pokemonName);
      } else {
        updated = [...prev, pokemonName];
      }
      saveFavorites(updated);
      return updated;
    });
  };

  const isFavorite = (pokemonName) => {
    return favorites.includes(pokemonName);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);
