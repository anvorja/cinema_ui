// src/components/ui/ThemeShimmerSelect.jsx
import Select from './Select';
import { cn } from '../../utils';

const ThemeShimmerSelect = ({
  intensity = 'normal', // 'normal' o 'intense'
  className,
  ...props
}) => {
  const shimmerClass = intensity === 'intense' ? 'shimmer-theme-intense' : 'shimmer-theme';

  return (
    <div className={cn(shimmerClass, className)}>
      <Select {...props} />
    </div>
  );
};

export default ThemeShimmerSelect;