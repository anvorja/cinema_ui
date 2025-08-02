// src/components/auth/LoginForm.jsx
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { validateEmail } from '../../utils';
import { useToast } from "../../hooks/useToast.js";
import { useAuth } from "../../hooks/useAuth.js";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/cars';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'El email es requerido';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'El formato del email no es válido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const result = await login(formData);

      if (result.success) {
        showToast('¡Bienvenido de vuelta!', 'success');
        navigate(from, { replace: true });
      } else {
        showToast(result.error, 'error');
      }
    } catch {
      showToast('Error al iniciar sesión', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50 dark:bg-slate-900 transition-colors duration-200">
      {/* Header mejorado - Versión original sin logo cuadrado */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-slate-100 transition-colors duration-200">
            🚗 TuCarro
          </h2>
          <p className="mt-3 text-lg text-gray-600 dark:text-slate-300 transition-colors duration-200 font-medium">
            Inicia sesión en tu cuenta
          </p>
        </div>
      </div>

      {/* Formulario mejorado */}
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-slate-800 py-10 px-6 shadow-2xl dark:shadow-slate-900/50 sm:rounded-2xl sm:px-12 border border-gray-200 dark:border-slate-700 transition-colors duration-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email"
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="tu@email.com"
              className="bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-slate-100 placeholder-gray-500 dark:placeholder-slate-400 focus:border-primary-500 dark:focus:border-primary-400 transition-colors duration-200"
            />

            <Input
              label="Contraseña"
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              placeholder="Tu contraseña"
              className="bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-slate-100 placeholder-gray-500 dark:placeholder-slate-400 focus:border-primary-500 dark:focus:border-primary-400 transition-colors duration-200"
            />

            <Button
              type="submit"
              className="w-full text-base py-3 shadow-lg hover:shadow-xl transition-shadow duration-200"
              loading={isLoading}
              disabled={isLoading}
            >
              🔑 Iniciar Sesión
            </Button>
          </form>

          {/* Separador mejorado */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-slate-600 transition-colors duration-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white dark:bg-slate-800 text-gray-500 dark:text-slate-400 font-medium transition-colors duration-200">
                  ¿No tienes cuenta?
                </span>
              </div>
            </div>

            <div className="mt-8">
              <Button
                as={Link}
                to="/register"
                variant="secondary"
                className="w-full text-base py-3 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-200 border-gray-300 dark:border-slate-600 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors duration-200"
              >
                📝 Crear cuenta nueva
              </Button>
            </div>
          </div>

          {/* Link adicional para home */}
          <div className="mt-6 text-center">
            <Link
              to="/"
              className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300 transition-colors duration-200"
            >
              ← Volver al inicio
            </Link>
          </div>
        </div>
      </div>

      {/* Footer sutil */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500 dark:text-slate-400 transition-colors duration-200">
          Gestiona tu colección de autos de forma simple y segura
        </p>
      </div>
    </div>
  );
};

export default LoginForm;