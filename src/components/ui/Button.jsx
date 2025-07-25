// src/components/ui/Button.jsx
import { forwardRef } from 'react';
import { cn } from '../../utils';

const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  className,
  disabled,
  loading,
  as: Component = 'button', // Prop 'as' que permite cambiar el elemento a renderizar
  ...props
}, ref) => {
  const baseClasses = 'btn';

  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    danger: 'btn-danger',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <Component
      ref={ref}
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <div className="spinner w-4 h-4 mr-2" />
      )}
      {children}
    </Component>
  );
});

Button.displayName = 'Button';

export default Button;