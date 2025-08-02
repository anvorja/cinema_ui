// src/components/ui/Avatar.jsx
import { forwardRef, useState } from "react";
import { cn } from "../../utils";

const Avatar = forwardRef(({ className, children, size = "default", ...props }, ref) => {
  const sizeClasses = {
    sm: "size-6",
    default: "size-8",
    lg: "size-12",
    xl: "size-16",
    "2xl": "size-24"
  };

  return (
    <div
      ref={ref}
      className={cn(
        "relative flex shrink-0 overflow-hidden rounded-full",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
Avatar.displayName = "Avatar";

const AvatarImage = forwardRef(({ className, src, alt, onError, ...props }, ref) => {
  const [hasError, setHasError] = useState(false);

  const handleError = (e) => {
    setHasError(true);
    if (onError) onError(e);
  };

  if (hasError || !src) {
    return null;
  }

  return (
    <img
      ref={ref}
      src={src}
      alt={alt}
      className={cn("aspect-square size-full object-cover", className)}
      onError={handleError}
      {...props}
    />
  );
});
AvatarImage.displayName = "AvatarImage";

const AvatarFallback = forwardRef(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "bg-slate-100 dark:bg-slate-800 flex size-full items-center justify-center rounded-full text-slate-900 dark:text-slate-100 font-medium text-sm select-none",
      className
    )}
    {...props}
  >
    {children}
  </div>
));
AvatarFallback.displayName = "AvatarFallback";

export { Avatar, AvatarImage, AvatarFallback };