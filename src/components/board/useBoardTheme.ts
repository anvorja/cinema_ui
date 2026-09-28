import { useCallback, useEffect, useState } from 'react';

// Tema del comprador (oscuro por defecto). Clave propia: no toca el tema del panel admin.
export type BoardTheme = 'dark' | 'light';
const KEY = 'cinema-board-theme';
const EVENT = 'board-theme-change';

export const readBoardTheme = (): BoardTheme => {
  try {
    return localStorage.getItem(KEY) === 'light' ? 'light' : 'dark';
  } catch {
    return 'dark';
  }
};

export const applyBoardTheme = (theme: BoardTheme) => {
  document.body.classList.toggle('board-light', theme === 'light');
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', theme === 'light' ? '#f2f1ec' : '#0c0c0d');
};

export const useBoardTheme = () => {
  const [theme, setThemeState] = useState<BoardTheme>(readBoardTheme);

  useEffect(() => {
    const sync = () => setThemeState(readBoardTheme());
    window.addEventListener(EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const setTheme = useCallback((next: BoardTheme) => {
    try { localStorage.setItem(KEY, next); } catch { /* sin almacenamiento: solo esta sesión */ }
    applyBoardTheme(next);
    setThemeState(next);
    window.dispatchEvent(new Event(EVENT));
  }, []);

  const toggle = useCallback(() => setTheme(readBoardTheme() === 'dark' ? 'light' : 'dark'), [setTheme]);

  return { theme, setTheme, toggle };
};
