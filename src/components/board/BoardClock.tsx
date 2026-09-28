import { useEffect, useState } from 'react';

const fmt = () =>
  new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: false });

/** Reloj del tablero: hora local, HH:MM. */
export const BoardClock = ({ className = '' }: { className?: string }) => {
  const [t, setT] = useState(fmt);
  useEffect(() => {
    const id = window.setInterval(() => setT(fmt()), 15_000);
    return () => clearInterval(id);
  }, []);
  return <time className={`b-clock ${className}`} dateTime={new Date().toISOString()}>{t}</time>;
};

export default BoardClock;
