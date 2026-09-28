import { useEffect } from 'react';
import { applyBoardTheme, readBoardTheme } from './useBoardTheme';

// Activa el mundo "tablero" (y el tema elegido) en <body> mientras el componente esté montado.
// Va en <body> para que los portales de Radix (menús, diálogos, tooltips) hereden los tokens.
export const useBoardWorld = () => {
  useEffect(() => {
    document.body.classList.add('board');
    applyBoardTheme(readBoardTheme());
    return () => document.body.classList.remove('board', 'board-light');
  }, []);
};

export default useBoardWorld;
