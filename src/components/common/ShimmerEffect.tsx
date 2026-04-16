// src/components/effects/ShimmerEffect.jsx

const ShimmerEffect = ({ children, className = "" }) => {
  return (
    <div className={`relative overflow-hidden rounded-xl ${className}`}>
      <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 animate-shimmer" />
      {children}
    </div>
  );
};

export { ShimmerEffect };