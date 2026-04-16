// src/components/ui/Select.jsx
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { cn } from '../../utils';

const Select = ({
  options = [],
  value,
  onChange,
  placeholder = "Selecciona una opción",
  error,
  disabled = false,
  size = 'md',
  className,
  name,
  required = false,
  enableShimmer = false,
  ...props
}) => {
  const sizeClasses = {
    sm: 'h-8 text-sm px-2',
    md: 'h-10 text-sm px-3',
    lg: 'h-12 text-base px-4'
  };

  const selectClasses = cn(
    'relative w-full rounded-lg border appearance-none pr-8',
    'backdrop-blur-xl bg-white/10 dark:bg-white/5',
    'border-white/20 dark:border-white/10',
    'shadow-lg shadow-gray-900/5 dark:shadow-gray-900/20',
    'transition-all duration-300 ease-out',
    'hover:bg-white/20 dark:hover:bg-white/10',
    'hover:border-white/30 dark:hover:border-white/20',
    'hover:shadow-xl hover:shadow-blue-500/10',
    'focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-0',
    'focus:border-blue-400/50 dark:focus:border-blue-300/50',
    'focus:bg-white/25 dark:focus:bg-white/10',
    'focus:shadow-2xl focus:shadow-blue-500/20',
    sizeClasses[size],
    'text-slate-800 dark:text-slate-100',
    'placeholder-slate-500/70 dark:placeholder-slate-400/70',
    {
      'border-red-400/50 text-red-800 focus:border-red-500/50 focus:ring-red-500/20 dark:border-red-500/50 dark:text-red-200 bg-red-50/10 dark:bg-red-900/10': error,
      'opacity-60 cursor-not-allowed pointer-events-none bg-white/5 dark:bg-white/[0.02]': disabled,
    },
    className
  );

  return (
    <div className="relative group">
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none blur-xl" />

      {enableShimmer && (
        <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent dark:via-white/10 opacity-0 animate-shimmer pointer-events-none z-10 rounded-lg" />
      )}

      <select
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={selectClasses}
        {...props}
      >
        {placeholder && (
          <option value="" disabled hidden>
            {placeholder}
          </option>
        )}

        {options.map((option, index) => (
          <option
            key={option.value || index}
            value={option.value}
            disabled={option.disabled}
            className="bg-white/95 text-gray-900 dark:bg-slate-800/95 dark:text-slate-100 backdrop-blur-sm"
          >
            {option.label}
          </option>
        ))}
      </select>

      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <div className="relative">
          <div className="absolute inset-0 bg-blue-400/20 dark:bg-blue-300/20 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <ChevronDownIcon
            className={cn(
              'relative h-4 w-4 transition-all duration-300',
              'group-hover:scale-110 group-hover:rotate-180',
              {
                'text-slate-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400': !error && !disabled,
                'text-red-500 dark:text-red-400': error,
                'text-slate-400 dark:text-slate-600': disabled
              }
            )}
          />
        </div>
      </div>

      {error && (
        <div className="mt-2 relative">
          <div className="absolute inset-0 bg-red-500/10 dark:bg-red-400/10 rounded-lg blur-sm" />
          <p className="relative px-3 py-2 text-sm text-red-700 dark:text-red-300 bg-red-50/50 dark:bg-red-900/20 backdrop-blur-sm rounded-lg border border-red-200/50 dark:border-red-500/30">
            {error}
          </p>
        </div>
      )}
    </div>
  );
};

export default Select;