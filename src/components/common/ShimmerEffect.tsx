// Sin brillos: el tablero no reluce. Se conserva el envoltorio para no romper llamadores.
const ShimmerEffect = ({ children, className = '' }: { children?: React.ReactNode; className?: string }) => (
  <div className={className}>{children}</div>
);

export { ShimmerEffect };
