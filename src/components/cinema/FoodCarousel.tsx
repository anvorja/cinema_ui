// Combos destacados: una ficha grande con lista de selección.
import { useState, useEffect, useCallback } from 'react';

const FoodCarousel = ({ combos = [], autoPlay = true, interval = 7000 }: { combos?: any[]; autoPlay?: boolean; interval?: number }) => {
  const [index, setIndex] = useState(0);
  const [hovering, setHovering] = useState(false);
  const reduced = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  const next = useCallback(() => setIndex(i => (i + 1) % Math.max(combos.length, 1)), [combos.length]);

  useEffect(() => {
    if (!autoPlay || hovering || reduced || combos.length <= 1) return;
    const id = window.setInterval(next, interval);
    return () => clearInterval(id);
  }, [autoPlay, hovering, reduced, next, interval, combos.length]);

  if (!combos.length) return null;
  const combo = combos[index];

  return (
    <section
      aria-label="Combos destacados"
      className="border-b border-board-line"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onFocus={() => setHovering(true)}
      onBlur={() => setHovering(false)}
    >
      <div className="mx-auto grid max-w-[1400px] gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,520px)] lg:py-12">
        <div className="order-2 flex flex-col justify-between gap-8 lg:order-1">
          <div>
            <h1 className="font-board text-5xl font-bold leading-[0.95] tracking-wide uppercase sm:text-6xl">{combo.name}</h1>
            <p className="mt-4 max-w-[60ch] text-[17px] leading-relaxed text-board-ink2">{combo.description}</p>
            {combo.price && (
              <p className="mt-5 font-data text-3xl font-bold text-board-amberink">${combo.price.toLocaleString('es-CO')}</p>
            )}
          </div>

          <ol className="border-t border-board-line" aria-label="Otros combos">
            {combos.map((c, i) => (
              <li key={c.id} className="border-b border-board-line">
                <button
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-current={i === index ? 'true' : undefined}
                  className={`flex min-h-[48px] w-full items-center gap-3 px-2 text-left ${i === index ? 'bg-board-panel2 text-board-ink' : 'text-board-mute hover:text-board-ink'}`}
                >
                  <span className={`font-data text-xs font-bold ${i === index ? 'text-board-amberink' : ''}`}>{String(i + 1).padStart(2, '0')}</span>
                  <span className="flex-1 truncate font-board text-xl font-semibold tracking-wide uppercase">{c.name}</span>
                  {c.price && <span className="font-data text-sm">${c.price.toLocaleString('es-CO')}</span>}
                </button>
              </li>
            ))}
          </ol>
        </div>

        <div className="order-1 border border-board-line bg-board-panel p-1.5 lg:order-2">
          <img key={combo.id} src={combo.image} alt={combo.name} className="aspect-[4/3] w-full object-cover" />
        </div>
      </div>
    </section>
  );
};

export default FoodCarousel;
