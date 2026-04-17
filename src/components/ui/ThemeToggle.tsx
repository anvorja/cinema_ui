// src/components/ui/ThemeToggle.tsx
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

interface ThemeToggleProps {
  /**
   * "header"  — íconos blancos sobre fondo glassmorphic (app pública)
   * "sidebar" — íconos zinc sobre fondo zinc (admin sidebar)
   */
  variant?: 'header' | 'sidebar';
  className?: string;
}

const ThemeToggle = ({ variant = 'header', className = '' }: ThemeToggleProps) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  // Estilos base del botón según variante
  const btnBase =
    variant === 'header'
      ? 'relative flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-200 text-white/70 hover:text-white hover:bg-white/10 border border-white/0 hover:border-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30'
      : 'relative flex items-center justify-center w-full h-8 rounded-lg px-3 gap-2 transition-all duration-200 text-zinc-500 hover:text-white hover:bg-zinc-800/70 focus:outline-none focus-visible:ring-1 focus-visible:ring-zinc-600';

  return (
    <button
      onClick={toggleTheme}
      className={`${btnBase} ${className}`}
      aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      title={isDark ? 'Modo claro' : 'Modo oscuro'}
    >
      {/* Sun icon — visible en dark mode (click = ir a light) */}
      <Sun
        className={`absolute transition-all duration-300 ease-spring ${
          variant === 'header' ? 'h-4 w-4' : 'h-3.5 w-3.5'
        } ${
          isDark
            ? 'opacity-100 rotate-0 scale-100'
            : 'opacity-0 -rotate-90 scale-50'
        }`}
        aria-hidden
      />

      {/* Moon icon — visible en light mode (click = ir a dark) */}
      <Moon
        className={`absolute transition-all duration-300 ease-spring ${
          variant === 'header' ? 'h-4 w-4' : 'h-3.5 w-3.5'
        } ${
          isDark
            ? 'opacity-0 rotate-90 scale-50'
            : 'opacity-100 rotate-0 scale-100'
        }`}
        aria-hidden
      />

      {/* Label en sidebar variant */}
      {variant === 'sidebar' && (
        <span className="text-xs ml-5">{isDark ? 'Modo claro' : 'Modo oscuro'}</span>
      )}
    </button>
  );
};

export default ThemeToggle;
