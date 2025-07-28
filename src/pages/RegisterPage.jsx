// src/pages/RegisterPage.jsx - SOLUCIÓN DEFINITIVA
import { useState, useCallback, memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { authService } from '../services/api';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import GlassCard from '../components/ui/GlassCard';
import { cn } from '../utils';

// SOLUCIÓN 1: Extraer InputField FUERA del componente
const InputField = memo(({
  label,
  name,
  type = 'text',
  placeholder,
  showPasswordToggle = false,
  value,
  onChange,
  onFocus,
  onBlur,
  focusedField,
  errors,
  showPassword,
  showConfirmPassword,
  onTogglePassword
}) => (
  <div className="space-y-2">
    <label
      htmlFor={name}
      className={cn(
        'text-sm font-medium transition-colors',
        focusedField === name ? 'text-blue-400' : 'text-foreground'
      )}
    >
      {label}
    </label>
    <div className="relative">
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder={placeholder}
        className={cn(
          'w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg',
          'focus:bg-white/10 focus:border-blue-400/50',
          'placeholder:text-gray-400/50',
          'transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400/20',
          showPasswordToggle && 'pr-12',
          errors[name] && 'border-red-400/50 focus:border-red-400/50 focus:ring-red-400/20'
        )}
        required
      />

      {showPasswordToggle && (
        <button
          type="button"
          onClick={onTogglePassword}
          className="absolute right-1 top-1/2 -translate-y-1/2 h-10 w-10 hover:bg-white/10 rounded-lg flex items-center justify-center transition-colors"
        >
          {(name === 'password' ? showPassword : showConfirmPassword) ? (
            <EyeSlashIcon className="w-4 h-4 text-gray-300 hover:text-blue-400 transition-colors" />
          ) : (
            <EyeIcon className="w-4 h-4 text-gray-300 hover:text-blue-400 transition-colors" />
          )}
        </button>
      )}

      {/* Efectos iguales al login */}
      <div className={cn(
        'absolute inset-0 rounded-lg border-2 border-blue-400/0 transition-all duration-300 pointer-events-none',
        focusedField === name && 'border-blue-400/30 shadow-lg shadow-blue-400/20'
      )} />
    </div>

    {errors[name] && (
      <p className="text-sm text-red-400 mt-1">{errors[name]}</p>
    )}
  </div>
));

InputField.displayName = 'InputField';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useToast();

  // SOLUCIÓN 2: Usar useCallback para evitar recrear funciones
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpiar errores cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  }, [errors]);

  const handleFocus = useCallback((name) => {
    setFocusedField(name);
  }, []);

  const handleBlur = useCallback(() => {
    setFocusedField(null);
  }, []);

  const handleTogglePassword = useCallback((field) => {
    if (field === 'password') {
      setShowPassword(prev => !prev);
    } else {
      setShowConfirmPassword(prev => !prev);
    }
  }, []);

  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!formData.first_name.trim()) {
      newErrors.first_name = 'El nombre es requerido';
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = 'El apellido es requerido';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const { confirmPassword, ...registerData } = formData;
      const response = await authService.register(registerData);

      if (response.data.success) {
        showToast('¡Cuenta creada exitosamente!', 'success');

        // Intentar login automático
        try {
          const loginResponse = await authService.login({
            email: formData.email,
            password: formData.password
          });

          if (loginResponse.data.success) {
            const { token, user } = loginResponse.data.data;
            login(token, user);
            navigate('/cars');
          } else {
            navigate('/login');
          }
        } catch (loginError) {
          console.log('Error en login automático:', loginError);
          navigate('/login');
        }
      } else {
        showToast(response.data.message || 'Error al crear la cuenta', 'error');
      }
    } catch (error) {
      console.error('Error en registro:', error);
      const message = error.response?.data?.message || 'Error al crear la cuenta';
      showToast(message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="w-full max-w-md relative z-10">
        {/* Logo Section - Mantén tus efectos hermosos */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500 via-blue-600 to-purple-500 shadow-2xl mb-6 animate-glow hover:shadow-3xl transition-all duration-300">
            <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,15C12.81,15 13.5,14.7 14.11,14.11C14.7,13.5 15,12.81 15,12C15,11.19 14.7,10.5 14.11,9.89C13.5,9.3 12.81,9 12,9C11.19,9 10.5,9.3 9.89,9.89C9.3,10.5 9,11.19 9,12C9,12.81 9.3,13.5 9.89,14.11C10.5,14.7 11.19,15 12,15M12,2C14.21,2 16.21,2.81 17.78,4.39C19.36,5.96 20.17,7.96 20.17,10.17C20.17,12.65 18.94,15.26 16.5,18C15.23,19.5 13.81,20.84 12.24,22C10.67,20.84 9.25,19.5 7.98,18C5.54,15.26 4.31,12.65 4.31,10.17C4.31,7.96 5.12,5.96 6.69,4.39C8.27,2.81 10.27,2 12.5,2H12Z"/>
            </svg>
          </div>

          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Únete a TuCarro
          </h1>

          <p className="text-gray-400">
            Crea tu cuenta y gestiona tus vehículos
          </p>
        </div>

        {/* Register Card - Mantén tus efectos hermosos */}
        <GlassCard className="p-8 hover-lift" intensity="strong" glow>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nombre y Apellido */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                label="Nombre"
                name="first_name"
                placeholder="Juan Carlos"
                value={formData.first_name}
                onChange={handleChange}
                onFocus={() => handleFocus('first_name')}
                onBlur={handleBlur}
                focusedField={focusedField}
                errors={errors}
              />
              <InputField
                label="Apellido"
                name="last_name"
                placeholder="Pérez"
                value={formData.last_name}
                onChange={handleChange}
                onFocus={() => handleFocus('last_name')}
                onBlur={handleBlur}
                focusedField={focusedField}
                errors={errors}
              />
            </div>

            {/* Email */}
            <InputField
              label="Correo Electrónico"
              name="email"
              type="email"
              placeholder="tu@email.com"
              value={formData.email}
              onChange={handleChange}
              onFocus={() => handleFocus('email')}
              onBlur={handleBlur}
              focusedField={focusedField}
              errors={errors}
            />

            {/* Contraseña */}
            <InputField
              label="Contraseña"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Mínimo 6 caracteres"
              showPasswordToggle={true}
              value={formData.password}
              onChange={handleChange}
              onFocus={() => handleFocus('password')}
              onBlur={handleBlur}
              focusedField={focusedField}
              errors={errors}
              showPassword={showPassword}
              onTogglePassword={() => handleTogglePassword('password')}
            />

            {/* Confirmar Contraseña */}
            <InputField
              label="Confirmar Contraseña"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Repite tu contraseña"
              showPasswordToggle={true}
              value={formData.confirmPassword}
              onChange={handleChange}
              onFocus={() => handleFocus('confirmPassword')}
              onBlur={handleBlur}
              focusedField={focusedField}
              errors={errors}
              showConfirmPassword={showConfirmPassword}
              onTogglePassword={() => handleTogglePassword('confirmPassword')}
            />

            {/* Register Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className={cn(
                'w-full h-12 bg-gradient-to-r from-green-500 via-blue-600 to-purple-500',
                'hover:from-green-600 hover:via-blue-700 hover:to-purple-600',
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
                    Crear Cuenta
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z"/>
                    </svg>
                  </>
                )}
              </span>

              {/* Button shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </Button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              ¿Ya tienes cuenta?{' '}
              <Link
                to="/login"
                className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
              >
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </GlassCard>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-400">
            © 2025 TuCarro Premium.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;