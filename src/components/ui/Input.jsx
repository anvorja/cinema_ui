// src/components/ui/Input.jsx
import { forwardRef } from 'react';
import { cn } from '../../utils';

const Input = forwardRef(({
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  onFocus,
  error,
  disabled = false,
  required = false,
  size = 'md',
  className,
  name,
  id,
  autoComplete,
  maxLength,
  minLength,
  pattern,
  min,
  max,
  step,
  readOnly = false,
  autoFocus = false,
  ...props
}, ref) => {

  // Tamaños del input
  const sizeClasses = {
    sm: 'h-8 text-sm px-2',
    md: 'h-10 text-sm px-3',
    lg: 'h-12 text-base px-4'
  };

  const inputClasses = cn(
    // Estilos base
    'w-full rounded-md border shadow-sm',
    'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 focus:border-primary-500',
    'transition-colors duration-200',
    'placeholder:text-gray-400',

    // Tamaños
    sizeClasses[size],

    // Estados
    {
      'border-gray-300 text-gray-900 bg-white': !error && !disabled && !readOnly,
      'border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500 bg-white': error && !disabled,
      'border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed': disabled,
      'border-gray-200 bg-gray-50 text-gray-700': readOnly && !disabled,
    },

    className
  );

  return (
    <div className="w-full">
      <input
        ref={ref}
        type={type}
        name={name}
        id={id || name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        readOnly={readOnly}
        autoComplete={autoComplete}
        autoFocus={autoFocus}
        maxLength={maxLength}
        minLength={minLength}
        pattern={pattern}
        min={min}
        max={max}
        step={step}
        className={inputClasses}
        {...props}
      />

      {/* Mensaje de error */}
      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;