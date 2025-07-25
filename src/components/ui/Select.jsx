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
  ...props
}) => {
  // Tamaños del select
  const sizeClasses = {
    sm: 'h-8 text-sm px-2',
    md: 'h-10 text-sm px-3',
    lg: 'h-12 text-base px-4'
  };

  const selectClasses = cn(
    // Estilos base
    'relative w-full rounded-md border appearance-none bg-white pr-8',
    'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 focus:border-primary-500',
    'transition-colors duration-200',

    // Tamaños
    sizeClasses[size],

    // Estados
    {
      'border-gray-300 text-gray-900': !error && !disabled,
      'border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500': error,
      'border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed': disabled,
    },

    className
  );

  return (
    <div className="relative">
      <select
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={selectClasses}
        {...props}
      >
        {/* Placeholder option */}
        {placeholder && (
          <option value="" disabled hidden>
            {placeholder}
          </option>
        )}

        {/* Options */}
        {options.map((option, index) => (
          <option
            key={option.value || index}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>

      {/* Icono de flecha */}
      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
        <ChevronDownIcon
          className={cn(
            'h-4 w-4',
            {
              'text-gray-400': !error && !disabled,
              'text-red-400': error,
              'text-gray-300': disabled
            }
          )}
        />
      </div>

      {/* Mensaje de error */}
      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

export default Select;