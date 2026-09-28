import { forwardRef } from 'react';
import type React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '../../utils';

type PremiumButtonProps = React.ComponentPropsWithoutRef<'button'> & {
  variant?: 'default' | 'secondary' | 'premium' | 'ghost';
  size?: 'sm' | 'default' | 'lg' | 'xl';
  asChild?: boolean;
  shimmer?: boolean;
};

// Acción principal = ámbar de aleta. Todo lo demás, filete y tinta.
const variants = {
  default: 'bg-board-amber text-board-onamber hover:bg-board-amberpress active:bg-board-amberpress border border-board-amber',
  premium: 'bg-board-amber text-board-onamber hover:bg-board-amberpress active:bg-board-amberpress border border-board-amber',
  secondary: 'bg-transparent text-board-ink border border-board-line2 hover:border-board-ink hover:bg-board-panel2',
  ghost: 'bg-transparent text-board-ink2 border border-transparent hover:text-board-ink hover:bg-board-panel2',
};

const sizes = {
  sm: 'h-10 px-3 text-[15px]',
  default: 'h-12 px-5 text-base',
  lg: 'h-14 px-7 text-lg',
  xl: 'h-16 px-9 text-xl',
};

const PremiumButton = forwardRef<HTMLButtonElement, PremiumButtonProps>(
  ({ className, variant = 'default', size = 'default', asChild = false, shimmer: _s, ...props }, ref) => {
    const Component = asChild ? Slot : 'button';
    return (
      <Component
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-[3px] font-board font-bold tracking-[0.06em] uppercase',
          'select-none active:translate-y-px',
          'disabled:pointer-events-none disabled:opacity-40',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);
PremiumButton.displayName = 'PremiumButton';

export { PremiumButton };
