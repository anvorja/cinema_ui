// src/components/ui/GlassCard.jsx
import { cn } from '../../utils';

const GlassCard = ({
  children,
  className = "",
  hover = true,
  variant = 'default',
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'light':
        return cn(
          'bg-white/40 dark:bg-white/10',
          'border-white/60 dark:border-white/20'
        );
      case 'dark':
        return cn(
          'bg-black/20 dark:bg-white/5',
          'border-black/30 dark:border-white/10'
        );
      case 'colored':
        return cn(
          'bg-gradient-to-br from-blue-500/10 to-purple-500/10',
          'border-blue-500/20 dark:border-blue-400/20'
        );
      default:
        return cn(
          'bg-white/20 dark:bg-white/5',
          'border-white/30 dark:border-white/10'
        );
    }
  };

  return (
    <div
      className={cn(
        'backdrop-blur-xl',
        getVariantStyles(),
        'border rounded-2xl shadow-2xl',
        hover && cn(
          'hover:bg-white/30 dark:hover:bg-white/10',
          'hover:border-white/50 dark:hover:border-white/20',
          'hover:shadow-3xl hover:-translate-y-1'
        ),
        'transition-all duration-300 ease-out',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassCard;