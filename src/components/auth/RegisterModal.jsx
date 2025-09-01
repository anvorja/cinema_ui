// src/components/auth/RegisterModal.jsx
import { useState } from 'react';
import { X, Mail, Lock, Eye, EyeOff, User, Phone } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const RegisterModal = ({ isOpen, onClose, onSwitchToLogin }) => {
  const { register, loading } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (formData.password !== formData.confirmPassword) {
      setErrors({ confirmPassword: 'Las contraseñas no coinciden' });
      return;
    }

    const result = await register(formData);
    if (result.success) {
      onClose();
    } else {
      setErrors({ general: result.error });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <h2 className="text-2xl font-bold text-white">Crear Cuenta</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errors.general && (
            <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300">
              {errors.general}
            </div>
          )}

          {/* Names */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-white/60">
                <User className="w-4 h-4" />
                Nombre
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:border-blue-500/50 focus:outline-none"
                placeholder="Tu nombre"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/60">Apellido</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:border-blue-500/50 focus:outline-none"
                placeholder="Tu apellido"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-white/60">
              <Mail className="w-4 h-4" />
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:border-blue-500/50 focus:outline-none"
              placeholder="tu@email.com"
              required
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-white/60">
              <Phone className="w-4 h-4" />
              Teléfono
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:border-blue-500/50 focus:outline-none"
              placeholder="3001234567"
              required
            />
          </div>

          {/* Passwords */}
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-white/60">
                <Lock className="w-4 h-4" />
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:border-blue-500/50 focus:outline-none pr-12"
                  placeholder="Mínimo 6 caracteres"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white/60">Confirmar Contraseña</label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:border-blue-500/50 focus:outline-none"
                placeholder="Repite tu contraseña"
                required
              />
              {errors.confirmPassword && (
                <p className="text-red-300 text-sm">{errors.confirmPassword}</p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 rounded-lg text-white font-medium transition-colors"
          >
            {loading ? 'Registrando...' : 'Crear Cuenta'}
          </button>

          {/* Switch to Login */}
          <div className="text-center pt-4 border-t border-white/20">
            <p className="text-white/60">
              ¿Ya tienes cuenta?{' '}
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="text-blue-400 hover:text-blue-300 font-medium"
              >
                Inicia sesión aquí
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export { RegisterModal };