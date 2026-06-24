import React, { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isShiny, setIsShiny] = useState(() => {
    return localStorage.getItem('isShiny') === 'true';
  });
  
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('isDarkMode') === 'true'; // Default to false (Deep Blue)
  });

  useEffect(() => {
    localStorage.setItem('isShiny', isShiny);
  }, [isShiny]);

  useEffect(() => {
    localStorage.setItem('isDarkMode', isDarkMode);
    if (isDarkMode) {
      document.body.classList.add('pitch-black');
      document.body.classList.remove('dark');
    } else {
      document.body.classList.add('dark');
      document.body.classList.remove('pitch-black');
    }
  }, [isDarkMode]);

  return (
    <ThemeContext.Provider value={{ isShiny, setIsShiny, isDarkMode, setIsDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
