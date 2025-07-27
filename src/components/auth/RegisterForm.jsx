// src/components/auth/RegisterForm.jsx - Dark Mode optimizado
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { validateEmail } from '../../utils';
import { useAuth } from "../../hooks/useAuth.js";
import { useToast } from "../../hooks/useToast.js";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

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

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'El nombre es requerido';
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = 'El nombre debe tener al menos 2 caracteres';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'El apellido es requerido';
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = 'El apellido debe tener al menos 2 caracteres';
    }

    if (!formData.email) {
      newErrors.email = 'El email es requerido';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'El formato del email no es válido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const result = await register(formData);

      if (result.success) {
        showToast('¡Cuenta creada exitosamente!', 'success');
        navigate('/cars');
      } else {
        showToast(result.error, 'error');
      }
    } catch {
      showToast('Error al crear la cuenta', 'error');
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
            Crea tu cuenta gratis
          </p>
        </div>
      </div>

      {/* Formulario mejorado */}
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-slate-800 py-10 px-6 shadow-2xl dark:shadow-slate-900/50 sm:rounded-2xl sm:px-12 border border-gray-200 dark:border-slate-700 transition-colors duration-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nombre y Apellido en grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <Input
                label="Nombre"
                type="text"
                name="firstName"
                required
                value={formData.firstName}
                onChange={handleChange}
                error={errors.firstName}
                placeholder="Tu nombre"
                className="bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-slate-100 placeholder-gray-500 dark:placeholder-slate-400 focus:border-primary-500 dark:focus:border-primary-400 transition-colors duration-200"
              />

              <Input
                label="Apellido"
                type="text"
                name="lastName"
                required
                value={formData.lastName}
                onChange={handleChange}
                error={errors.lastName}
                placeholder="Tu apellido"
                className="bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-slate-100 placeholder-gray-500 dark:placeholder-slate-400 focus:border-primary-500 dark:focus:border-primary-400 transition-colors duration-200"
              />
            </div>

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
              placeholder="Mínimo 6 caracteres"
              helper="Tu contraseña debe tener al menos 6 caracteres"
              className="bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-slate-100 placeholder-gray-500 dark:placeholder-slate-400 focus:border-primary-500 dark:focus:border-primary-400 transition-colors duration-200"
            />

            <Button
              type="submit"
              className="w-full text-base py-3 shadow-lg hover:shadow-xl transition-shadow duration-200"
              loading={isLoading}
              disabled={isLoading}
            >
              📝 Crear Cuenta
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
                  ¿Ya tienes cuenta?
                </span>
              </div>
            </div>

            <div className="mt-8">
              <Button
                as={Link}
                to="/login"
                variant="secondary"
                className="w-full text-base py-3 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-200 border-gray-300 dark:border-slate-600 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors duration-200"
              >
                🔑 Iniciar Sesión
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

        {/* Términos y privacidad */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500 dark:text-slate-400 transition-colors duration-200 max-w-sm mx-auto leading-relaxed">
            Al crear una cuenta, aceptas nuestros términos de servicio y política de privacidad.
            Tus datos están seguros con nosotros.
          </p>
        </div>
      </div>

    </div>
  );
};

export default RegisterForm;