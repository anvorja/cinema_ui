// components/ui/Button.jsx
import { forwardRef } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '../../utils';

const Button = forwardRef(({
  className = '',
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  children,
  asChild = false,
  ...props
}, ref) => {
  const baseClasses = `
    inline-flex items-center justify-center font-medium rounded-lg
    transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
  `;

  const variants = {
      primary: `
    bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700
    text-white shadow-md hover:shadow-lg border-0
    focus:ring-blue-500 dark:focus:ring-blue-400
    dark:from-blue-500 dark:to-purple-500 dark:hover:from-blue-600 dark:hover:to-purple-600
  `,
  secondary: `
    bg-white/20 hover:bg-white/30 active:bg-white/40
    text-slate-700 border border-white/30
    focus:ring-slate-500 dark:focus:ring-slate-400
    dark:bg-white/10 dark:hover:bg-white/20 dark:active:bg-white/30
    dark:text-slate-200 dark:border-white/20
  `,
  ghost: `
    bg-transparent hover:bg-white/20 active:bg-white/30
    text-slate-700 border-0
    focus:ring-slate-500 dark:focus:ring-slate-400
    dark:hover:bg-white/10 dark:active:bg-white/20
    dark:text-slate-300 dark:hover:text-slate-100
  `,
  outline: `
    bg-transparent hover:bg-white/20 active:bg-white/30
    text-slate-700 border border-white/30
    focus:ring-slate-500 dark:focus:ring-slate-400
    dark:hover:bg-white/10 dark:active:bg-white/20
    dark:text-slate-300 dark:border-white/20 dark:hover:text-slate-100
  `,
  danger: `
    bg-red-600 hover:bg-red-700 active:bg-red-800
    text-white shadow-md hover:shadow-lg border-0
    focus:ring-red-500 dark:focus:ring-red-400
    dark:bg-red-600 dark:hover:bg-red-500 dark:active:bg-red-700
  `,
  success: `
    bg-green-600 hover:bg-green-700 active:bg-green-800
    text-white shadow-md hover:shadow-lg border-0
    focus:ring-green-500 dark:focus:ring-green-400
    dark:bg-green-600 dark:hover:bg-green-500 dark:active:bg-green-700
  `,
  warning: `
    bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-700
    text-white shadow-md hover:shadow-lg border-0
    focus:ring-yellow-500 dark:focus:ring-yellow-400
    dark:bg-yellow-600 dark:hover:bg-yellow-500 dark:active:bg-yellow-700
  `
};

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg'
  };

  const classes = cn(
    baseClasses,
    variants[variant],
    sizes[size],
    className
  );

  // Si asChild es true, usar Slot para renderizar como el componente hijo
  // Si no, usar button normal
  const Component = asChild ? Slot : 'button';

  // Si hay loading y asChild, mostrar advertencia en desarrollo
  if (asChild && loading && import.meta.env.DEV) {
    console.warn('Button: asChild=true no es compatible con loading=true. El spinner no se mostrará.');
  }

  // Cuando asChild es true, no debemos añadir el spinner porque Slot
  // espera solo un elemento hijo directo
  const content = asChild ? children : (
    <>
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </>
  );


  return (
    <Component
      ref={ref}
      className={classes}
      disabled={disabled || loading}
      {...props}
    >
      {content}
    </Component>
  );
});

Button.displayName = 'Button';

export default Button;