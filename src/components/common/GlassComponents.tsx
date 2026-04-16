// src/components/ui/GlassComponents.jsx
import { SparklesIcon, StarIcon } from '@heroicons/react/24/outline';

export const GlassCard = ({ children, className = "", hover = true, ...props }) => {
  return (
    <div
      className={`
        backdrop-blur-xl bg-white/20 dark:bg-white/5
        border border-white/30 dark:border-white/10
        rounded-2xl shadow-2xl
        ${hover
          ? 'hover:bg-white/30 dark:hover:bg-white/8 hover:border-white/40 dark:hover:border-white/15 hover:shadow-3xl hover:-translate-y-2 hover:scale-[1.02]'
          : ''
        }
        transition-all duration-500 ease-out
        group relative overflow-hidden
        ${className}
      `}
      {...props}
    >
      {/* Efecto de brillo sutil */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-shimmer pointer-events-none" />

      {/* Gradiente de fondo sutil */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/10 via-transparent to-purple-50/10 dark:from-blue-900/5 dark:via-transparent dark:to-purple-900/5 pointer-events-none" />

      {children}
    </div>
  );
};

// Componente de badge mejorado
export const Badge = ({ children, variant = 'default', className = "" }) => {
  const variants = {
    vintage: 'bg-amber-500 text-white',
    new: 'bg-green-500 text-white',
    default: 'bg-white/20 dark:bg-white/10 text-slate-700 dark:text-slate-300 border border-white/30 dark:border-white/20'
  };

  return (
    <span className={`
      inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold
      backdrop-blur-sm shadow-lg
      ${variants[variant]}
      ${className}
    `}>
      {variant === 'vintage' && <SparklesIcon className="w-3 h-3 mr-1" />}
      {variant === 'new' && <StarIcon className="w-3 h-3 mr-1" />}
      {children}
    </span>
  );
};

export const GlassButton = ({
  children,
  variant = 'default',
  size = 'sm',
  className = "",
  ...props
}) => {
  const variants = {
    primary: `
      bg-blue-500/20 dark:bg-blue-400/15
      border-blue-300/50 dark:border-blue-400/30
      text-blue-700 dark:text-blue-300
      hover:bg-blue-500/30 dark:hover:bg-blue-400/25
      hover:border-blue-400/70 dark:hover:border-blue-300/50
      hover:text-blue-800 dark:hover:text-blue-200
      shadow-blue-500/20 dark:shadow-blue-400/10
    `,
    secondary: `
      bg-white/20 dark:bg-white/8
      border-white/30 dark:border-white/15
      text-slate-700 dark:text-slate-200
      hover:bg-white/30 dark:hover:bg-white/12
      hover:border-white/40 dark:hover:border-white/25
      hover:text-slate-800 dark:hover:text-white
      shadow-slate-500/10 dark:shadow-white/5
    `,
    danger: `
      bg-red-500/20 dark:bg-red-400/15
      border-red-300/50 dark:border-red-400/30
      text-red-700 dark:text-red-300
      hover:bg-red-500/30 dark:hover:bg-red-400/25
      hover:border-red-400/70 dark:hover:border-red-300/50
      hover:text-red-800 dark:hover:text-red-200
      shadow-red-500/20 dark:shadow-red-400/10
    `
  };

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button
      className={`
        inline-flex items-center justify-center
        backdrop-blur-sm border rounded-xl
        font-medium transition-all duration-300 ease-out
        hover:shadow-xl hover:-translate-y-0.5
        focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};