// src/pages/NotFoundPage.jsx
import { useNavigate, Link } from 'react-router-dom';
import {
  HomeIcon,
  FilmIcon,
  ArrowLeftIcon,
  MagnifyingGlassIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import {FloatingParticles, GlassCard, PremiumButton} from '../components/common';
import { useState, useEffect } from 'react';

const NotFoundPage = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);
  const [isCountdownActive, setIsCountdownActive] = useState(true);

  // Countdown para redirección automática
  useEffect(() => {
    if (isCountdownActive && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      navigate('/');
    }
  }, [countdown, navigate, isCountdownActive]);

  const stopCountdown = () => {
    setIsCountdownActive(false);
  };

  const suggestedPages = [
    {
      name: 'Inicio',
      path: '/',
      description: 'Volver a la página principal',
      icon: HomeIcon,
      color: 'bg-blue-500'
    },
    {
      name: 'Cartelera',
      path: '/cartelera',
      description: 'Ver películas en exhibición',
      icon: FilmIcon,
      color: 'bg-purple-500'
    },
    {
      name: 'Próximos Estrenos',
      path: '/pronto',
      description: 'Descubre los próximos estrenos',
      icon: FilmIcon,
      color: 'bg-orange-500'
    },
    {
      name: 'Comidas',
      path: '/comidas',
      description: 'Explora nuestro menú de comidas',
      icon: MagnifyingGlassIcon,
      color: 'bg-green-500'
    }
  ];

  return (
    <div className="min-h-screen pt-24 flex items-center justify-center">
      <FloatingParticles count={40} className="opacity-30" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">

          {/* Error Icon and Message */}
          <div className="mb-8">
            <div className="w-32 h-32 mx-auto mb-6 relative">
              {/* Animated 404 with glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-3xl opacity-30 animate-pulse" />
              <div className="relative w-full h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-4xl">404</span>
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
              Página No Encontrada
            </h1>

            <p className="text-white/80 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
              Lo sentimos, la página que estás buscando no existe o ha sido movida.
              Te ayudamos a encontrar lo que necesitas.
            </p>
          </div>

          {/* Auto-redirect notice */}
          {isCountdownActive && (
            <GlassCard variant="premium" className="p-6 mb-8 max-w-md mx-auto">
              <div className="flex items-center gap-3 mb-3">
                <ExclamationTriangleIcon className="w-6 h-6 text-orange-400" />
                <h3 className="text-white font-semibold">Redirección Automática</h3>
              </div>
              <p className="text-white/80 text-sm mb-3">
                Serás redirigido al inicio en {countdown} segundos
              </p>
              <button
                onClick={stopCountdown}
                className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
              >
                Cancelar redirección
              </button>
            </GlassCard>
          )}

          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {suggestedPages.map((page) => (
              <Link
                key={page.name}
                to={page.path}
                className="group"
                onClick={stopCountdown}
              >
                <GlassCard variant="premium" className="p-6 premium-card h-full">
                  <div className="flex flex-col items-center text-center">
                    <div className={`w-12 h-12 ${page.color} rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <page.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-white font-semibold mb-2">{page.name}</h3>
                    <p className="text-white/70 text-sm">{page.description}</p>
                  </div>
                </GlassCard>
              </Link>
            ))}
          </div>

          {/* Main Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <PremiumButton
              size="lg"
              variant="premium"
              onClick={() => {
                stopCountdown();
                navigate('/');
              }}
            >
              <HomeIcon className="w-5 h-5 mr-2" />
              Ir al Inicio
            </PremiumButton>

            <PremiumButton
              size="lg"
              variant="secondary"
              onClick={() => {
                stopCountdown();
                navigate(-1);
              }}
            >
              <ArrowLeftIcon className="w-5 h-5 mr-2" />
              Página Anterior
            </PremiumButton>
          </div>

          {/* Search Section */}
          <GlassCard variant="default" className="p-8 max-w-2xl mx-auto">
            <h2 className="text-xl font-bold text-white mb-4">
              ¿Buscas algo específico?
            </h2>

            <div className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar películas, comidas, teatros..."
                  className="w-full px-4 py-3 pl-12 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:bg-white/15 focus:border-white/40 focus:outline-none transition-all"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      // Aquí implementarías la búsqueda real
                      navigate('/cartelera');
                    }
                  }}
                />
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
              </div>

              <p className="text-white/60 text-sm">
                O navega usando los enlaces de arriba para encontrar lo que necesitas
              </p>
            </div>
          </GlassCard>

          {/* Help Section */}
          <div className="mt-12">
            <GlassCard variant="default" className="p-6 max-w-xl mx-auto">
              <h3 className="text-white font-semibold mb-3">¿Necesitas Ayuda?</h3>
              <p className="text-white/70 text-sm mb-4">
                Si continúas teniendo problemas, no dudes en contactarnos
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button className="px-4 py-2 bg-white/10 text-white rounded-lg text-sm hover:bg-white/20 transition-colors">
                  📞 Llamar Soporte
                </button>
                <button className="px-4 py-2 bg-white/10 text-white rounded-lg text-sm hover:bg-white/20 transition-colors">
                  📧 Enviar Email
                </button>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;