// src/components/ui/GlassInput.jsx
import { forwardRef } from 'react';
import { cn } from '../../utils';

const GlassInput = forwardRef(({
  className,
  type = 'text',
  variant = 'default',
  ...props
}, ref) => {
  const variants = {
    default: [
      'bg-white/10 border-white/20 backdrop-blur-md',
      'placeholder:text-white/60 text-white',
      'focus:bg-white/15 focus:border-white/40'
    ].join(' '),

    dark: [
      'bg-black/20 border-black/30 backdrop-blur-md',
      'placeholder:text-black/60 text-black',
      'focus:bg-black/25 focus:border-black/50'
    ].join(' ')
  };

  return (
    <input
      type={type}
      ref={ref}
      className={cn(
        // Base styles
        'flex h-11 w-full rounded-xl border px-4 py-2',
        'text-sm font-medium transition-all duration-300',
        'focus-visible:outline-none focus-visible:ring-2',
        'focus-visible:ring-white/50 focus-visible:ring-offset-2',
        'focus-visible:ring-offset-transparent',
        'disabled:cursor-not-allowed disabled:opacity-50',
        // Variant styles
        variants[variant],
        className
      )}
      {...props}
    />
  );
});

GlassInput.displayName = 'GlassInput';

export { GlassInput };