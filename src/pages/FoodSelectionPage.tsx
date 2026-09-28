// src/pages/FoodSelectionPage.jsx
// Step 3: Optional food & drinks selection before payment
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, PlusIcon, MinusIcon } from '@heroicons/react/24/outline';
import { optimizeCloudinaryUrl } from '../utils/movieUtils';
import { usePricing } from '../hooks/usePricing';
import BookingSteps from '../components/board/BookingSteps';

const formatCOP = (n) => `$${Number(n).toLocaleString('es-CO')}`;

// El menú y sus precios vienen de booking-service (GET /purchases/pricing):
// son los mismos con que se calcula el cobro.

// ── Component ─────────────────────────────────────────────────────────────────
const FoodSelectionPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [activeCategory, setActiveCategory] = useState('Confitería');
  const [cart, setCart] = useState<Record<string, number>>({});

  const {
    movie, theater, showtime, selectedDate,
    selectedSeats = [],
    generalCount  = 0,
    prefCount     = 0,
    ticketCount   = 0,
  } = state || {};

  const { data: pricing, isError: pricingError } = usePricing(movie?.id);

  if (!movie || !theater) {
    navigate('/cartelera');
    return null;
  }

  const getQty    = (id) => cart[id] || 0;
  const addItem   = (id) => setCart(c => ({ ...c, [id]: (c[id] || 0) + 1 }));
  const removeItem = (id) => setCart(c => {
    const n = { ...c };
    if (n[id] > 1) n[id]--;
    else delete n[id];
    return n;
  });

  const allItems   = pricing?.concessions ?? [];
  const categories = [...new Set(allItems.map(i => i.category))];
  const category   = categories.includes(activeCategory) ? activeCategory : categories[0];

  const generalPrice = pricing?.ticket_prices.general ?? 0;
  const prefPrice    = pricing?.ticket_prices.preferential ?? 0;
  const ticketTotal  = generalCount * generalPrice + prefCount * prefPrice;
  const foodTotal = Object.entries(cart).reduce((acc, [code, qty]) => {
    const item = allItems.find(i => i.code === code);
    return acc + (item ? item.price * qty : 0);
  }, 0);

  const SERVICE_FEE  = foodTotal > 0 ? (pricing?.service_fee_with_concessions ?? 0) : 0;
  const grandWithFee = ticketTotal + foodTotal + SERVICE_FEE;

  const cartItems = Object.entries(cart)
    .filter(([, qty]) => qty > 0)
    .map(([code, qty]) => ({ item: allItems.find(i => i.code === code), qty }))
    .filter(({ item }) => !!item);
  // Lo único que viaja al backend: códigos y cantidades, nunca precios.
  const concessions = cartItems.map(({ item, qty }) => ({ code: item!.code, quantity: qty }));

  const poster = optimizeCloudinaryUrl(movie.images?.poster || movie.posterImage || '', 300);
  const title  = movie.title || '';

  const handleContinue = () => {
    if (!pricing) return;
    navigate('/payment', {
      state: {
        movie, theater, showtime, selectedDate,
        selectedSeats, generalCount, prefCount, ticketCount,
        concessions,
      },
    });
  };

  const handleSkip = () => {
    if (!pricing) return;
    navigate('/payment', {
      state: {
        movie, theater, showtime, selectedDate,
        selectedSeats, generalCount, prefCount, ticketCount,
        concessions: [],
      },
    });
  };

  const items = allItems.filter(i => i.category === category);

  // ── Resumen del pedido (tiquete) ───────────────────────────────────────────
  const summary = (
    <div className="b-stub p-5" style={{ ['--stub-cut' as any]: '72%' }}>
      <div className="mb-4 flex items-center gap-3">
        {poster && <img src={poster} alt="" className="h-14 w-10 flex-shrink-0 border border-board-line object-cover" />}
        <h3 className="font-board text-2xl font-bold leading-none tracking-wide uppercase">{title}</h3>
      </div>

      <ul className="space-y-1.5 border-t border-dashed border-board-line2 pt-3 font-data text-sm text-board-ink2">
        {generalCount > 0 && (
          <li className="flex justify-between gap-3"><span>{generalCount} silla{generalCount > 1 ? 's' : ''} general</span><span>{formatCOP(generalCount * generalPrice)}</span></li>
        )}
        {prefCount > 0 && (
          <li className="flex justify-between gap-3"><span>{prefCount} silla{prefCount > 1 ? 's' : ''} preferencial</span><span>{formatCOP(prefCount * prefPrice)}</span></li>
        )}
        {cartItems.map(({ item, qty }) => (
          <li key={item!.code} className="flex justify-between gap-3">
            <span className="truncate">{qty}× {item!.name}</span>
            <span className="flex-shrink-0">{formatCOP(item!.price * qty)}</span>
          </li>
        ))}
      </ul>

      <dl className="mt-4 space-y-1 border-t border-dashed border-board-line2 pt-3 font-data text-sm">
        <div className="flex justify-between text-board-mute"><dt>Subtotal</dt><dd>{formatCOP(ticketTotal + foodTotal)}</dd></div>
        <div className="flex justify-between text-board-mute"><dt>Valor por servicio</dt><dd>{formatCOP(SERVICE_FEE)}</dd></div>
        <div className="flex justify-between pt-2 text-lg font-bold"><dt>Total</dt><dd className="text-board-amberink">{formatCOP(grandWithFee)}</dd></div>
      </dl>

      <button
        type="button"
        onClick={handleContinue}
        disabled={!pricing}
        className="mt-5 h-14 w-full rounded-[3px] bg-board-amber font-board text-lg font-bold tracking-[0.08em] text-board-onamber hover:bg-board-amberpress disabled:opacity-40"
      >
        CONTINUAR AL PAGO
      </button>
      <button
        type="button"
        onClick={handleSkip}
        disabled={!pricing}
        className="mt-1 min-h-[44px] w-full font-data text-sm text-board-mute underline hover:text-board-ink"
      >
        Saltar la comida
      </button>
    </div>
  );

  const stepBtn = 'flex h-11 w-11 items-center justify-center rounded-[3px] border border-board-line2 text-board-ink hover:border-board-amber';

  return (
    <div className="pb-24 lg:pb-0">
      <BookingSteps current="Comida" />

      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* ── Menú ── */}
          <div className="min-w-0 flex-1">
            <h1 className="mb-2 font-board text-3xl font-bold tracking-[0.06em] uppercase">Comida y bebidas</h1>
            <p className="mb-5 max-w-[65ch] text-[15px] leading-relaxed text-board-ink2">
              Presenta tu tiquete de compra y preparamos tu pedido. Lo que compres aquí vale 8 días desde la fecha de compra.
            </p>

            <div role="tablist" aria-label="Categorías del menú" className="mb-5 flex gap-1 overflow-x-auto border-b border-board-line">
              {categories.map(cat => (
                <button
                  key={cat}
                  role="tab"
                  aria-selected={category === cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`min-h-[48px] whitespace-nowrap border-b-2 px-4 font-board text-xl font-bold tracking-[0.08em] uppercase ${
                    category === cat ? 'border-board-amber text-board-ink' : 'border-transparent text-board-mute hover:text-board-ink'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {!pricing && (
              <p role={pricingError ? 'alert' : 'status'} className={`py-6 font-data text-sm ${pricingError ? 'text-board-alarmink' : 'text-board-ink2'}`}>
                {pricingError ? 'No pudimos cargar el menú. Intenta de nuevo en un momento.' : 'Cargando el menú…'}
              </p>
            )}

            <ul className="grid gap-x-8 border-t border-board-line2 md:grid-cols-2">
              {items.map(item => {
                const qty = getQty(item.code);
                return (
                  <li key={item.code} className="flex items-center gap-3 border-b border-board-line py-4">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-board text-xl font-bold leading-tight tracking-wide uppercase">{item.name}</h3>
                      {item.description && <p className="mt-0.5 line-clamp-2 text-sm text-board-mute">{item.description}</p>}
                      <p className="mt-1 font-data text-sm font-bold text-board-amberink">{formatCOP(item.price)}</p>
                    </div>
                    {qty === 0 ? (
                      <button
                        type="button"
                        onClick={() => addItem(item.code)}
                        aria-label={`Agregar ${item.name}`}
                        className="flex h-11 items-center gap-1 rounded-[3px] border border-board-amber px-3 font-board text-base font-bold tracking-[0.08em] text-board-amberink hover:bg-board-amber hover:text-board-onamber"
                      >
                        <PlusIcon className="h-4 w-4" /> AGREGAR
                      </button>
                    ) : (
                      <div className="flex items-center gap-1" role="group" aria-label={`Cantidad de ${item.name}`}>
                        <button type="button" onClick={() => removeItem(item.code)} className={stepBtn} aria-label={`Quitar ${item.name}`}><MinusIcon className="h-4 w-4" /></button>
                        <span className="w-8 text-center font-data text-lg font-bold" aria-live="polite">{qty}</span>
                        <button type="button" onClick={() => addItem(item.code)} className={`${stepBtn} !border-board-amber !bg-board-amber !text-board-onamber`} aria-label={`Agregar otro ${item.name}`}><PlusIcon className="h-4 w-4" /></button>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="mt-6 flex h-12 items-center gap-2 rounded-[3px] border border-board-line2 px-4 text-board-ink2 hover:border-board-ink hover:text-board-ink"
            >
              <ArrowLeftIcon className="h-5 w-5" /> <span className="font-board text-lg font-bold tracking-[0.08em]">ATRÁS</span>
            </button>
          </div>

          {/* ── Resumen escritorio ── */}
          <aside className="hidden w-80 flex-shrink-0 lg:block" aria-label="Resumen del pedido">
            <div className="sticky top-20">{summary}</div>
          </aside>
        </div>

        {/* ── Resumen móvil ── */}
        <aside className="mt-8 lg:hidden" aria-label="Resumen del pedido">{summary}</aside>
      </div>

      {/* ── Barra móvil ── */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-3 border-t border-board-line2 bg-board-ground px-4 py-3 lg:hidden">
        <div className="min-w-0 flex-1 font-data">
          <p className="text-xs text-board-mute">Total</p>
          <p className="text-lg font-bold text-board-amberink">{formatCOP(grandWithFee)}</p>
        </div>
        <button type="button" onClick={handleSkip} className="h-14 rounded-[3px] border border-board-line2 px-4 font-board text-lg font-bold tracking-[0.08em] text-board-ink2">SALTAR</button>
        <button type="button" onClick={handleContinue} className="h-14 rounded-[3px] bg-board-amber px-6 font-board text-lg font-bold tracking-[0.08em] text-board-onamber">PAGAR</button>
      </div>
    </div>
  );
};

export default FoodSelectionPage;
