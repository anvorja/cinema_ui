// src/components/layout/Footer.tsx
import { Link } from 'react-router-dom';

const footerNav = [
  { label: 'Información legal', href: '/legal' },
  { label: 'Acerca de CinemaPlus', href: '/about' },
  { label: 'Contáctanos / PQRS', href: '/contact' },
  { label: 'Preguntas frecuentes', href: '/faq' },
];

const Footer = () => (
  <footer className="mt-16 border-t border-[#2c2c30] bg-[#0c0c0d]">
    <div className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6">
      <div className="grid gap-8 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="space-y-3">
          <Link to="/" className="font-board text-3xl font-bold tracking-[0.08em] text-[#f4f1e8]">
            CINEMA<span className="text-[#f2b705]">PLUS</span>
          </Link>
          <p className="max-w-sm text-[15px] leading-relaxed text-[#8f8b80]">
            Elige la función, la silla y el combo. Pagas en línea, en pesos colombianos, y entras con el código QR de tu boleta.
          </p>
        </div>

        <nav aria-label="Empresa">
          <h2 className="mb-3 font-data text-[11px] font-bold uppercase tracking-[0.12em] text-[#8f8b80]">Empresa</h2>
          <ul className="space-y-1">
            {footerNav.map(({ label, href }) => (
              <li key={label}>
                <Link to={href} className="inline-flex min-h-[36px] items-center text-[15px] text-[#c3bfb2] hover:text-[#f2b705]">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="mb-3 font-data text-[11px] font-bold uppercase tracking-[0.12em] text-[#8f8b80]">Tu compra</h2>
          <ul className="space-y-1 text-[15px] text-[#c3bfb2]">
            <li className="min-h-[36px] leading-9">Selección de sillas en línea</li>
            <li className="min-h-[36px] leading-9">Combos de comida y bebidas</li>
            <li className="min-h-[36px] leading-9">Pago seguro con Wompi</li>
            <li className="min-h-[36px] leading-9">Tarjeta Cinema+</li>
          </ul>
        </div>
      </div>

      <div className="mt-8 flex flex-col justify-between gap-2 border-t border-[#2c2c30] pt-5 font-data text-xs text-[#8f8b80] sm:flex-row">
        <span>© {new Date().getFullYear()} CinemaPlus</span>
        <span>Precios en COP · IVA incluido según la función</span>
      </div>
    </div>
  </footer>
);

export default Footer;
