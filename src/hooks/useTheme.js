// // hooks/useTheme.js
// import { createContext, useContext, useEffect, useState } from 'react';
//
// // Crear el contexto
// export const ThemeContext = createContext();
//
// // Hook personalizado para usar el tema
// export const useTheme = () => {
//   const context = useContext(ThemeContext);
//   if (context === undefined) {
//     throw new Error('useTheme must be used within a ThemeProvider');
//   }
//   return context;
// };
//
// // Hook personalizado para la lógica del tema
// export const useThemeLogic = () => {
//   const [isDark, setIsDark] = useState(() => {
//     // Verificar localStorage primero
//     const saved = localStorage?.getItem('theme');
//     if (saved) {
//       return saved === 'dark';
//     }
//     // Si no hay preferencia guardada, usar preferencia del sistema
//     return window.matchMedia('(prefers-color-scheme: dark)').matches;
//   });
//
//   useEffect(() => {
//     // Aplicar el tema al documento
//     if (isDark) {
//       document.documentElement.classList.add('dark');
//       localStorage?.setItem('theme', 'dark');
//     } else {
//       document.documentElement.classList.remove('dark');
//       localStorage?.setItem('theme', 'light');
//     }
//   }, [isDark]);
//
//   const toggleTheme = () => {
//     setIsDark(!isDark);
//   };
//
//   return { isDark, toggleTheme };
// };


// src/hooks/useTheme.js
import { useContext } from 'react';
import { ThemeContext } from '../components/providers/ThemeProvider';

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
};