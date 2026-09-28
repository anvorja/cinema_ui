// Panel del tablero. Conserva el nombre GlassCard por compatibilidad con las páginas,
// pero es una superficie plana con filete: sin blur ni brillos.
import { forwardRef } from 'react';
import type React from 'react';
import { cn } from '../../utils/index';

type GlassCardProps = React.ComponentPropsWithoutRef<'div'> & {
  variant?: 'default' | 'dark' | 'primary' | 'premium';
  intensity?: 'light' | 'medium' | 'strong' | 'ultra';
};

const variants = {
  default: 'bg-board-panel border-board-line',
  dark: 'bg-board-ground border-board-line',
  primary: 'bg-board-panel2 border-board-amber/40',
  premium: 'bg-board-panel border-board-line',
};

const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = 'default', intensity: _intensity, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('relative overflow-hidden rounded-[3px] border', variants[variant], className)}
      {...props}
    >
      {children}
    </div>
  )
);
GlassCard.displayName = 'GlassCard';

export { GlassCard };
