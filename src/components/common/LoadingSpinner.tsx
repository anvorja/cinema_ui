// Cargando = tres aletas parpadeando (sin spinner circular).
const sizes: Record<string, string> = {
  sm: 'h-3 w-2', small: 'h-3 w-2', md: 'h-4 w-3', lg: 'h-6 w-4', large: 'h-6 w-4', xl: 'h-9 w-6',
};

const LoadingSpinner = ({
  size = 'md',
  className = '',
  text = null,
  message = null,
  centered = false,
}: { size?: string; color?: string; className?: string; text?: any; message?: any; centered?: boolean; [key: string]: any }) => {
  const displayText = text ?? message;
  const cell = `${sizes[size] || sizes.md} bg-board-amber rounded-[2px] motion-safe:animate-[pulse_900ms_ease-in-out_infinite]`;
  return (
    <div role="status" aria-live="polite" className={`flex items-center gap-3 ${centered ? 'justify-center' : ''} ${className}`}>
      <span className="flex items-end gap-1" aria-hidden="true">
        <span className={cell} />
        <span className={cell} style={{ animationDelay: '150ms' }} />
        <span className={cell} style={{ animationDelay: '300ms' }} />
      </span>
      {displayText ? <span className="font-data text-sm text-board-ink2">{displayText}</span> : <span className="sr-only">Cargando</span>}
    </div>
  );
};

export default LoadingSpinner;
