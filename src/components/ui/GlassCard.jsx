// src/components/ui/GlassCard.jsx
import { cn } from '../../utils';
import { forwardRef } from 'react';

const GlassCard = forwardRef(({
  className,
  variant = 'default',
  intensity = 'medium',
  children,
  ...props
}, ref) => {
  const variants = {
    default: 'bg-white/10 border-white/20',
    dark: 'bg-black/20 border-white/10',
    primary: 'bg-blue-500/10 border-blue-400/20',
    premium: 'bg-gradient-to-br from-white/15 to-white/5 border-white/25',
  };

  const intensities = {
    light: 'backdrop-blur-sm',
    medium: 'backdrop-blur-md',
    strong: 'backdrop-blur-lg',
    ultra: 'backdrop-blur-xl',
  };

  return (
    <div
      ref={ref}
      className={cn(
        'relative overflow-hidden rounded-xl border',
        'shadow-lg shadow-black/10',
        'transition-all duration-300 ease-out',
        variants[variant],
        intensities[intensity],
        'hover:shadow-xl hover:shadow-black/20',
        'hover:border-white/30 hover:bg-white/15',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

GlassCard.displayName = 'GlassCard';

export default GlassCard;   // 👈 solución
