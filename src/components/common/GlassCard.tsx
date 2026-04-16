// src/components/ui/GlassCard.jsx
import { forwardRef } from 'react';
import type React from 'react';
import {cn} from "../../utils/index"

type GlassCardProps = React.ComponentPropsWithoutRef<'div'> & {
  variant?: 'default' | 'dark' | 'primary' | 'premium';
  intensity?: 'light' | 'medium' | 'strong' | 'ultra';
};

const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(({
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
        // Base glassmorphic styles
        'relative overflow-hidden rounded-xl border',
        'shadow-lg shadow-black/10',
        'transition-all duration-300 ease-out',
        // Variant styles
        variants[variant],
        intensities[intensity],
        // Hover effects
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

export {GlassCard};