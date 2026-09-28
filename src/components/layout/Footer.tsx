// src/components/layout/Footer.tsx
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Youtube } from 'lucide-react';
import BoardTip from '../board/BoardTip';

const TikTokIcon = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z" />
  </svg>
);

// Mientras no existan las cuentas oficiales, todas apuntan a la página principal.
// Cuando haya URL, basta con cambiar el `href` (y usar <a target="_blank"> si es externa).
const socialLinks = [
  { name: 'Facebook', href: '/', Icon: Facebook },
  { name: 'Instagram', href: '/', Icon: Instagram },
  { name: 'YouTube', href: '/', Icon: Youtube },
  { name: 'TikTok', href: '/', Icon: TikTokIcon },
];

const footerNav = [
  { label: 'Información legal', href: '/legal' },
  { label: 'Acerca de CinemaPlus', href: '/about' },
  { label: 'Contáctanos / PQRS', href: '/contact' },
  { label: 'Preguntas frecuentes', href: '/faq' },
];

const Footer = () => (
  <footer className="mt-16 border-t border-board-line bg-board-ground">
    <div className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6">
      <div className="grid gap-8 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="space-y-3">
          <Link to="/" className="font-board text-3xl font-bold tracking-[0.08em] text-board-ink">
            CINEMA<span className="text-board-amberink">PLUS</span>
          </Link>
          <p className="max-w-sm text-[15px] leading-relaxed text-board-mute">
            Elige la función, la silla y el combo. Pagas en línea, en pesos colombianos, y entras con el código QR de tu boleta.
          </p>
          <ul className="flex gap-2 pt-1" aria-label="Redes sociales">
            {socialLinks.map(({ name, href, Icon }) => (
              <li key={name}>
                <BoardTip label={name}>
                  <Link
                    to={href}
                    aria-label={`${name} de CinemaPlus`}
                    className="flex h-11 w-11 items-center justify-center rounded-[3px] border border-board-line2 text-board-ink2 hover:border-board-amber hover:text-board-amberink"
                  >
                    <Icon className="h-5 w-5" />
                  </Link>
                </BoardTip>
              </li>
            ))}
          </ul>
        </div>

        <nav aria-label="Empresa">
          <h2 className="mb-3 font-data text-[11px] font-bold uppercase tracking-[0.12em] text-board-mute">Empresa</h2>
          <ul className="space-y-1">
            {footerNav.map(({ label, href }) => (
              <li key={label}>
                <Link to={href} className="inline-flex min-h-[36px] items-center text-[15px] text-board-ink2 hover:text-board-amberink">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="mb-3 font-data text-[11px] font-bold uppercase tracking-[0.12em] text-board-mute">Tu compra</h2>
          <ul className="space-y-1 text-[15px] text-board-ink2">
            <li className="min-h-[36px] leading-9">Selección de sillas en línea</li>
            <li className="min-h-[36px] leading-9">Combos de comida y bebidas</li>
            <li className="min-h-[36px] leading-9">Pago seguro con Wompi</li>
            <li className="min-h-[36px] leading-9">Tarjeta Cinema+</li>
          </ul>
        </div>
      </div>

      <div className="mt-8 flex flex-col justify-between gap-2 border-t border-board-line pt-5 font-data text-xs text-board-mute sm:flex-row">
        <span>© {new Date().getFullYear()} CinemaPlus</span>
        <span>Precios en COP · IVA incluido según la función</span>
      </div>
    </div>
  </footer>
);

export default Footer;
