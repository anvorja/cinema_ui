// src/components/forms/LoginForm.jsx
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { validateEmail } from '../../utils';
import Button from '../ui/Button';
import LoadingSpinner from '../ui/LoadingSpinner';
import { cn } from '../../utils';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

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
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Email Field */}
      <div className="space-y-2">
        <label
          htmlFor="email"
          className={cn(
            'text-sm font-medium transition-colors',
            focusedField === 'email' ? 'text-blue-400' : 'text-foreground'
          )}
        >
          Correo Electrónico
        </label>
        <div className="relative">
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            onFocus={() => setFocusedField('email')}
            onBlur={() => setFocusedField(null)}
            placeholder="tu@email.com"
            className={cn(
              'w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg',
              'focus:bg-white/10 focus:border-blue-400/50',
              'placeholder:text-gray-400/50',
              'transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400/20',
              errors.email && 'border-red-400/50 focus:border-red-400/50 focus:ring-red-400/20'
            )}
            required
          />
          <div className={cn(
            'absolute inset-0 rounded-lg border-2 border-blue-400/0 transition-all duration-300 pointer-events-none',
            focusedField === 'email' && 'border-blue-400/30 shadow-lg shadow-blue-400/20'
          )} />
        </div>
        {errors.email && (
          <p className="text-sm text-red-400 mt-1">{errors.email}</p>
        )}
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <label
          htmlFor="password"
          className={cn(
            'text-sm font-medium transition-colors',
            focusedField === 'password' ? 'text-purple-400' : 'text-foreground'
          )}
        >
          Contraseña
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleChange}
            onFocus={() => setFocusedField('password')}
            onBlur={() => setFocusedField(null)}
            placeholder="Tu contraseña segura"
            className={cn(
              'w-full px-4 py-3 pr-12 bg-white/5 border border-white/10 rounded-lg',
              'focus:bg-white/10 focus:border-purple-400/50',
              'placeholder:text-gray-400/50',
              'transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-400/20',
              errors.password && 'border-red-400/50 focus:border-red-400/50 focus:ring-red-400/20'
            )}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-1 top-1/2 -translate-y-1/2 h-10 w-10 hover:bg-white/10 rounded-lg flex items-center justify-center transition-colors"
          >
            {showPassword ? (
              <EyeSlashIcon className="w-4 h-4 text-purple-300 group-hover:text-white transition-colors" />
            ) : (
              <EyeIcon className="w-4 h-4 text-purple-300 group-hover:text-white transition-colors" />
            )}
          </button>
          <div className={cn(
            'absolute inset-0 rounded-lg border-2 border-purple-400/0 transition-all duration-300 pointer-events-none',
            focusedField === 'password' && 'border-purple-400/30 shadow-lg shadow-purple-400/20'
          )} />
        </div>
        {errors.password && (
          <p className="text-sm text-red-400 mt-1">{errors.password}</p>
        )}
      </div>

      {/* Login Button */}
      <Button
        type="submit"
        disabled={isLoading || !formData.email || !formData.password}
        className={cn(
          'w-full h-12 bg-gradient-to-r from-blue-500 via-purple-600 to-amber-500',
          'hover:from-blue-600 hover:via-purple-700 hover:to-amber-600',
          'text-white font-semibold shadow-lg hover:shadow-xl',
          'transition-all duration-300',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'group relative overflow-hidden'
        )}
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          {isLoading ? (
            <LoadingSpinner size="sm" />
          ) : (
            <>
              Iniciar Sesión
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z"/>
              </svg>
            </>
          )}
        </span>

        {/* Button shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      </Button>

      {/* Links */}
      <div className="mt-6 space-y-4">
        {/* Register Link */}
        <div className="text-center">
          <p className="text-sm text-gray-400">
            ¿No tienes cuenta?{' '}
            <Link
              to="/register"
              className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
            >
              Regístrate aquí
            </Link>
          </p>
        </div>

        {/* Volver al inicio */}
        <div className="text-center">
          <Link
            to="/"
            className="text-sm text-gray-500 hover:text-gray-300 transition-colors flex items-center justify-center gap-1"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z"/>
            </svg>
            Volver al inicio
          </Link>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;