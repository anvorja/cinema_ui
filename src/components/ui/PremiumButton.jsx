// src/components/ui/PremiumButton.jsx
import { forwardRef } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '../../utils';

const PremiumButton = forwardRef(({
  className,
  variant = 'default',
  size = 'default',
  asChild = false,
  shimmer = false,
  ...props
}, ref) => {
  const Component = asChild ? Slot : 'button';

  const variants = {
    default: [
      'bg-gradient-to-r from-blue-600 to-blue-700',
      'hover:from-blue-700 hover:to-blue-800',
      'text-white shadow-blue-500/25'
    ].join(' '),

    secondary: [
      'bg-white/10 border-white/20 border backdrop-blur-md',
      'hover:bg-white/20 hover:border-white/30',
      'text-white shadow-black/10'
    ].join(' '),

    premium: [
      'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600',
      'hover:from-amber-600 hover:via-orange-600 hover:to-amber-700',
      'text-white shadow-amber-500/30'
    ].join(' '),

    ghost: [
      'bg-transparent border-white/10 border backdrop-blur-sm',
      'hover:bg-white/5 hover:border-white/20',
      'text-white/90 hover:text-white shadow-none'
    ].join(' ')
  };

  const sizes = {
    sm: 'h-9 px-3 text-sm rounded-lg',
    default: 'h-11 px-6 text-sm rounded-xl',
    lg: 'h-14 px-8 text-base rounded-xl',
    xl: 'h-16 px-10 text-lg rounded-2xl'
  };

  return (
    <div className="relative group">
      {/* Shimmer effect overlay */}
      {shimmer && (
        <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:animate-shimmer rounded-xl" />
      )}

      <Component
        ref={ref}
        className={cn(
          // Base styles
          'relative inline-flex items-center justify-center',
          'font-medium transition-all duration-300 ease-out',
          'focus-visible:outline-none focus-visible:ring-2',
          'focus-visible:ring-white/50 focus-visible:ring-offset-2',
          'focus-visible:ring-offset-black/20',
          'disabled:pointer-events-none disabled:opacity-50',
          'overflow-hidden',
          // Glow effect
          'shadow-lg hover:shadow-xl',
          'transform hover:scale-[1.02] active:scale-[0.98]',
          // Apply variants and sizes
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    </div>
  );
});

PremiumButton.displayName = 'PremiumButton';

export { PremiumButton };