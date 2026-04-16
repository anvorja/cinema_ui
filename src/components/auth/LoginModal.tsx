// src/components/auth/LoginModal.jsx
import { useState } from 'react';
import { X, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useToast } from '../../hooks/useToast';
import ToastContainer from '../common/ToastContainer';
import useAuth from "../../hooks/useAuth.js";

const LoginModal = ({ isOpen, onClose, onSwitchToRegister }) => {
  const { login, loading } = useAuth();
  const { toasts, showToast, removeToast } = useToast();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // Validación básica
    if (!formData.email.trim()) {
      setErrors({ general: 'El email es requerido' });
      return;
    }
    if (!formData.password) {
      setErrors({ general: 'La contraseña es requerida' });
      return;
    }

    // DEBUG: Verificar qué se está enviando
    console.log('🔧 Login attempt with:', {
      email: formData.email,
      password: formData.password,
      emailLength: formData.email.length,
      passwordLength: formData.password.length,
      emailTrimmed: formData.email.trim(),
      hasWhitespace: formData.email !== formData.email.trim()
    });

    // Limpiar espacios en blanco
    const cleanCredentials = {
      email: formData.email.trim().toLowerCase(),
      password: formData.password
    };

    console.log('🧹 Cleaned credentials:', cleanCredentials);

    const result = await login(cleanCredentials);

    console.log('🔑 Login result:', result);

    if (result.success) {
      console.log('✅ Login successful, closing modal');

      // 🎉 TOAST DE ÉXITO
      showToast(`¡Bienvenido ${result.user.firstName || result.user.name}!`, 'success');

      // Cerrar modal después de un breve delay para que se vea el toast
      setTimeout(() => {
        onClose();
      }, 500);

    } else {
      console.log('❌ Login failed:', result.error);

      // El mensaje ya viene procesado desde getErrorMessage en api.js
      const errorMessage = result.error;

      showToast(errorMessage, 'error', 5000);
      setErrors({ general: errorMessage });
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl max-w-md w-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/20">
            <h2 className="text-2xl font-bold text-white">Iniciar Sesión</h2>
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
                autoComplete="email"
              />
            </div>

            {/* Password */}
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
                  placeholder="Tu contraseña"
                  required
                  autoComplete="current-password"
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 rounded-lg text-white font-medium transition-colors disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Iniciando sesión...
                </div>
              ) : (
                'Iniciar Sesión'
              )}
            </button>

            {/* Switch to Register */}
            <div className="text-center pt-4 border-t border-white/20">
              <p className="text-white/60">
                ¿No tienes cuenta?{' '}
                <button
                  type="button"
                  onClick={onSwitchToRegister}
                  className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                >
                  Regístrate aquí
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer
        toasts={toasts}
        onRemoveToast={removeToast}
      />
    </>
  );
};

export { LoginModal };