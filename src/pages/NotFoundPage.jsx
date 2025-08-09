// src/pages/NotFoundPage.jsx
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/ui/Button';
import { Home, ArrowLeft, Car } from 'lucide-react';

const GlassCard = ({ children, className = "", hover = true, ...props }) => {
  return (
      <div
          className={`
        backdrop-blur-xl bg-white/10 dark:bg-white/5
        border border-white/20 dark:border-white/10
        rounded-2xl shadow-2xl
        ${hover ? 'hover:bg-white/15 dark:hover:bg-white/10 hover:border-white/30 dark:hover:border-white/20 hover:shadow-3xl hover:-translate-y-1' : ''}
        transition-all duration-300 ease-out
        ${className}
      `}
          {...props}
      >
        {children}
      </div>
  );
};

// Componente para efectos de brillo animado
const ShimmerEffect = ({ children, className = "" }) => {
  return (
      <div className={`relative overflow-hidden ${className}`}>
        <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 animate-shimmer" />
        {children}
      </div>
  );
};

const NotFoundPage = () => {
  const { isAuthenticated } = useAuth();

  return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 dark:from-slate-900 dark:via-purple-900/20 dark:to-slate-900 relative overflow-hidden flex items-center justify-center">
        {/* Efectos de fondo animados */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/3 dark:bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-2000" />
        </div>

        <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <GlassCard className="p-12" hover={false}>

            {/* Error Code con efecto glassmórfico */}
            <div className="relative mb-8">
              <ShimmerEffect>
                <div className="text-8xl sm:text-9xl font-black bg-gradient-to-r from-slate-800 via-blue-600 to-purple-600 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent leading-none">
                  404
                </div>
              </ShimmerEffect>

              {/* Efecto de brillo detrás del número */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-3xl opacity-50 -z-10" />
            </div>

            {/* Emoji animado */}
            <div className="text-6xl mb-6 animate-bounce">
              🚗💨
            </div>

            {/* Título */}
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-slate-100 mb-4">
              ¡Ups! Página no encontrada
            </h1>

            {/* Descripción */}
            <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 leading-relaxed max-w-md mx-auto">
              Parece que la página que buscas se fue de paseo. No te preocupes,
              te ayudamos a encontrar el camino de vuelta.
            </p>

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">

              {/* Botón principal - Ir al inicio */}
              <ShimmerEffect>
                <Link to="/">
                  <Button
                      variant="primary"
                      size="lg"
                      className="shadow-lg hover:shadow-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white dark:from-blue-500 dark:to-purple-500 dark:hover:from-blue-600 dark:hover:to-purple-600">
                    <Home className="w-5 h-5 mr-2" />
                    Ir al Inicio
                  </Button>
                </Link>
              </ShimmerEffect>

              {/* Botón secundario - Condicional según autenticación */}
              {isAuthenticated ? (
                  <Link to="/cars">
                    <Button
                        variant="outline"
                        size="lg"
                        className="backdrop-blur-sm bg-white/10 dark:bg-white/5 border border-white/30 dark:border-white/20 text-slate-700 dark:text-slate-200 hover:bg-white/20 dark:hover:bg-white/10"
                    >
                      <Car className="w-5 h-5 mr-2" />
                      Mis Autos
                    </Button>
                  </Link>
              ) : (
                  <Link to="/login">
                    <Button
                        variant="ghost"
                        size="lg"
                        className="text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-100"
                    >
                      <ArrowLeft className="w-5 h-5 mr-2" />
                      Volver
                    </Button>
                  </Link>
              )}
            </div>

            {/* Enlaces útiles */}
            <div className="mt-12 pt-8 border-t border-white/10 dark:border-white/5">
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                ¿Necesitas ayuda? Aquí tienes algunos enlaces útiles:
              </p>

              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <Link
                    to="/"
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors underline-offset-4 hover:underline"
                >
                  Página Principal
                </Link>

                {isAuthenticated && (
                    <>
                      <span className="text-slate-400">•</span>
                      <Link
                          to="/cars"
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors underline-offset-4 hover:underline"
                      >
                        Mi Colección
                      </Link>
                      <span className="text-slate-400">•</span>
                      <Link
                          to="/profile"
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors underline-offset-4 hover:underline"
                      >
                        Mi Perfil
                      </Link>
                    </>
                )}

                {!isAuthenticated && (
                    <>
                      <span className="text-slate-400">•</span>
                      <Link
                          to="/login"
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors underline-offset-4 hover:underline"
                      >
                        Iniciar Sesión
                      </Link>
                      <span className="text-slate-400">•</span>
                      <Link
                          to="/register"
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors underline-offset-4 hover:underline"
                      >
                        Registrarse
                      </Link>
                    </>
                )}
              </div>
            </div>

          </GlassCard>

          {/* Elementos decorativos flotantes */}
          <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-blue-400/30 rounded-full animate-ping" />
          <div className="absolute top-3/4 right-1/4 w-2 h-2 bg-purple-400/40 rounded-full animate-pulse delay-1000" />
          <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-cyan-400/20 rounded-full animate-bounce delay-500" />
        </div>
      </div>
  );
};

export default NotFoundPage;