// // components/providers/ThemeProvider.jsx
// import React from 'react';
// import { ThemeContext, useThemeLogic } from '../../hooks/useTheme';
//
// export const ThemeProvider = ({ children }) => {
//   const themeValue = useThemeLogic();
//
//   return (
//     <ThemeContext.Provider value={themeValue}>
//       {children}
//     </ThemeContext.Provider>
//   );
// };


// version 2
// src/components/providers/ThemeProvider.jsx
import { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('dark'); // Por defecto oscuro para el glassmorphism

  useEffect(() => {
    // Cargar tema desde localStorage
    const savedTheme = localStorage.getItem('tucarro-theme');
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    // Aplicar el tema al documento
    document.documentElement.className = theme;

    // Guardar en localStorage
    localStorage.setItem('tucarro-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
  };

  const value = {
    theme,
    setTheme,
    toggleTheme,
    isDark: theme === 'dark'
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};