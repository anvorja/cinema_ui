// // components/ui/Button.jsx - Dark Mode optimizado
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

// // src/components/ui/Button.jsx - Shadcn convertido a JSX y adaptado
// import { forwardRef } from "react";
// import { Slot } from "@radix-ui/react-slot";
// import { cn } from "../../utils";
// import { buttonVariants } from "./button-variants";
//
// const Button = forwardRef(({
//   className,
//   variant,
//   size,
//   asChild = false,
//   loading = false,
//   children,
//   disabled,
//   as, // Soporte para as prop (como Link)
//   ...props
// }, ref) => {
//   // Si se proporciona 'as', usar ese componente, sino usar asChild logic
//   const Comp = as || (asChild ? Slot : "button");
//
//   const isDisabled = disabled || loading;
//
//   return (
//     <Comp
//       ref={ref}
//       data-slot="button"
//       className={cn(buttonVariants({ variant, size, className }))}
//       disabled={isDisabled}
//       {...props}
//     >
//       {loading && (
//         <svg
//           className="animate-spin size-4"
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
//     </Comp>
//   );
// });
//
// Button.displayName = "Button";
//
// export default Button;


// src/components/ui/Button.jsx - Shadcn simplificado sin dependencias externas
import { forwardRef } from "react";
import { cn } from "../../utils";

// Función para crear variantes (versión simplificada de CVA)
const createVariants = (base, variants, defaultVariants) => {
  return ({ variant, size, className }) => {
    const variantClass = variants.variant[variant] || variants.variant[defaultVariants.variant];
    const sizeClass = variants.size[size] || variants.size[defaultVariants.size];

    return cn(base, variantClass, sizeClass, className);
  };
};

const buttonVariants = createVariants(
  // Base classes
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-offset-2",

  // Variants
  {
    variant: {
      default:
        "bg-blue-600 text-white shadow-sm hover:bg-blue-700 focus:ring-blue-500 dark:bg-blue-600 dark:hover:bg-blue-500",
      destructive:
        "bg-red-600 text-white shadow-sm hover:bg-red-700 focus:ring-red-500 dark:bg-red-600 dark:hover:bg-red-500",
      outline:
        "border border-slate-300 bg-white shadow-sm hover:bg-slate-50 hover:text-slate-900 dark:bg-slate-900/30 dark:border-slate-600 dark:hover:bg-slate-800/50 dark:text-slate-100 dark:hover:text-white",
      secondary:
        "bg-slate-100 text-slate-900 shadow-sm hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700",
      ghost:
        "hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800/50 dark:hover:text-slate-100",
      link:
        "text-blue-600 underline-offset-4 hover:underline dark:text-blue-400",
      // Variantes especiales para TuCarro
      primary:
        "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:from-blue-600 hover:to-purple-700 hover:shadow-xl transform hover:scale-105",
      glass:
        "backdrop-blur-xl bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 text-white hover:bg-white/20 dark:hover:bg-white/10 shadow-lg hover:shadow-xl",
      success:
        "bg-green-600 text-white shadow-sm hover:bg-green-700 focus:ring-green-500",
      warning:
        "bg-yellow-500 text-white shadow-sm hover:bg-yellow-600 focus:ring-yellow-500"
    },
    size: {
      default: "h-9 px-4 py-2",
      sm: "h-8 px-3 text-xs rounded-md",
      lg: "h-11 px-6 text-base rounded-lg",
      xl: "h-12 px-8 text-lg rounded-lg",
      icon: "h-9 w-9",
      "icon-sm": "h-8 w-8",
      "icon-lg": "h-11 w-11"
    }
  },

  // Default variants
  {
    variant: "default",
    size: "default"
  }
);

const Button = forwardRef(({
  className,
  variant = "default",
  size = "default",
  loading = false,
  children,
  disabled,
  as: Component = "button", // Soporte para as prop
  ...props
}, ref) => {

  const isDisabled = disabled || loading;

  return (
    <Component
      ref={ref}
      className={buttonVariants({ variant, size, className })}
      disabled={isDisabled}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin h-4 w-4 mr-2"
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
    </Component>
  );
});

Button.displayName = "Button";

export default Button;