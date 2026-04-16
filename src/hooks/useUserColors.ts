// Hook para generar colores dinámicos basados en email/identificador del usuario
const COLOR_PALETTES = [
  { from: '#6366f1', via: '#8b5cf6', to: '#a78bfa' },
  { from: '#3b82f6', via: '#06b6d4', to: '#0ea5e9' },
  { from: '#10b981', via: '#14b8a6', to: '#0d9488' },
  { from: '#f59e0b', via: '#f97316', to: '#ef4444' },
  { from: '#ec4899', via: '#d946ef', to: '#a855f7' },
  { from: '#14b8a6', via: '#0ea5e9', to: '#6366f1' },
];

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) & 0xffffffff;
  }
  return Math.abs(hash);
}

export function useUserColors(identifier?: string) {
  const index = identifier ? hashString(identifier) % COLOR_PALETTES.length : 0;
  return COLOR_PALETTES[index];
}

export default useUserColors;
