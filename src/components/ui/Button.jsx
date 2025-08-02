// // // components/ui/Button.jsx - Dark Mode optimizado
// import { forwardRef } from 'react';
// import { cn } from '../../utils';
//
// const Button = forwardRef(({
//   className = '',
//   variant = 'primary',
//   size = 'md',
//   disabled = false,
//   loading = false,
//   children,
//     // eslint-disable-next-line no-unused-vars
//   as: Component = 'button',
//   ...props
// }, ref) => {
//   const baseClasses = `
//     inline-flex items-center justify-center font-medium rounded-lg
//     transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
//     disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
//   `;
//
//   const variants = {
//     primary: `
//       bg-primary-600 hover:bg-primary-700 active:bg-primary-800
//       text-white shadow-md hover:shadow-lg
//       focus:ring-primary-500 dark:focus:ring-primary-400
//       dark:bg-primary-600 dark:hover:bg-primary-500 dark:active:bg-primary-700
//     `,
//     secondary: `
//       bg-gray-100 hover:bg-gray-200 active:bg-gray-300
//       text-gray-700 border border-gray-300
//       focus:ring-gray-500 dark:focus:ring-gray-400
//       dark:bg-slate-700 dark:hover:bg-slate-600 dark:active:bg-slate-500
//       dark:text-slate-200 dark:border-slate-600
//     `,
//     ghost: `
//       bg-transparent hover:bg-gray-100 active:bg-gray-200
//       text-gray-700
//       focus:ring-gray-500 dark:focus:ring-gray-400
//       dark:hover:bg-slate-800 dark:active:bg-slate-700
//       dark:text-slate-300
//     `,
//     danger: `
//       bg-red-600 hover:bg-red-700 active:bg-red-800
//       text-white shadow-md hover:shadow-lg
//       focus:ring-red-500 dark:focus:ring-red-400
//       dark:bg-red-600 dark:hover:bg-red-500 dark:active:bg-red-700
//     `,
//     success: `
//       bg-green-600 hover:bg-green-700 active:bg-green-800
//       text-white shadow-md hover:shadow-lg
//       focus:ring-green-500 dark:focus:ring-green-400
//       dark:bg-green-600 dark:hover:bg-green-500 dark:active:bg-green-700
//     `,
//     warning: `
//       bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-700
//       text-white shadow-md hover:shadow-lg
//       focus:ring-yellow-500 dark:focus:ring-yellow-400
//       dark:bg-yellow-600 dark:hover:bg-yellow-500 dark:active:bg-yellow-700
//     `
//   };
//
//   const sizes = {
//     sm: 'px-3 py-1.5 text-sm',
//     md: 'px-4 py-2 text-sm',
//     lg: 'px-6 py-3 text-base',
//     xl: 'px-8 py-4 text-lg'
//   };
//
//   const classes = cn(
//     baseClasses,
//     variants[variant],
//     sizes[size],
//     className
//   );
//
//   return (
//     <Component
//       ref={ref}
//       className={classes}
//       disabled={disabled || loading}
//       {...props}
//     >
//       {loading && (
//         <svg
//           className="animate-spin -ml-1 mr-2 h-4 w-4"
//           xmlns="http://www.w3.org/2000/svg"
//           fill="none"
//           viewBox="0 0 24 24"
//         >
//           <circle
//             className="opacity-25"
//             cx="12"
//             cy="12"
//             r="10"
//             stroke="currentColor"
//             strokeWidth="4"
//           />
//           <path
//             className="opacity-75"
//             fill="currentColor"
//             d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//           />
//         </svg>
//       )}
//       {children}
//     </Component>
//   );
// });
//
// Button.displayName = 'Button';
//
// export default Button;
//









// // components/ui/Button.jsx - Con soporte robusto para asChild
// import { forwardRef } from 'react';
// import { Slot } from '@radix-ui/react-slot';
// import { cn } from '../../utils';
//
// const Button = forwardRef(({
//   className = '',
//   variant = 'primary',
//   size = 'md',
//   disabled = false,
//   loading = false,
//   children,
//   asChild = false,
//   ...props
// }, ref) => {
//   const baseClasses = `
//     inline-flex items-center justify-center font-medium rounded-lg
//     transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
//     disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
//   `;
//
//   const variants = {
//     primary: `
//       bg-primary-600 hover:bg-primary-700 active:bg-primary-800
//       text-white shadow-md hover:shadow-lg
//       focus:ring-primary-500 dark:focus:ring-primary-400
//       dark:bg-primary-600 dark:hover:bg-primary-500 dark:active:bg-primary-700
//     `,
//     secondary: `
//       bg-gray-100 hover:bg-gray-200 active:bg-gray-300
//       text-gray-700 border border-gray-300
//       focus:ring-gray-500 dark:focus:ring-gray-400
//       dark:bg-slate-700 dark:hover:bg-slate-600 dark:active:bg-slate-500
//       dark:text-slate-200 dark:border-slate-600
//     `,
//     ghost: `
//       bg-transparent hover:bg-gray-100 active:bg-gray-200
//       text-gray-700
//       focus:ring-gray-500 dark:focus:ring-gray-400
//       dark:hover:bg-slate-800 dark:active:bg-slate-700
//       dark:text-slate-300
//     `,
//     danger: `
//       bg-red-600 hover:bg-red-700 active:bg-red-800
//       text-white shadow-md hover:shadow-lg
//       focus:ring-red-500 dark:focus:ring-red-400
//       dark:bg-red-600 dark:hover:bg-red-500 dark:active:bg-red-700
//     `,
//     success: `
//       bg-green-600 hover:bg-green-700 active:bg-green-800
//       text-white shadow-md hover:shadow-lg
//       focus:ring-green-500 dark:focus:ring-green-400
//       dark:bg-green-600 dark:hover:bg-green-500 dark:active:bg-green-700
//     `,
//     warning: `
//       bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-700
//       text-white shadow-md hover:shadow-lg
//       focus:ring-yellow-500 dark:focus:ring-yellow-400
//       dark:bg-yellow-600 dark:hover:bg-yellow-500 dark:active:bg-yellow-700
//     `
//   };
//
//   const sizes = {
//     sm: 'px-3 py-1.5 text-sm',
//     md: 'px-4 py-2 text-sm',
//     lg: 'px-6 py-3 text-base',
//     xl: 'px-8 py-4 text-lg'
//   };
//
//   const classes = cn(
//     baseClasses,
//     variants[variant],
//     sizes[size],
//     className
//   );
//
//   // Si asChild es true, usar Slot para renderizar como el componente hijo
//   // Si no, usar button normal
//   const Component = asChild ? Slot : 'button';
//
//   // Si hay loading y asChild, mostrar advertencia en desarrollo
//   if (asChild && loading && process.env.NODE_ENV === 'development') {
//     console.warn('Button: asChild=true no es compatible con loading=true. El spinner no se mostrará.');
//   }
//
//   // Cuando asChild es true, no debemos añadir el spinner porque Slot
//   // espera solo un elemento hijo directo
//   const content = asChild ? children : (
//     <>
//       {loading && (
//         <svg
//           className="animate-spin -ml-1 mr-2 h-4 w-4"
//           xmlns="http://www.w3.org/2000/svg"
//           fill="none"
//           viewBox="0 0 24 24"
//         >
//           <circle
//             className="opacity-25"
//             cx="12"
//             cy="12"
//             r="10"
//             stroke="currentColor"
//             strokeWidth="4"
//           />
//           <path
//             className="opacity-75"
//             fill="currentColor"
//             d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//           />
//         </svg>
//       )}
//       {children}
//     </>
//   );
//
//   return (
//     <Component
//       ref={ref}
//       className={classes}
//       disabled={disabled || loading}
//       {...props}
//     >
//       {content}
//     </Component>
//   );
// });
//
// Button.displayName = 'Button';
//
// export default Button;




// // components/ui/Button.jsx - Con soporte robusto para asChild
// import { forwardRef } from 'react';
// import { Slot } from '@radix-ui/react-slot';
// import PropTypes from 'prop-types';
// import { cn } from '../../utils';
//
// const Button = forwardRef(({
//   className = '',
//   variant = 'primary',
//   size = 'md',
//   disabled = false,
//   loading = false,
//   children,
//   asChild = false,
//   ...props
// }, ref) => {
//   const baseClasses = `
//     inline-flex items-center justify-center font-medium rounded-lg
//     transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
//     disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
//   `;
//
//   const variants = {
//     primary: `
//       bg-primary-600 hover:bg-primary-700 active:bg-primary-800
//       text-white shadow-md hover:shadow-lg
//       focus:ring-primary-500 dark:focus:ring-primary-400
//       dark:bg-primary-600 dark:hover:bg-primary-500 dark:active:bg-primary-700
//     `,
//     secondary: `
//       bg-gray-100 hover:bg-gray-200 active:bg-gray-300
//       text-gray-700 border border-gray-300
//       focus:ring-gray-500 dark:focus:ring-gray-400
//       dark:bg-slate-700 dark:hover:bg-slate-600 dark:active:bg-slate-500
//       dark:text-slate-200 dark:border-slate-600
//     `,
//     ghost: `
//       bg-transparent hover:bg-gray-100 active:bg-gray-200
//       text-gray-700
//       focus:ring-gray-500 dark:focus:ring-gray-400
//       dark:hover:bg-slate-800 dark:active:bg-slate-700
//       dark:text-slate-300
//     `,
//     danger: `
//       bg-red-600 hover:bg-red-700 active:bg-red-800
//       text-white shadow-md hover:shadow-lg
//       focus:ring-red-500 dark:focus:ring-red-400
//       dark:bg-red-600 dark:hover:bg-red-500 dark:active:bg-red-700
//     `,
//     success: `
//       bg-green-600 hover:bg-green-700 active:bg-green-800
//       text-white shadow-md hover:shadow-lg
//       focus:ring-green-500 dark:focus:ring-green-400
//       dark:bg-green-600 dark:hover:bg-green-500 dark:active:bg-green-700
//     `,
//     warning: `
//       bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-700
//       text-white shadow-md hover:shadow-lg
//       focus:ring-yellow-500 dark:focus:ring-yellow-400
//       dark:bg-yellow-600 dark:hover:bg-yellow-500 dark:active:bg-yellow-700
//     `
//   };
//
//   const sizes = {
//     sm: 'px-3 py-1.5 text-sm',
//     md: 'px-4 py-2 text-sm',
//     lg: 'px-6 py-3 text-base',
//     xl: 'px-8 py-4 text-lg'
//   };
//
//   const classes = cn(
//     baseClasses,
//     variants[variant],
//     sizes[size],
//     className
//   );
//
//   // Si asChild es true, usar Slot para renderizar como el componente hijo
//   // Si no, usar button normal
//   const Component = asChild ? Slot : 'button';
//
//   // Si hay loading y asChild, mostrar advertencia en desarrollo
//   if (asChild && loading && import.meta.env.DEV) {
//     console.warn('Button: asChild=true no es compatible con loading=true. El spinner no se mostrará.');
//   }
//
//   // Cuando asChild es true, no debemos añadir el spinner porque Slot
//   // espera solo un elemento hijo directo
//   const content = asChild ? children : (
//     <>
//       {loading && (
//         <svg
//           className="animate-spin -ml-1 mr-2 h-4 w-4"
//           xmlns="http://www.w3.org/2000/svg"
//           fill="none"
//           viewBox="0 0 24 24"
//         >
//           <circle
//             className="opacity-25"
//             cx="12"
//             cy="12"
//             r="10"
//             stroke="currentColor"
//             strokeWidth="4"
//           />
//           <path
//             className="opacity-75"
//             fill="currentColor"
//             d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//           />
//         </svg>
//       )}
//       {children}
//     </>
//   );
//
//   return (
//     <Component
//       ref={ref}
//       className={classes}
//       disabled={disabled || loading}
//       {...props}
//     >
//       {content}
//     </Component>
//   );
// });
//
// Button.displayName = 'Button';
//
// // PropTypes para validación
// Button.propTypes = {
//   className: PropTypes.string,
//   variant: PropTypes.oneOf(['primary', 'secondary', 'ghost', 'danger', 'success', 'warning']),
//   size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
//   disabled: PropTypes.bool,
//   loading: PropTypes.bool,
//   children: PropTypes.node,
//   asChild: PropTypes.bool,
// };
//
// export default Button;




// components/ui/Button.jsx - Con soporte robusto para asChild
import { forwardRef } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '../../utils';

const Button = forwardRef(({
  className = '',
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  children,
  asChild = false,
  ...props
}, ref) => {
  const baseClasses = `
    inline-flex items-center justify-center font-medium rounded-lg
    transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
  `;

  const variants = {
    primary: `
      bg-primary-600 hover:bg-primary-700 active:bg-primary-800
      text-white shadow-md hover:shadow-lg
      focus:ring-primary-500 dark:focus:ring-primary-400
      dark:bg-primary-600 dark:hover:bg-primary-500 dark:active:bg-primary-700
    `,
    secondary: `
      bg-gray-100 hover:bg-gray-200 active:bg-gray-300
      text-gray-700 border border-gray-300
      focus:ring-gray-500 dark:focus:ring-gray-400
      dark:bg-slate-700 dark:hover:bg-slate-600 dark:active:bg-slate-500
      dark:text-slate-200 dark:border-slate-600
    `,
    ghost: `
      bg-transparent hover:bg-gray-100 active:bg-gray-200
      text-gray-700
      focus:ring-gray-500 dark:focus:ring-gray-400
      dark:hover:bg-slate-800 dark:active:bg-slate-700
      dark:text-slate-300
    `,
    danger: `
      bg-red-600 hover:bg-red-700 active:bg-red-800
      text-white shadow-md hover:shadow-lg
      focus:ring-red-500 dark:focus:ring-red-400
      dark:bg-red-600 dark:hover:bg-red-500 dark:active:bg-red-700
    `,
    success: `
      bg-green-600 hover:bg-green-700 active:bg-green-800
      text-white shadow-md hover:shadow-lg
      focus:ring-green-500 dark:focus:ring-green-400
      dark:bg-green-600 dark:hover:bg-green-500 dark:active:bg-green-700
    `,
    warning: `
      bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-700
      text-white shadow-md hover:shadow-lg
      focus:ring-yellow-500 dark:focus:ring-yellow-400
      dark:bg-yellow-600 dark:hover:bg-yellow-500 dark:active:bg-yellow-700
    `
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg'
  };

  const classes = cn(
    baseClasses,
    variants[variant],
    sizes[size],
    className
  );

  // Si asChild es true, usar Slot para renderizar como el componente hijo
  // Si no, usar button normal
  const Component = asChild ? Slot : 'button';

  // Si hay loading y asChild, mostrar advertencia en desarrollo
  if (asChild && loading && import.meta.env.DEV) {
    console.warn('Button: asChild=true no es compatible con loading=true. El spinner no se mostrará.');
  }

  // Cuando asChild es true, no debemos añadir el spinner porque Slot
  // espera solo un elemento hijo directo
  const content = asChild ? children : (
    <>
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </>
  );


  return (
    <Component
      ref={ref}
      className={classes}
      disabled={disabled || loading}
      {...props}
    >
      {content}
    </Component>
  );
});

Button.displayName = 'Button';

export default Button;