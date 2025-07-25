// src/pages/HomePage.jsx
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
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              🚗 TuCarro
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 mb-8 max-w-3xl mx-auto">
              Gestiona tu colección de autos de forma simple y organizada
            </p>

            {isAuthenticated ? (
              <div className="space-x-4">
                <Button
                  as={Link}
                  to="/cars"
                  variant="ghost"
                  className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-3 px-8"
                >
                  🚙 Ver Mis Autos
                </Button>
                <Button
                  as={Link}
                  to="/profile"
                  variant="ghost"
                  className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold py-3 px-8"
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
                  className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-3 px-8"
                >
                  📝 Empezar Gratis
                </Button>
                <Button
                  as={Link}
                  to="/login"
                  variant="ghost"
                  className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold py-3 px-8"
                >
                  🔑 Iniciar Sesión
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Todo lo que necesitas para gestionar tus autos
            </h2>
            <p className="text-xl text-gray-600">
              Simple, rápido y completamente gratuito
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      {!isAuthenticated && (
        <div className="bg-gray-900 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              ¿Listo para organizar tu colección?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Únete a TuCarro y comienza a gestionar tus autos hoy mismo
            </p>
            <Button
              as={Link}
              to="/register"
              size="lg"
              className="text-lg py-3 px-8"
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