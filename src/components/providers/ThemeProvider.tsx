// src/providers/ThemeProvider.jsx
import { useState, useEffect } from 'react';
import { ThemeContext } from '../contexts/ThemeContext.js';

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('dark'); // Default dark para cine
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const getInitialTheme = () => {
      const savedTheme = localStorage.getItem('cinema-theme');
      if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
        return savedTheme;
      }

      // Verificar preferencia del sistema
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }

      return 'dark'; // Default para aplicación de cine
    };

    const initialTheme = getInitialTheme();
    setTheme(initialTheme);
    setIsInitialized(true);

    // Escuchar cambios en la preferencia del sistema
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = (e) => {
      const savedTheme = localStorage.getItem('cinema-theme');
      if (!savedTheme) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);
    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }, []);

  useEffect(() => {
    if (!isInitialized) return;

    const root = document.documentElement;

    // Remover clases anteriores
    root.classList.remove('light', 'dark');

    // Agregar nueva clase
    root.classList.add(theme);
    root.setAttribute('data-theme', theme);

    // Guardar en localStorage
    localStorage.setItem('cinema-theme', theme);

    // Actualizar meta theme-color para móviles
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    const themeColor = theme === 'dark' ? '#0f172a' : '#ffffff';

    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', themeColor);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'theme-color';
      meta.content = themeColor;
      document.head.appendChild(meta);
    }
  }, [theme, isInitialized]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
  };

  const setLightTheme = () => setTheme('light');
  const setDarkTheme = () => setTheme('dark');

  const value = {
    theme,
    toggleTheme,
    setLightTheme,
    setDarkTheme,
    isInitialized
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};