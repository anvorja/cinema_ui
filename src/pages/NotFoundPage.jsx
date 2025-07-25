// src/pages/NotFoundPage.jsx
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="text-center">
        <div className="text-8xl mb-8">🚗💨</div>
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          ¡Página no encontrada!
        </h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Lo sentimos, pero la página que buscas se ha ido a dar una vuelta y no ha regresado.
        </p>
        <div className="space-x-4">
          <Button as={Link} to="/">
            🏠 Ir al Inicio
          </Button>
          <Button as={Link} to="/cars" variant="secondary">
            🚗 Ver Mis Autos
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;