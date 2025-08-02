// src/components/ui/button-variants.js - Variantes separadas
import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-blue-600 text-white shadow-sm hover:bg-blue-700 focus-visible:ring-blue-500/20 dark:bg-blue-600 dark:hover:bg-blue-500 dark:focus-visible:ring-blue-400/30",
        destructive:
          "bg-red-600 text-white shadow-sm hover:bg-red-700 focus-visible:ring-red-500/20 dark:focus-visible:ring-red-400/40 dark:bg-red-600 dark:hover:bg-red-500",
        outline:
          "border border-slate-300 bg-white shadow-sm hover:bg-slate-50 hover:text-slate-900 dark:bg-slate-900/30 dark:border-slate-600 dark:hover:bg-slate-800/50 dark:text-slate-100 dark:hover:text-white",
        secondary:
          "bg-slate-100 text-slate-900 shadow-sm hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700",
        ghost:
          "hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800/50 dark:hover:text-slate-100",
        link:
          "text-blue-600 underline-offset-4 hover:underline dark:text-blue-400",
        // Variantes adicionales para TuCarro
        primary:
          "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:from-blue-600 hover:to-purple-700 hover:shadow-xl transform hover:scale-105 focus-visible:ring-blue-500/20",
        glass:
          "backdrop-blur-xl bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 text-white hover:bg-white/20 dark:hover:bg-white/10 shadow-lg hover:shadow-xl",
        success:
          "bg-green-600 text-white shadow-sm hover:bg-green-700 focus-visible:ring-green-500/20 dark:bg-green-600 dark:hover:bg-green-500",
        warning:
          "bg-yellow-500 text-white shadow-sm hover:bg-yellow-600 focus-visible:ring-yellow-500/20 dark:bg-yellow-600 dark:hover:bg-yellow-500"
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5 text-xs",
        lg: "h-11 rounded-lg px-6 has-[>svg]:px-4 text-base",
        xl: "h-12 rounded-lg px-8 has-[>svg]:px-6 text-lg",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-11"
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);