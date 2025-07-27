// components/providers/ThemeProvider.jsx
import React from 'react';
import { ThemeContext, useThemeLogic } from '../../hooks/useTheme';

export const ThemeProvider = ({ children }) => {
  const themeValue = useThemeLogic();

  return (
    <ThemeContext.Provider value={themeValue}>
      {children}
    </ThemeContext.Provider>
  );
};