// src/components/layout/Footer.jsx
import { Github, Twitter, Linkedin, Heart, Instagram } from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: 'GitHub',
      url: 'https://github.com',
      icon: Github,
      hoverColor: 'hover:text-gray-900 dark:hover:text-white'
    },
    {
      name: 'Twitter/X',
      url: 'https://x.com',
      icon: Twitter,
      hoverColor: 'hover:text-black dark:hover:text-white'
    },
    {
      name: 'LinkedIn',
      url: 'https://linkedin.com',
      icon: Linkedin,
      hoverColor: 'hover:text-blue-600 dark:hover:text-blue-400'
    },
    {
      name: 'Instagram',
      url: 'https://instagram.com',
      icon: Instagram,
      hoverColor: 'hover:text-pink-500 dark:hover:text-pink-400'
    }
  ];

  return (
    <footer className="relative mt-auto">
      {/* Efecto glassmórfico sutil */}
      <div className="backdrop-blur-md bg-gradient-to-r from-white/5 via-white/10 to-white/5 dark:from-black/5 dark:via-black/10 dark:to-black/5 border-t border-white/10 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* Layout principal: Logo centrado + iconos */}
          <div className="flex flex-col items-center space-y-6">

            {/* Logo y marca */}
            <div className="flex items-center space-x-2 group">
              <span className="text-2xl group-hover:scale-110 transition-transform duration-300">🚗</span>
              <span className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                TuCarro
              </span>
            </div>

            {/* Iconos sociales con links reales */}
            <div className="flex items-center space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2 rounded-full hover:bg-white/10 dark:hover:bg-white/5 transition-all duration-300 text-slate-500 dark:text-slate-400 ${social.hoverColor} group`}
                    aria-label={`Visitar ${social.name}`}
                    title={`Síguenos en ${social.name}`}
                  >
                    <Icon className="w-7 h-7 transform group-hover:scale-110 group-hover:-translate-y-0.5 transition-all duration-300" />
                  </a>
                );
              })}
            </div>

            {/* Copyright con corazón */}
            <div className="text-center border-t border-white/10 dark:border-white/5 pt-6 w-full max-w-md">
              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center space-x-1">
                <span>© {currentYear} TuCarro Premium</span>
                <span>•</span>
                <span>Hecho con</span>
                <Heart className="w-3 h-3 text-red-500 animate-pulse" />
                <span>para los amantes de los autos</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Línea de brillo sutil */}
      <div className="h-px bg-gradient-to-r from-transparent via-blue-500/20 dark:via-blue-400/20 to-transparent opacity-50" />
    </footer>
  );
};