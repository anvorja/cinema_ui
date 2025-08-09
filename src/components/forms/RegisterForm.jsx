// src/components/forms/RegisterForm.jsx
import { useState, useCallback, memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import Button from '../ui/Button';
import LoadingSpinner from '../ui/LoadingSpinner';
import { cn } from '../../utils';

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
        onFocus={() => onFocus(name)}
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
          onClick={() => onTogglePassword(name)}
          className="absolute right-1 top-1/2 -translate-y-1/2 h-10 w-10 hover:bg-white/10 rounded-lg flex items-center justify-center transition-colors"
        >
          {(name === 'password' ? showPassword : showConfirmPassword) ? (
            <EyeSlashIcon className="w-4 h-4 text-gray-300 hover:text-blue-400 transition-colors" />
          ) : (
            <EyeIcon className="w-4 h-4 text-gray-300 hover:text-blue-400 transition-colors" />
          )}
        </button>
      )}

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

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
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
  const { register } = useAuth();
  const { showToast } = useToast();

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

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'El nombre es requerido';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'El apellido es requerido';
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
      const registerData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password
      };

      const result = await register(registerData);

      if (result.success) {
        showToast('¡Cuenta creada exitosamente!', 'success');
        navigate('/cars');
      } else {
        showToast(result.error || 'Error al crear la cuenta', 'error');
      }
    } catch (error) {
      console.error('Error en registro:', error);
      showToast('Error al crear la cuenta', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Nombre y Apellido */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField
          label="Nombre"
          name="firstName"
          placeholder="Tu nombre"
          value={formData.firstName}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          focusedField={focusedField}
          errors={errors}
        />
        <InputField
          label="Apellido"
          name="lastName"
          placeholder="Tu apellido"
          value={formData.lastName}
          onChange={handleChange}
          onFocus={handleFocus}
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
        onFocus={handleFocus}
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
        onFocus={handleFocus}
        onBlur={handleBlur}
        focusedField={focusedField}
        errors={errors}
        showPassword={showPassword}
        onTogglePassword={handleTogglePassword}
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
        onFocus={handleFocus}
        onBlur={handleBlur}
        focusedField={focusedField}
        errors={errors}
        showConfirmPassword={showConfirmPassword}
        onTogglePassword={handleTogglePassword}
      />

      {/* Botón Submit */}
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        {isLoading ? (
          <div className="flex items-center justify-center gap-2">
            <LoadingSpinner size="sm" />
            <span>Creando cuenta...</span>
          </div>
        ) : (
          'Crear Cuenta'
        )}
      </Button>

      {/* Login Link */}
      <div className="text-center pt-4 border-t border-white/10">
        <p className="text-gray-300">
          ¿Ya tienes cuenta?{' '}
          <Link
            to="/login"
            className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
          >
            Inicia sesión aquí
          </Link>
        </p>
      </div>
    </form>
  );
};

export default RegisterForm;