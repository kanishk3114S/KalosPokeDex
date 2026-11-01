import React, { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isShiny, setIsShiny] = useState(() => {
    return localStorage.getItem('isShiny') === 'true';
  });

  // Supports 'dark' (Deep Kalos Blue), 'pitch-black', 'light' (Lumiose Daylight)
  const [themeMode, setThemeMode] = useState(() => {
    const saved = localStorage.getItem('kalosThemeMode');
    if (saved) return saved;
    // Check legacy isDarkMode boolean
    const legacy = localStorage.getItem('isDarkMode');
    if (legacy === 'true') return 'pitch-black';
    return 'dark'; // Default to 9th-Gen Deep Kalos Blue
  });

  useEffect(() => {
    localStorage.setItem('isShiny', String(isShiny));
  }, [isShiny]);

  useEffect(() => {
    localStorage.setItem('kalosThemeMode', themeMode);
    document.body.classList.remove('dark', 'pitch-black', 'light');
    document.body.classList.add(themeMode);
  }, [themeMode]);

  const cycleTheme = () => {
    setThemeMode((prev) => {
      if (prev === 'dark') return 'pitch-black';
      if (prev === 'pitch-black') return 'light';
      return 'dark';
    });
  };

  const isDarkMode = themeMode !== 'light';
  const setIsDarkMode = (val) => {
    setThemeMode(val ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{
      isShiny,
      setIsShiny,
      themeMode,
      setThemeMode,
      cycleTheme,
      isDarkMode,
      setIsDarkMode
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
