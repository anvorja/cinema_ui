// src/components/ui/ThemeToggle.tsx
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

interface ThemeToggleProps {
  className?: string;
}

const ThemeToggle = ({ className = '' }: ThemeToggleProps) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      className={`relative flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200
        text-zinc-500 hover:text-white hover:bg-zinc-800/70
        focus:outline-none focus-visible:ring-1 focus-visible:ring-zinc-600
        ${className}`}
      aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      title={isDark ? 'Modo claro' : 'Modo oscuro'}
    >
      {/* Sun — visible en dark mode */}
      <Sun
        className={`absolute h-4 w-4 transition-all duration-300 ${
          isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'
        }`}
        aria-hidden
      />
      {/* Moon — visible en light mode */}
      <Moon
        className={`absolute h-4 w-4 transition-all duration-300 ${
          isDark ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'
        }`}
        aria-hidden
      />
    </button>
  );
};

export default ThemeToggle;
