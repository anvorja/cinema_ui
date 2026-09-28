// Pasos de la compra como estado de vuelo: el paso actual va en ámbar.
const STEPS = ['Función', 'Sillas', 'Boletas', 'Comida', 'Pago'] as const;
export type BookingStep = typeof STEPS[number];

export const BookingSteps = ({ current }: { current: BookingStep }) => {
  const at = STEPS.indexOf(current);
  return (
    <nav aria-label="Pasos de la compra" className="border-b border-[#2c2c30] bg-[#0c0c0d]">
      <ol className="mx-auto flex max-w-[1400px] items-stretch px-4 sm:px-6">
        {STEPS.map((step, i) => {
          const state = i < at ? 'done' : i === at ? 'now' : 'next';
          return (
            <li
              key={step}
              aria-current={state === 'now' ? 'step' : undefined}
              className={`flex min-h-[44px] flex-1 items-center justify-center gap-2 border-b-2 px-1 sm:justify-start sm:pr-2 ${
                state === 'now' ? 'border-[#f2b705] text-[#f4f1e8]' : state === 'done' ? 'border-[#46464c] text-[#c3bfb2]' : 'border-transparent text-[#8f8b80]'
              }`}
            >
              <span className={`font-data text-xs font-bold ${state === 'now' ? 'text-[#f2b705]' : 'hidden sm:inline'}`}>{String(i + 1).padStart(2, '0')}</span>
              <span className={`font-board text-base font-semibold tracking-[0.08em] uppercase ${state === 'now' ? '' : 'hidden sm:inline'}`}>{step}</span>
              {state === 'done' && <span className="sr-only"> (completado)</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default BookingSteps;
