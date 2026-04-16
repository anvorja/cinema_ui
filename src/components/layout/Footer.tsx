// src/components/layout/Footer.jsx
import { Link } from 'react-router-dom';
import { GlassCard } from '../common';

const Footer = () => {
  const footerLinks = [
    {
      category: 'Enlaces',
      links: [
        { name: 'Información Legal', href: '/legal' },
        { name: 'Acerca de Cineco', href: '/about' },
        { name: 'Contáctanos PQRS', href: '/contact' },
        { name: 'Preguntas Frecuentes', href: '/faq' }
      ]
    }
  ];

  const socialLinks = [
    { name: 'Facebook', href: '#', icon: '📘' },
    { name: 'Twitter', href: '#', icon: '🐦' },
    { name: 'Instagram', href: '#', icon: '📷' }
  ];

  return (
    <footer className="relative mt-16">
      <div className="bg-gradient-to-t from-black/80 via-black/60 to-transparent py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <GlassCard variant="dark" className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

              {/* Logo and Company Info */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-xl">C+</span>
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg">CINEMAPLUS</h3>
                  </div>
                </div>
                <p className="text-white/70 text-sm leading-relaxed">
                  La mejor experiencia cinematográfica en Colombia.
                  Disfruta de los últimos estrenos en la mejor calidad de imagen y sonido.
                </p>
              </div>

              {/* Links */}
              <div className="space-y-4">
                <h4 className="text-white font-semibold">Enlaces Útiles</h4>
                <div className="space-y-2">
                  {footerLinks[0].links.map((link) => (
                    <Link
                      key={link.name}
                      to={link.href}
                      className="block text-white/70 hover:text-white text-sm transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Social Media */}
              <div className="space-y-4">
                <h4 className="text-white font-semibold">Síguenos en redes sociales</h4>
                <div className="flex gap-4">
                  {socialLinks.map((social) => (
                    <a
                      key={social.name}
                      href={social.href}
                      className="w-10 h-10 glass rounded-lg flex items-center justify-center hover:glass-hover transition-all duration-200"
                      aria-label={social.name}
                    >
                      <span className="text-lg">{social.icon}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Copyright */}
            <div className="border-t border-white/10 mt-8 pt-6 text-center">
              <p className="text-white/60 text-sm">
                © 2025 Cinemaplus. Todos los derechos reservados.
              </p>
            </div>
          </GlassCard>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
