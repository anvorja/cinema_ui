// src/components/ui/GlassCard.jsx
import { forwardRef } from 'react';
import { cn } from '../../utils';

const GlassCard = forwardRef(({
  children,
  className,
  variant = 'default',
  intensity = 'medium',
  hover = false,
  glow = false,
  bordered = true,
  ...props
}, ref) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-500/10 border-blue-500/20 shadow-blue-500/10';
      case 'secondary':
        return 'bg-purple-500/10 border-purple-500/20 shadow-purple-500/10';
      case 'accent':
        return 'bg-amber-500/10 border-amber-500/20 shadow-amber-500/10';
      case 'success':
        return 'bg-green-500/10 border-green-500/20 shadow-green-500/10';
      case 'danger':
        return 'bg-red-500/10 border-red-500/20 shadow-red-500/10';
      default:
        return 'bg-white/10 dark:bg-black/10 border-white/20 dark:border-white/10';
    }
  };

  const getIntensityStyles = () => {
    switch (intensity) {
      case 'light':
        return 'backdrop-blur-sm';
      case 'strong':
        return 'backdrop-blur-3xl';
      case 'ultra':
        return 'backdrop-blur-3xl bg-white/20 dark:bg-black/20';
      default:
        return 'backdrop-blur-xl';
    }
  };

  return (
    <div
      ref={ref}
      className={cn(
        // Base glass morphism styles
        'relative rounded-xl',
        getVariantStyles(),
        getIntensityStyles(),

        // Border styles
        bordered && 'border',

        // Shadow and glow effects
        'shadow-2xl',
        glow && 'animate-glow',

        // Hover effects
        hover && cn(
          'hover-lift cursor-pointer transition-all duration-300 ease-in-out',
          'hover:bg-white/15 dark:hover:bg-black/15',
          'hover:border-white/30 dark:hover:border-white/20',
          'hover:shadow-3xl hover:-translate-y-1 hover:scale-[1.02]'
        ),

        // Animation
        'transition-all duration-300 ease-in-out',

        className
      )}
      {...props}
    >
      {/* Inner glow effect */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Bottom highlight */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </div>
  );
});

GlassCard.displayName = 'GlassCard';

export default GlassCard;