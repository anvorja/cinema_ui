// src/components/providers/ThemeProvider.jsx
import { useState, useEffect } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light'); // Cambiar default a light
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Función para obtener el tema inicial
    const getInitialTheme = () => {
      // 1. Verificar localStorage primero
      const savedTheme = localStorage.getItem('tucarro-theme');
      if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
        return savedTheme;
      }

      // 2. Si no hay tema guardado, usar preferencia del sistema
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }

      // 3. Default fallback
      return 'light';
    };

    const initialTheme = getInitialTheme();
    setTheme(initialTheme);
    setIsInitialized(true);

    // Escuchar cambios en la preferencia del sistema
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = (e) => {
      // Solo cambiar si no hay tema guardado en localStorage
      const savedTheme = localStorage.getItem('tucarro-theme');
      if (!savedTheme) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);

    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, []);

  useEffect(() => {
    if (!isInitialized) return;

    // Aplicar el tema al documento
    const root = document.documentElement;

    // Remover clases anteriores
    root.classList.remove('light', 'dark');

    // Agregar nueva clase
    root.classList.add(theme);

    // Guardar en localStorage
    localStorage.setItem('tucarro-theme', theme);

    // También actualizar el atributo data-theme para mayor compatibilidad
    root.setAttribute('data-theme', theme);

    // Actualizar meta theme-color para móviles
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme === 'dark' ? '#0f172a' : '#ffffff');
    } else {
      // Crear si no existe
      const meta = document.createElement('meta');
      meta.name = 'theme-color';
      meta.content = theme === 'dark' ? '#0f172a' : '#ffffff';
      document.head.appendChild(meta);
    }
  }, [theme, isInitialized]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
  };

  const setThemeExplicit = (newTheme) => {
    if (newTheme === 'light' || newTheme === 'dark') {
      setTheme(newTheme);
    }
  };

  const value = {
    theme,
    setTheme: setThemeExplicit,
    toggleTheme,
    isDark: theme === 'dark',
    isLight: theme === 'light',
    isInitialized
  };

  // Mostrar un loading muy breve mientras se inicializa el tema
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};