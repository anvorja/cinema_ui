// components/ui/Input.jsx - Dark Mode optimizado
import { forwardRef } from 'react';
import { cn } from '../../utils';

const Input = forwardRef(({
  className = '',
  label,
  error,
  helper,
  type = 'text',
  disabled = false,
  required = false,
  ...props
}, ref) => {
  const inputClasses = cn(
    `
      w-full px-3 py-2 border rounded-lg shadow-sm transition-all duration-200
      placeholder-gray-400 dark:placeholder-slate-400
      focus:outline-none focus:ring-2 focus:ring-offset-1
      disabled:opacity-50 disabled:cursor-not-allowed
    `,
    error
      ? `
          border-red-300 dark:border-red-600 text-red-900 dark:text-red-100 
          bg-red-50 dark:bg-red-900/20 focus:border-red-500 dark:focus:border-red-400 
          focus:ring-red-500 dark:focus:ring-red-400
        `
      : `
          border-gray-300 dark:border-slate-600 text-gray-900 dark:text-slate-100 
          bg-white dark:bg-slate-800 focus:border-primary-500 dark:focus:border-primary-400 
          focus:ring-primary-500 dark:focus:ring-primary-400
        `,
    className
  );

  const labelClasses = cn(
    'block text-sm font-medium mb-2 transition-colors duration-200',
    error
      ? 'text-red-700 dark:text-red-300'
      : 'text-gray-700 dark:text-slate-300'
  );

  const helperClasses = cn(
    'mt-1 text-xs transition-colors duration-200',
    error
      ? 'text-red-600 dark:text-red-400'
      : 'text-gray-500 dark:text-slate-400'
  );

  return (
    <div className="w-full">
      {label && (
        <label className={labelClasses}>
          {label}
          {required && (
            <span className="text-red-500 dark:text-red-400 ml-1">*</span>
          )}
        </label>
      )}

      <input
        ref={ref}
        type={type}
        disabled={disabled}
        className={inputClasses}
        {...props}
      />

      {(error || helper) && (
        <p className={helperClasses}>
          {error || helper}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;