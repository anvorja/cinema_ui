// src/components/layout/Footer.jsx
import { Link } from 'react-router-dom';

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
);

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z"/>
  </svg>
);

const socialLinks = [
  { name: 'Facebook',  href: '#', Icon: FacebookIcon,  color: 'hover:text-blue-400  hover:border-blue-400/40' },
  { name: 'Instagram', href: '#', Icon: InstagramIcon, color: 'hover:text-pink-400   hover:border-pink-400/40' },
  { name: 'TikTok',    href: '#', Icon: TikTokIcon,    color: 'hover:text-white      hover:border-white/40' },
];

const footerNav = [
  { label: 'Información Legal',   href: '/legal' },
  { label: 'Acerca de Cinemaplus', href: '/about' },
  { label: 'Contáctanos / PQRS',  href: '/contact' },
  { label: 'Preguntas Frecuentes', href: '/faq' },
];

const Footer = () => (
  <footer className="relative mt-auto">
    {/* Top gradient fade */}
    <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

    <div className="bg-slate-950/90 backdrop-blur-xl">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="inline-flex items-center gap-2.5 group">
              <span className="text-white font-bold text-xl tracking-widest group-hover:text-white/80 transition-colors">
                CINEMAPLUS
              </span>
            </Link>
            <p className="text-white/45 text-sm leading-relaxed max-w-xs">
              La mejor experiencia cinematográfica en Colombia. Disfruta los últimos estrenos con la mejor calidad de imagen y sonido.
            </p>
            {/* Social */}
            <div className="flex gap-2 pt-1">
              {socialLinks.map(({ name, href, Icon, color }) => (
                <a
                  key={name}
                  href={href}
                  aria-label={name}
                  className={`w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center text-white/40 transition-all duration-200 ${color}`}
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <p className="text-xs font-semibold text-white/30 uppercase tracking-[0.15em]">Empresa</p>
            <ul className="space-y-2.5">
              {footerNav.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    to={href}
                    className="text-white/50 hover:text-white text-sm transition-colors duration-150"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* App info / CTA */}
          <div className="space-y-4">
            <p className="text-xs font-semibold text-white/30 uppercase tracking-[0.15em]">Experiencia</p>
            <ul className="space-y-2.5 text-white/50 text-sm">
              <li>Formatos IMAX · 3D · 4DX</li>
              <li>Selección de asientos en línea</li>
              <li>Combos de comida y bebidas</li>
              <li>Tarjeta fidelidad Cinema+</li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-white/[0.07] flex flex-col sm:flex-row items-center justify-between gap-2 text-white/25 text-xs">
          <span>© {new Date().getFullYear()} Cinemaplus. Todos los derechos reservados.</span>
          <span>Hecho con ♥ en Colombia</span>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
