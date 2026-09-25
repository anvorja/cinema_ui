// src/pages/FoodSelectionPage.jsx
// Step 3: Optional food & drinks selection before payment
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, PlusIcon, MinusIcon } from '@heroicons/react/24/outline';
import { optimizeCloudinaryUrl } from '../utils/movieUtils';
import { usePricing } from '../hooks/usePricing';

const formatCOP = (n) => `$${Number(n).toLocaleString('es-CO')}`;

// El menú y sus precios vienen de booking-service (GET /purchases/pricing):
// son los mismos con que se calcula el cobro.
const CATEGORY_EMOJI = { 'Confitería': '🍿', 'Sushi': '🍣', 'Cinepolitana': '🍕', 'Juan Valdez': '☕' };

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

  // ── Shared order summary content ──────────────────────────────────────────
  const SummaryContent = () => (
    <>
      <div className="flex items-center gap-3 mb-4">
        {poster && (
          <img src={poster} alt={title}
            className="w-10 h-14 object-cover rounded shadow flex-shrink-0" />
        )}
        <h3 className="font-bold text-gray-800 text-sm leading-snug">{title}</h3>
      </div>

      <div className="space-y-1.5 mb-3 pb-3 border-b border-gray-100">
        {generalCount > 0 && (
          <div className="flex justify-between text-sm text-gray-600">
            <span>{generalCount} Silla{generalCount > 1 ? 's' : ''} General</span>
            <span>{formatCOP(generalCount * generalPrice)}</span>
          </div>
        )}
        {prefCount > 0 && (
          <div className="flex justify-between text-sm text-gray-600">
            <span>{prefCount} Silla{prefCount > 1 ? 's' : ''} Preferencial</span>
            <span>{formatCOP(prefCount * prefPrice)}</span>
          </div>
        )}
        {cartItems.map(({ item, qty }) => (
          <div key={item!.code} className="flex justify-between text-sm text-gray-600">
            <span className="truncate mr-2">{qty}× {item!.name}</span>
            <span className="flex-shrink-0">{formatCOP(item!.price * qty)}</span>
          </div>
        ))}
      </div>

      <div className="space-y-1 mb-5 text-sm">
        <div className="flex justify-between text-gray-500">
          <span>Subtotal</span>
          <span>{formatCOP(ticketTotal + foodTotal)}</span>
        </div>
        <div className="flex justify-between text-gray-500">
          <span>Valor por servicio</span>
          <span>{formatCOP(SERVICE_FEE)}</span>
        </div>
        <div className="flex justify-between font-bold text-gray-900 text-base pt-1">
          <span>Total</span>
          <span>{formatCOP(grandWithFee)}</span>
        </div>
      </div>

      <button
        onClick={handleContinue}
        disabled={!pricing}
        className="w-full flex items-center justify-center gap-1 py-3 bg-blue-700 text-white
                   rounded-full font-semibold text-sm hover:bg-blue-800 transition-colors disabled:opacity-40"
      >
        Continuar con el pago <span className="text-blue-200 ml-1">›</span>
      </button>
      <button
        onClick={handleSkip}
        disabled={!pricing}
        className="w-full mt-2 py-2 text-gray-400 text-xs hover:text-gray-600 transition-colors"
      >
        Saltar este paso
      </button>
    </>
  );

  return (
    <div className="min-h-screen pt-20">
      {/* Extra bottom padding on mobile to clear the sticky bottom bar */}
      <div className="max-w-5xl mx-auto px-4 py-6 pb-28 lg:pb-6">

        {/* ── Main layout ─────────────────────────────────────────────────── */}
        <div className="flex flex-col lg:flex-row gap-6">

          {/* ── Food catalogue ──────────────────────────────────────────── */}
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-white mb-2">
              Comprar comida y bebidas
            </h1>
            <p className="text-xs sm:text-sm text-white/75 bg-white/10 border border-white/20 rounded-lg p-3 mb-5 backdrop-blur-sm">
              Presente su tiquete de compra para que preparemos y entreguemos su pedido.
              La vigencia de la compra de comidas es de 8 días a partir de la fecha de compra.
            </p>

            {/* Category tabs */}
            <div className="flex gap-0.5 border-b border-white/20 mb-5 overflow-x-auto">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`flex items-center gap-1 px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-medium whitespace-nowrap border-b-2 transition-colors
                    ${category === cat
                      ? 'border-white text-white'
                      : 'border-transparent text-white/60 hover:text-white/90'}`}
                >
                  {CATEGORY_EMOJI[cat]} {cat}
                </button>
              ))}
            </div>

            {!pricing && (
              <p role={pricingError ? 'alert' : 'status'} className="text-sm text-white/70 py-6">
                {pricingError ? 'No pudimos cargar el menú. Intenta de nuevo en un momento.' : 'Cargando menú…'}
              </p>
            )}

            {/* Food grid: 2 cols on mobile, 3 on desktop */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {items.map(item => {
                const qty = getQty(item.code);
                return (
                  <div key={item.code}
                    className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col">

                    <div className="h-24 sm:h-32 bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center text-4xl sm:text-5xl flex-shrink-0">
                      {CATEGORY_EMOJI[category] || '🍽️'}
                    </div>

                    <div className="p-2.5 sm:p-3 flex flex-col flex-1">
                      <h3 className="font-semibold text-gray-800 text-xs sm:text-sm leading-snug mb-1">
                        {item.name}
                      </h3>
                      <p className="font-bold text-gray-900 text-sm mb-1">{formatCOP(item.price)}</p>
                      {/* Description hidden on mobile to save space */}
                      <p className="hidden sm:block text-xs text-gray-400 leading-relaxed mb-3 line-clamp-2 flex-1">
                        {item.description || ' '}
                      </p>
                      {/* Spacer on mobile so button stays at bottom */}
                      <div className="flex-1 sm:hidden" />

                      {qty === 0 ? (
                        <button
                          onClick={() => addItem(item.code)}
                          className="w-full flex items-center justify-center gap-1 py-1.5 bg-blue-700
                                     text-white rounded-lg text-xs sm:text-sm hover:bg-blue-800 transition-colors mt-2"
                        >
                          <PlusIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Agregar
                        </button>
                      ) : (
                        <div className="flex items-center justify-between mt-2">
                          <button onClick={() => removeItem(item.code)}
                            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50">
                            <MinusIcon className="w-3.5 h-3.5 text-gray-600" />
                          </button>
                          <span className="font-bold text-gray-800 text-sm">{qty}</span>
                          <button onClick={() => addItem(item.code)}
                            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-700 flex items-center justify-center hover:bg-blue-800">
                            <PlusIcon className="w-3.5 h-3.5 text-white" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Desktop sidebar summary ──────────────────────────────────── */}
          <div className="hidden lg:block w-72 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-24">
              <SummaryContent />
            </div>
          </div>
        </div>

        {/* ── Mobile: full summary panel below catalogue ───────────────── */}
        <div className="lg:hidden mt-6 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <SummaryContent />
        </div>

        {/* ── Back button ──────────────────────────────────────────────── */}
        <div className="mt-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-5 py-2.5 border border-white/30 rounded-full
                       text-white/90 hover:bg-white/10 transition-colors font-medium text-sm backdrop-blur-sm"
          >
            <ArrowLeftIcon className="w-4 h-4" /> Atrás
          </button>
        </div>
      </div>

      {/* ── Mobile sticky bottom bar ─────────────────────────────────────── */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-xl border-t border-gray-200 px-4 py-3 flex items-center gap-3 shadow-2xl">
        <div className="flex-1 min-w-0">
          <p className="text-[10px] text-gray-400 leading-none mb-0.5">Total</p>
          <p className="font-bold text-gray-900">{formatCOP(grandWithFee)}</p>
        </div>
        <button
          onClick={handleSkip}
          className="px-4 py-2.5 border border-gray-200 rounded-full text-gray-500 text-sm font-medium hover:bg-gray-50 transition-colors whitespace-nowrap"
        >
          Saltar
        </button>
        <button
          onClick={handleContinue}
          className="px-5 py-2.5 bg-blue-700 text-white rounded-full text-sm font-semibold hover:bg-blue-800 transition-colors whitespace-nowrap"
        >
          Continuar ›
        </button>
      </div>
    </div>
  );
};

export default FoodSelectionPage;
