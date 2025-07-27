// src/pages/HomePage.jsx - Dark Mode mejorado
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import {useAuth} from "../hooks/useAuth.js";

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: '📝',
      title: 'Registro Fácil',
      description: 'Añade información detallada de tus autos con validaciones automáticas'
    },
    {
      icon: '🔍',
      title: 'Búsqueda Avanzada',
      description: 'Encuentra tus autos por marca, modelo, año, color o placa'
    },
    {
      icon: '📊',
      title: 'Estadísticas',
      description: 'Ve estadísticas de tu colección y categoriza tus autos'
    },
    {
      icon: '🏺',
      title: 'Autos Clásicos',
      description: 'Identifica automáticamente autos vintage de más de 25 años'
    },
    {
      icon: '🔒',
      title: 'Seguro y Privado',
      description: 'Tus datos están protegidos con autenticación JWT segura'
    },
    {
      icon: '📱',
      title: 'Responsive',
      description: 'Accede desde cualquier dispositivo, móvil, tablet o desktop'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-200">
      {/* Hero Section - Mejorado para dark mode */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 dark:from-primary-700 dark:to-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              🚗 TuCarro
            </h1>
            {/* MEJORADO: Mejor contraste en subtítulo */}
            <p className="text-xl md:text-2xl text-blue-100 dark:text-slate-200 mb-8 max-w-3xl mx-auto font-medium">
              Gestiona tu colección de autos de forma simple y organizada
            </p>

            {isAuthenticated ? (
              <div className="space-x-4">
                <Button
                  as={Link}
                  to="/cars"
                  variant="ghost"
                  className="bg-white dark:bg-slate-100 text-primary-600 dark:text-primary-700 hover:bg-gray-100 dark:hover:bg-slate-200 font-semibold py-3 px-8 transition-colors duration-200 shadow-lg"
                >
                  🚙 Ver Mis Autos
                </Button>
                <Button
                  as={Link}
                  to="/profile"
                  variant="ghost"
                  className="border-2 border-white dark:border-slate-200 text-white dark:text-slate-200 hover:bg-white hover:text-primary-600 dark:hover:bg-slate-200 dark:hover:text-primary-700 font-semibold py-3 px-8 transition-colors duration-200"
                >
                  👤 Mi Perfil
                </Button>
              </div>
            ) : (
              <div className="space-x-4">
                <Button
                  as={Link}
                  to="/register"
                  variant="ghost"
                  className="bg-white dark:bg-slate-100 text-primary-600 dark:text-primary-700 hover:bg-gray-100 dark:hover:bg-slate-200 font-semibold py-3 px-8 transition-colors duration-200 shadow-lg"
                >
                  📝 Empezar Gratis
                </Button>
                <Button
                  as={Link}
                  to="/login"
                  variant="ghost"
                  className="border-2 border-white dark:border-slate-200 text-white dark:text-slate-200 hover:bg-white hover:text-primary-600 dark:hover:bg-slate-200 dark:hover:text-primary-700 font-semibold py-3 px-8 transition-colors duration-200"
                >
                  🔑 Iniciar Sesión
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Features Section - MEJORADO significativamente */}
      <div className="py-24 bg-white dark:bg-slate-800 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            {/* MEJORADO: Mejor contraste en títulos */}
            <h2 className="text-3xl font-bold text-gray-900 dark:text-slate-100 mb-4 transition-colors duration-200">
              Todo lo que necesitas para gestionar tus autos
            </h2>
            {/* MEJORADO: Subtítulo más legible */}
            <p className="text-xl text-gray-600 dark:text-slate-300 transition-colors duration-200 font-medium">
              Simple, rápido y completamente gratuito
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center p-8 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-all duration-200 group border border-transparent dark:border-slate-700 hover:shadow-lg dark:hover:shadow-xl"
              >
                <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-200">
                  {feature.icon}
                </div>
                {/* MEJORADO: Títulos más prominentes */}
                <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-3 transition-colors duration-200">
                  {feature.title}
                </h3>
                {/* MEJORADO: Descripción más legible */}
                <p className="text-gray-600 dark:text-slate-300 transition-colors duration-200 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section - Mejorado */}
      {!isAuthenticated && (
        <div className="bg-gray-900 dark:bg-slate-950 py-16 transition-colors duration-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white dark:text-slate-100 mb-4">
              ¿Listo para organizar tu colección?
            </h2>
            {/* MEJORADO: Mejor legibilidad */}
            <p className="text-xl text-gray-300 dark:text-slate-300 mb-8 transition-colors duration-200 font-medium">
              Únete a TuCarro y comienza a gestionar tus autos hoy mismo
            </p>
            <Button
              as={Link}
              to="/register"
              size="lg"
              className="text-lg py-3 px-8 shadow-lg hover:shadow-xl transition-shadow duration-200"
            >
              🚀 Comenzar Ahora
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;