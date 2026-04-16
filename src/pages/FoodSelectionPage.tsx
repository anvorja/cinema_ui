// src/pages/FoodSelectionPage.jsx
// Step 3: Optional food & drinks selection before payment
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, PlusIcon, MinusIcon } from '@heroicons/react/24/outline';

const formatCOP = (n) => `$${Number(n).toLocaleString('es-CO')}`;

// ── Mock food catalogue ────────────────────────────────────────────────────────
const CATEGORIES = ['Confitería', 'Sushi', 'Cinepolitana', 'Juan Valdez'];

const FOOD_ITEMS = {
  'Confitería': [
    { id: 'f1', name: 'Combo Fan Junior',      price: 19_900, desc: '1 Caja crispetas de sal 55 g + 1 Gaseosa pequeña 640 ml' },
    { id: 'f2', name: 'Combo Fan',             price: 24_900, desc: '1 Crispeta pequeña de sal 100 g + 1 Gaseosa mediana 960 ml' },
    { id: 'f3', name: 'Combo Pro',             price: 39_900, desc: '1 Crispeta de sal 100 gr + 1 Gaseosa mediana 960 ml + 1 Perro caliente o sandwich' },
    { id: 'f4', name: 'Combo Deli',            price: 29_900, desc: '1 Crispeta pequeña 100 g + 1 Gaseosa mediana 960 ml + 1 Queso cheddar + 1 galleta' },
    { id: 'f5', name: 'Combo Fan Para Dos',    price: 43_900, desc: '1 Crispeta grande de sal 150 g + 2 Gaseosas medianas 960 ml' },
    { id: 'f6', name: 'Combo Pro Para Dos',    price: 62_900, desc: '1 Crispeta mediana de sal 120 g + 2 Gaseosas medianas 960 ml + 2 Perros calientes o sandwich' },
    { id: 'f7', name: 'Crispeta Sal Grande 150 g',  price: 26_900, desc: '' },
    { id: 'f8', name: 'Crispeta Sal Mediana 120 g', price: 24_900, desc: '' },
    { id: 'f9', name: 'Adición Completa Caramelo',  price: 4_700, desc: 'Esta adición no incluye las crispetas' },
    { id: 'f10', name: 'Adición Media Caramelo',    price: 3_700, desc: 'Esta adición no incluye las crispetas' },
    { id: 'f11', name: 'Porción Queso Cheddar 100 g', price: 9_500, desc: '' },
    { id: 'f12', name: 'Nachos Con Queso Cheddar',  price: 17_900, desc: '' },
  ],
  'Sushi': [
    { id: 's1', name: 'Roll California (8 piezas)',  price: 32_900, desc: 'Pepino, aguacate, cangrejo y sésamo' },
    { id: 's2', name: 'Roll Spicy Tuna (8 piezas)',  price: 36_900, desc: 'Atún, espinaca, aguacate, salsa picante' },
    { id: 's3', name: 'Sashimi Mix (12 piezas)',     price: 48_900, desc: 'Salmón, atún y pescado blanco' },
    { id: 's4', name: 'Combo Sushi Dúo',             price: 64_900, desc: '2 rolls a elección + 2 gaseosas' },
  ],
  'Cinepolitana': [
    { id: 'c1', name: 'Pizza Personal Queso',        price: 22_900, desc: 'Base de tomate, mozzarella' },
    { id: 'c2', name: 'Pizza Personal Pepperoni',    price: 26_900, desc: 'Base de tomate, mozzarella, pepperoni' },
    { id: 'c3', name: 'Perro Caliente',              price: 14_900, desc: 'Salchicha, papas de palillo, salsas' },
    { id: 'c4', name: 'Sandwich Especial',           price: 18_900, desc: 'Jamón, queso, lechuga, tomate' },
  ],
  'Juan Valdez': [
    { id: 'jv1', name: 'Café Americano',  price: 7_900, desc: 'Taza 250 ml' },
    { id: 'jv2', name: 'Cappuccino',      price: 9_900, desc: 'Espresso + leche espumada' },
    { id: 'jv3', name: 'Latte Vainilla',  price: 10_900, desc: 'Espresso + leche + sirope de vainilla' },
    { id: 'jv4', name: 'Brownie Choco',   price: 8_500, desc: 'Con chips de chocolate' },
  ],
};

// Emoji placeholders for food (no real images)
const CATEGORY_EMOJI = { 'Confitería': '🍿', 'Sushi': '🍣', 'Cinepolitana': '🍕', 'Juan Valdez': '☕' };

// ── Component ─────────────────────────────────────────────────────────────────
const FoodSelectionPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [activeCategory, setActiveCategory] = useState('Confitería');
  const [cart, setCart] = useState<Record<string, number>>({}); // { itemId: quantity }

  const {
    movie, theater, showtime, selectedDate,
    selectedSeats = [],
    generalCount  = 0,
    prefCount     = 0,
    ticketCount   = 0,
    totalAmount: ticketTotal = 0,
  } = state || {};

  if (!movie || !theater) {
    navigate('/cartelera');
    return null;
  }

  // Cart helpers
  const getQty = (id) => cart[id] || 0;
  const addItem = (id) => setCart(c => ({ ...c, [id]: (c[id] || 0) + 1 }));
  const removeItem = (id) => setCart(c => {
    const n = { ...c };
    if (n[id] > 1) n[id]--;
    else delete n[id];
    return n;
  });

  // Totals
  const allItems = Object.values(FOOD_ITEMS).flat();
  const foodTotal = Object.entries(cart).reduce((acc, [id, qty]) => {
    const item = allItems.find(i => i.id === id);
    return acc + (item ? item.price * qty : 0);
  }, 0);

  const grandTotal    = ticketTotal + foodTotal;
  const SERVICE_FEE   = foodTotal > 0 ? 4_800 : 0;
  const grandWithFee  = grandTotal + SERVICE_FEE;

  const cartItems = Object.entries(cart)
    .filter(([, qty]) => qty > 0)
    .map(([id, qty]) => ({ item: allItems.find(i => i.id === id), qty }))
    .filter(({ item }) => !!item);

  const poster      = movie.images?.poster || movie.posterImage || '';
  const title       = movie.title || '';

  const handleContinue = () => {
    const finalState = {
      movie, theater, showtime, selectedDate,
      selectedSeats,
      generalCount,
      prefCount,
      ticketCount,
      ticketPrice:   ticketTotal / (ticketCount || 1),
      serviceFee:    SERVICE_FEE,
      totalAmount:   grandWithFee,
      foodItems:     cartItems.map(({ item, qty }) => ({ ...item, qty })),
      foodTotal,
    };

    navigate('/payment', { state: finalState });
  };

  const handleSkip = () => {
    navigate('/payment', {
      state: {
        movie, theater, showtime, selectedDate,
        selectedSeats, generalCount, prefCount,
        ticketCount,
        ticketPrice: ticketTotal / (ticketCount || 1),
        serviceFee: 0,
        totalAmount: ticketTotal,
        foodItems: [],
        foodTotal: 0,
      }
    });
  };

  const items = FOOD_ITEMS[activeCategory] || [];

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex gap-6">

          {/* ── Left: food catalogue ───────────────────────────────────────── */}
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-white mb-2">Comprar comida y bebidas</h1>
            <p className="text-sm text-white/75 bg-white/10 border border-white/20 rounded-lg p-3 mb-5 backdrop-blur-sm">
              Presente su tiquete de compra para que preparemos y entreguemos su pedido.
              La vigencia de la compra de comidas es de 8 días a partir de la fecha de compra.
            </p>

            {/* Category tabs */}
            <div className="flex gap-1 border-b border-white/20 mb-5 overflow-x-auto">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium whitespace-nowrap
                    border-b-2 transition-colors
                    ${activeCategory === cat
                      ? 'border-white text-white'
                      : 'border-transparent text-white/60 hover:text-white/90'}`}
                >
                  {CATEGORY_EMOJI[cat]} {cat}
                </button>
              ))}
            </div>

            {/* Food grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map(item => {
                const qty = getQty(item.id);
                return (
                  <div key={item.id}
                    className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">

                    {/* Placeholder image */}
                    <div className="h-32 bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center text-5xl">
                      {CATEGORY_EMOJI[activeCategory]}
                    </div>

                    <div className="p-3">
                      <h3 className="font-semibold text-gray-800 text-sm leading-snug mb-1">
                        {item.name}
                      </h3>
                      <p className="font-bold text-gray-900 mb-1">{formatCOP(item.price)}</p>
                      {item.desc && (
                        <p className="text-xs text-gray-400 leading-relaxed mb-3 line-clamp-2">
                          {item.desc}
                        </p>
                      )}

                      {qty === 0 ? (
                        <button
                          onClick={() => addItem(item.id)}
                          className="w-full flex items-center justify-center gap-1 py-1.5 bg-blue-700
                                     text-white rounded-lg text-sm hover:bg-blue-800 transition-colors"
                        >
                          <PlusIcon className="w-4 h-4" /> Agregar
                        </button>
                      ) : (
                        <div className="flex items-center justify-between">
                          <button onClick={() => removeItem(item.id)}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50">
                            <MinusIcon className="w-4 h-4 text-gray-600" />
                          </button>
                          <span className="font-bold text-gray-800">{qty}</span>
                          <button onClick={() => addItem(item.id)}
                            className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center hover:bg-blue-800">
                            <PlusIcon className="w-4 h-4 text-white" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Right: order summary ───────────────────────────────────────── */}
          <div className="w-72 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-24">
              <div className="flex items-center gap-3 mb-4">
                {poster && (
                  <img src={poster} alt={title}
                    className="w-10 h-14 object-cover rounded shadow flex-shrink-0" />
                )}
                <h3 className="font-bold text-gray-800 text-sm leading-snug">{title}</h3>
              </div>

              {/* Ticket breakdown */}
              <div className="space-y-1.5 mb-3 pb-3 border-b border-gray-100">
                {generalCount > 0 && (
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{generalCount} Silla{generalCount > 1 ? 's' : ''} General</span>
                    <span>{formatCOP(generalCount * 22_800)}</span>
                  </div>
                )}
                {prefCount > 0 && (
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{prefCount} Silla{prefCount > 1 ? 's' : ''} Preferencial</span>
                    <span>{formatCOP(prefCount * 28_500)}</span>
                  </div>
                )}
                {cartItems.map(({ item, qty }) => (
                  <div key={item.id} className="flex justify-between text-sm text-gray-600">
                    <span className="truncate mr-2">{qty}× {item.name}</span>
                    <span className="flex-shrink-0">{formatCOP(item.price * qty)}</span>
                  </div>
                ))}
              </div>

              {/* Totals */}
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
                className="w-full flex items-center justify-center gap-1 py-3 bg-blue-700 text-white
                           rounded-full font-semibold text-sm hover:bg-blue-800 transition-colors"
              >
                Continuar con el pago <span className="text-blue-200 ml-1">›</span>
              </button>

              <button
                onClick={handleSkip}
                className="w-full mt-2 py-2 text-gray-400 text-xs hover:text-gray-600 transition-colors"
              >
                Saltar este paso
              </button>
            </div>
          </div>
        </div>

        {/* ── Back button ────────────────────────────────────────────────────── */}
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
    </div>
  );
};

export default FoodSelectionPage;
